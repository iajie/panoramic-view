import * as THREE from "three";
import { zh } from "../i18n/zh.ts";
import { en } from "../i18n/en.ts";
import i18next, { Resource, t } from "i18next";
import '../styles/index.css';
import '../styles/toolbar.css';
import '../styles/loading.css';
import { Toolbar } from "../components/Toolbar.ts";
import { defineCustomElement, hide, show } from "../utils/DomUtils.ts";
import { Loading } from "../components/Loading.ts";
import { JelleAnimator } from "../utils/Animation.ts";
import { FileListBox } from "../components/FileListBox.ts";

defineCustomElement('t-pano-toolbar', Toolbar);
defineCustomElement('t-pano-loading', Loading);
defineCustomElement('t-pano-file-box', FileListBox);

export interface FileList {
    name: string;
    url: string;
    type?: 'image' | 'video';
    /**
     * 修改相机视野角度，可以单独为pc和手机设置不同值
     */
    fov?: {
        pc: number;
        phone: number;
    }
}

export interface Custom {
    id?: string;
    className?: string;
    icon?: string;
    html?: string;
    tip?: string;
    onClick?: (event: MouseEvent, camera: THREE.PerspectiveCamera) => void;
}

interface LoadTexture {
    all: number;
    loading: {
        id: number;
        name?: string;
    },
    leftOver: number;
}

interface SwitchTexture {
    loading: {
        id: number;
        name?: string;
    },
    status: 'end' | 'loading';
}

export interface PanoramicViewOptions {
    container: Element | string;
    /**
     * @description 体感控制开关，true表示打开，false表示关闭
     * @defaultValue false
     */
    deviceOrientationControls?: boolean;
    /**
     * 鼠标控制
     */
    mouseController?: boolean;
    /**
     * @description 镜头自动旋转
     */
    rotateAnimateController?: boolean;
    /**
     * 文件列表
     */
    fileList: FileList[];
    /**
     * @description 语言
     * @default zh
     */
    lang?: string | 'zh' | 'en';
    /**
     * @description 国际化
     */
    i18n?: Record<string, Record<string, string>>;
    /**
     * 工具栏
     */
    toolbarKeys?: (string | Custom)[];
    /**
     * 工具栏排除
     */
    toolbarExcludeKeys?: string[];
    /**
     * 加载效果-全局的
     */
    loading?: boolean;
    /**
     * 加载中事件
     */
    onLoad?: (e: LoadTexture) => void;
    /**
     * dom构建完成
     * @param opts
     */
    onCreated?: (opts: PanoramicView) => void;
    /**
     * 图片切换事件
     */
    switchLoad?: (e: SwitchTexture) => void;

    debug?: boolean;
}

const defaultOptions: Partial<PanoramicViewOptions> = {
    lang: 'zh',
    mouseController: true,
    deviceOrientationControls: false,
    rotateAnimateController: true,
    debug: false,
    loading: false,
};

export class PanoramicView {

    options: PanoramicViewOptions;
    /**
     * t-pano全景dom
     */
    container!: HTMLDivElement;
    loadTextureLoaderIndex: number = 0;
    texture: THREE.Texture[] = [];
    loadTextureMsg!: LoadTexture;
    scene!: THREE.Scene;
    mesh!: THREE.Mesh;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    /**
     * @description 镜头角度
     */
    anglexoz: number = -90;
    rotateAnimateTimer: number | null = null;
    /**
     * @description 手机端多点触控 用来开闭鼠标控制支持的，如果用户在进行放大手势，应该将鼠标视角控制锁定
     */
    mouseFovControllerSport = true;

    toolbar!: Toolbar;
    loading!: Loading;
    fileListBox!: FileListBox;
    constructor(options: PanoramicViewOptions) {
        this.options = { ...defaultOptions, ...options };
        this.initialize();
    }

    /**
     * 初始化语言-国际化
     * @private
     */
    private initialize() {
        const i18nConfig = this.options.i18n || {};
        const resources = {
            en: { translation: { ...en, ...i18nConfig.en } },
            zh: { translation: { ...zh, ...i18nConfig.zh } },
        } as Resource;
        for (let key of Object.keys(i18nConfig)) {
            if (key != "en" && key != "zh") {
                resources[key] = {
                    translation: { ...i18nConfig[key] },
                };
            }
        }
        i18next.init({ lng: this.options.lang, resources }).then(() => {
            this.initPano();
        });
    }

    /**
     * 初始化组件
     * @private
     */
    private initPano() {
        if (!this.options.fileList || !this.options.fileList.length) {
            throw new Error(t("noFindFile"));
        }
        // 根据传递container属性获取父级传递的数据是否为id，如果是则转为dom
        const rootEl = typeof this.options.container === "string" ?
            document.querySelector(this.options.container) as Element : this.options.container;
        // 获取父级dom class
        this.container = rootEl.querySelector(".t-pano-container")!;
        // 如果没有就创建
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.classList.add("t-pano-container");
        }
        rootEl.appendChild(this.container);
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        //初始化场景、相机、渲染器
        this.scene = new THREE.Scene();
        const fov = this.isPhone() ? 90 : 60;
        //创建相机
        this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
        //camera.lookAt(500, 0, 0);//视角矫正
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x272727, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.append(renderer.domElement);
        this.renderer = renderer;
        //生成全景图片3D对象
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        this.mesh = new THREE.Mesh(geometry);
        this.scene.add(this.mesh);

        this.loadTextureLoader(this.loadTextureLoaderIndex);

        // 体感控制

        // 鼠标控制
        this.mouseController();
        // 启动多点触控
        this.phoneController();
        // 相机位置移动
        this.wardKeydown();
        // 动画绑定
        this.animate();

        // 自转动画
        this.autoAnimate();

        // 点击后停止自转
        this.container.addEventListener('pointerdown', ()=> {
            if (this.options.mouseController) {
                this.options.rotateAnimateController = false;
                this.autoAnimate();
            }
        });

        // 工具栏
        this.toolbar = new Toolbar();
        this.toolbar.onCreate(this);
        rootEl.appendChild(this.toolbar);

        // 加载动画
        this.loading = new Loading();
        this.container.appendChild(this.loading);

        // 文件显示栏
        this.initFileList();

        /** 重设宽高 **/
        // this.loadAnimate();
        // this.resizeRendererToDisplaySize(window.innerWidth, window.innerHeight);
        // 初始化方法
        this.options.onCreated?.(this);
    }

    private initFileList() {
        this.fileListBox = new FileListBox(this);
        this.container.appendChild(this.fileListBox);
    }

    /**
     * 关闭旋转动画
     */
    closeRateAnimate() {
        this.options.rotateAnimateController = false;
        if (this.rotateAnimateTimer) {
            clearInterval(this.rotateAnimateTimer);
            this.rotateAnimateTimer = null;
        }
    }

    /**
     * 自转动画
     */
    autoAnimate() {
        // 镜头自动旋转 60帧
        if (!this.rotateAnimateTimer) {
            this.rotateAnimateTimer = setInterval(() => this.rotateAnimate(), 1000 / 60);
        } else {
            clearInterval(this.rotateAnimateTimer);
            this.rotateAnimateTimer = null;
        }
    }

    private loadAnimate() {
        show(this.loading);
        JelleAnimator.create(".t-pano-loading-bar-x").stop();
        JelleAnimator.create(".t-pano-loading-bar-x").animate({
            width: "100%"
        }, 1000);
        setTimeout(() => hide(this.loading), 1500);
    }

    private closeLoadAnimate() {
        hide(this.loading);
    }

    private rotateAnimate() {
        // 镜头自由旋转
        const rotateAnimateController = this.options.rotateAnimateController;
        if (rotateAnimateController && !this.options.deviceOrientationControls) {
            this.anglexoz += 0.1;
            if (this.anglexoz > 360) {
                this.anglexoz = 0;
            }
            let x = Math.cos(this.anglexoz * Math.PI / 180) * 500;
            let z = Math.sin(this.anglexoz * Math.PI / 180) * 500;
            this.camera.lookAt(x, 0, z);
        }
    }

    private animate() {
        // 这个动画很重要，涉及到鼠标长按后滑动的镜头
        requestAnimationFrame(() => this.animate());
        //热点摆动
        for (let i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name == 'hotspot') {
                // if (hotspotAnimate_count >= 400) {
                //     hotspotAnimate_count = 1;
                //     scene.children[i].position.y = hotspotAnimate_temp[i];
                // }
                //
                // if (hotspotAnimate_count <= 200) {
                //     scene.children[i].position.y = scene.children[i].position.y + 0.04;
                // } else {
                //     scene.children[i].position.y = scene.children[i].position.y - 0.04;
                // }
                //
                // hotspotAnimate_count++;
            }
        }
        this.render();
    }

    phoneController() {
        let oldL = 0, x1, x2, y1, y2, l;
        document.addEventListener('touchstart', (event)=> {
            if (!this.options.mouseController) {
                return;
            }
            if (event.touches.length == 2) {
                this.mouseFovControllerSport = false;
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;
                oldL = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));//求两点间长度
            } else {
                this.mouseFovControllerSport = true;
            }
        }, false);
        document.addEventListener('touchmove', (event)=> {
            if (!this.options.mouseController) {
                return;
            }
            event.preventDefault(); // prevent scrolling
            event.stopPropagation();
            if (event.touches.length == 2) {
                x1 = event.touches[0].clientX;
                x2 = event.touches[1].clientX;
                y1 = event.touches[0].clientY;
                y2 = event.touches[1].clientY;
                //求两点间长度
                l = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
                //长度增量
                let lAdd = l - oldL;
                oldL = l;
                const fov = this.camera.fov - lAdd * 0.3;
                this.camera.fov = THREE.MathUtils.clamp(fov, 10, 90);
                this.camera.updateProjectionMatrix();
            }
        }, false);
    }

    wardKeydown() {
        document.addEventListener("keydown", (event)=> {
            console.log("按键", event.code);
            switch (event.code) {
                case "ArrowUp":
                    this.camera.position.z += 5 * Math.PI; // 相机向上移动
                    break;
                case "ArrowDown":
                    this.camera.position.z -= 5 * Math.PI; // 相机向下移动
                    break;
                case "ArrowLeft":
                    this.camera.position.x -= 5 * Math.PI; // 相机向左移动
                    break;
                case "ArrowRight":
                    this.camera.position.x += 5 * Math.PI; // 相机向右移动
                    break;
            }
        });
    }

    mouseController() {
        //初始化鼠标控制用变量
        let isUserInteracting = false, onPointerDownMouseX = 0, onPointerDownMouseY = 0,
            lon = -90, onPointerDownLon = 0, lat = 0, onPointerDownLat = 0,
            phi = 0, theta = 0;

        //鼠标控制视角、响应热点交互
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onMouseMove = (event: MouseEvent) => {
            if (!this.options.mouseController) {
                return;
            }
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
            mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
            mouse.y = - (event.clientY / this.container.clientHeight) * 2 + 1;
            this.render();
        }

        //鼠标按下到松开期间有没有移动，如果没有移动说明点击的是热点，否则是移动视角
        let clientX: number, clientY: number;
        this.container.addEventListener('pointerdown', (event) => {
            if (!this.options.mouseController) {
                return;
            }
            clientX = event.clientX;
            clientY = event.clientY;
        });
        this.container.addEventListener('pointerup', (event) => {
            if (!this.options.mouseController) {
                return;
            }
            const distance = Math.sqrt(Math.pow(Math.abs(event.clientX - clientX), 2) +
                Math.pow(Math.abs(event.clientY - clientY), 2));//鼠标按下到松开期间移动距离
            if (distance <= 10) {
                //这是个容差设计，在手机端如果不给差值，很可能用户的点击和松开之间会有误差
                positionClick();
            }
        });

        //获取点击坐标，拾取点击对象
        const positionClick = ()=> {
            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, this.camera);
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects(this.scene.children);
            for (let i = 0; i < intersects.length; i++) {
                if (this.options.debug == true) {
                    console.log('点击坐标：', intersects[i].point);
                }
                //检测点击热点是否跳转场地
                // if (intersects[i].object.jumpTo != null && i == 0) {
                //     switchPhotoN(intersects[i].object.jumpTo);
                //     console.log(scene);
                // }
            }
        }

        this.container.style.touchAction = 'none';
        this.container.addEventListener('pointerdown', (e) => onPointerDown(e));
        this.container.addEventListener('wheel', (e) => onDocumentMouseWheel(e));
        //计算摄像机目前视角状态，保持当前状态，在当前状态上附加变化
        lon = -1 * THREE.MathUtils.radToDeg(this.camera.rotation.y) - 90;//经度
        lat = THREE.MathUtils.radToDeg(this.camera.rotation.x);//纬度

        const onPointerDown = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            onMouseMove(event);
            if (!event.isPrimary) return;
            isUserInteracting = true;
            onPointerDownMouseX = event.clientX;
            onPointerDownMouseY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
            this.container.addEventListener('pointermove', onPointerMove);
            this.container.addEventListener('pointerup', onPointerUp);
        }

        const onPointerMove = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            if (!event.isPrimary) return;
            let rate = this.isPhone() ? 0.4 : 0.1;//触控灵敏度

            //缩放视角时 暂停相机旋转
            if (this.mouseFovControllerSport) {
                lon = (onPointerDownMouseX - event.clientX) * rate + onPointerDownLon;
                lat = (event.clientY - onPointerDownMouseY) * rate + onPointerDownLat;
                update();
            }
        }

        const onPointerUp = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            if (!event.isPrimary) return;
            isUserInteracting = false;
            this.container.removeEventListener('pointermove', onPointerMove);
            this.container.removeEventListener('pointerup', onPointerUp);
        }

        const onDocumentMouseWheel = (event: WheelEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            const fov = this.camera.fov + event.deltaY * 0.05;
            this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
            this.camera.updateProjectionMatrix();
        }

        const update = () => {
            if (!isUserInteracting) {
                //lon += 0.1;
            }
            lat = Math.max(- 85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);
            const x = 500 * Math.sin(phi) * Math.cos(theta);
            const y = 500 * Math.cos(phi);
            const z = 500 * Math.sin(phi) * Math.sin(theta);
            this.camera.lookAt(x, y, z);
        }
    }

    render() {
        if (this.options.deviceOrientationControls) {

        }
        // 渲染3d
        this.renderer.render(this.scene, this.camera);
    }

    loadTextureLoader(index: number) {
        const photo = this.options.fileList[index];
        // 如果是视频
        if (photo.type == 'video') {
            const id = `t-pano-video-${index}`;
            this.container.insertAdjacentHTML('beforeend',`
                <video id="${id}" loop muted style="display: none;" crossOrigin="anonymous" playsinline >
                    <source src="${photo.url}">
                </video>`);
            let videoDom = document.getElementById(id)! as HTMLVideoElement;
            videoDom.play();
            this.texture[index] = new THREE.VideoTexture(videoDom);
            //没有找到监听加载的办法，暂时使用延迟模拟回调
            setTimeout(() => {
                this.loadTextureLoaderEnd();
            }, 2000);
        } else {
            this.texture[index] = new THREE.TextureLoader().load(photo.url, () => this.loadTextureLoaderEnd(), (e) => {
                console.log("onProgress的回调", e);
            }, (err) => {
                console.error("加载错误回调", err);
            });
        }
    }

    loadTextureLoaderEnd() {
        // 加载中动画
        this.loadAnimate();
        let i = this.loadTextureLoaderIndex;
        const photo = this.options.fileList[i];
        const fileLength = this.options.fileList.length;
        this.texture[i].name = photo.name;
        // 加载的信息
        this.loadTextureMsg = {
            all: fileLength,
            loading: { id: i + 1, name: photo.name },
            leftOver: fileLength - i - 1
        };
        // 加载中事件传递
        this.options.onLoad?.(this.loadTextureMsg);
        if (i == 0) {
            // 初始化加载第一张图片
            this.switchPhotoN(0);
        }
        // 下一张
        if (i < fileLength - 1) {
            this.loadTextureLoader(++this.loadTextureLoaderIndex);
        }
    }

    switchPhotoN(index: number) {
        console.log("ss", index);
        let response = {
            status: 'ERROR',
            msg: '系统出错'
        }
        const fileList = this.options.fileList;
        if (index < this.options.fileList.length && index >= 0) {
            //回调通知：注意全景图片换页事件开始，应该检查全景图片是否下载完毕，主要是用于做进度提示功能
            if (this.loadTextureMsg.all - this.loadTextureMsg.leftOver >= index + 1) {
                //已加载完成，无需等待
                this.options.switchLoad?.({
                    loading: {
                        id: index + 1,
                        name: fileList[index].name
                    },
                    status: 'end'
                });
                response = this.switchGo(index);
                this.closeLoadAnimate();
            } else {
                //未加载完成，请等待一秒后再尝试
                this.options.switchLoad?.({
                    loading: {
                        id: index + 1,
                        name: fileList[index].name
                    },
                    status: 'loading'
                });
                setTimeout(() => this.switchPhotoN(index), 1000);
            }
        } else {
            response.msg = '无效的照片索引';
        }
        return response;
    }

    switchGo(index: number) {
        const fileList = this.options.fileList;
        const photo = fileList[index];
        let fov = null;
        if (this.isPhone()) {
            //手机端视角
            if (photo.fov) {
                fov = photo.fov.phone;
            }
        } else {
            //pc端视角
            if (photo.fov) {
                fov = photo.fov.pc;
            }
        }
        if (fov != null) {
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
        } else {
            fov = this.isPhone() ? 90 : 60;
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
        }
        this.mesh.material = new THREE.MeshBasicMaterial({ map: this.texture[index] });
        return {
            status: 'OK',
            msg: '切换成功'
        }
    }

    isPhone() {
        return this.container.clientWidth <= 700 || this.container.clientWidth < this.container.clientHeight;
    }

    getOptions() {
        return this.options;
    }

    destroy() {
        this.container.remove();
    }

    /**
     * 宽高重设
     * @param width 宽度
     * @param height 高度
     */
    resizeRendererToDisplaySize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.renderer.domElement.style.width = width + 'px';
        this.renderer.domElement.style.height = height + 'px';
    }

    changeLocal(lang: PanoramicViewOptions['lang']) {
        this.destroy();
        this.options.lang = lang;
        i18next.changeLanguage(lang);
        this.initialize();
        return this;
    }

}