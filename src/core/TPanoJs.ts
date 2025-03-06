import * as THREE from "three";
import { zh } from "../i18n/zh.ts";
import { en } from "../i18n/en.ts";
import i18next, { Resource, t } from "i18next";
import '../styles/index.css';
import '../styles/toolbar.css';
import { Toolbar } from "../components/Toolbar.ts";
import { defineCustomElement } from "../utils/DomUtils.ts";

defineCustomElement('t-pano-toolbar', Toolbar);

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

export interface TPanoJsOptions {
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
    rotateAnimateController: boolean;
    /**
     * 文件列表
     */
    fileList: FileList[];
    /**
     * @description 主题
     * @default light
     */
    theme?: 'dark' | 'light';
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
     * 加载中事件
     */
    onLoad?: (e: LoadTexture) => void;
    /**
     * dom构建完成
     * @param opts
     */
    onCreated?: (opts: TPanoJs) => void;
    /**
     * 图片切换事件
     */
    switchLoad?: (e: SwitchTexture) => void;

    debug?: boolean;
}

const defaultOptions: Partial<TPanoJsOptions> = {
    lang: 'zh',
    theme: 'light',
    mouseController: true,
    deviceOrientationControls: false,
    rotateAnimateController: false,
    debug: false,
};

export class TPanoJs {

    options: TPanoJsOptions;
    /**
     * t-pano全景dom
     */
    container!: HTMLDivElement;
    loadTextureLoaderIndex: number = 0;
    texture: THREE.Texture[] = [];
    loadTextureMsg!: LoadTexture;
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    /**
     * @description 手机端多点触控 用来开闭鼠标控制支持的，如果用户在进行放大手势，应该将鼠标视角控制锁定
     */
    mouseFovControllerSport = true;

    toolbar!: Toolbar;
    constructor(options: TPanoJsOptions) {
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
        // 主题-白/黑
        rootEl.classList.add(`t-pano-theme-${this.options.theme}`);
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
        let mesh = new THREE.Mesh(geometry);
        this.scene.add(mesh);
        this.loadTextureLoader(this.loadTextureLoaderIndex);

        // 体感控制

        // 鼠标控制
        this.mouseController();
        // 启动多点触控
        this.phoneController();

        // 动画绑定
        this.animate();

        // 镜头自动旋转 60帧
        setTimeout(() => this.rotateAnimate, 1000 / 60);

        this.container.addEventListener('pointerdown', ()=> {
            if (this.options.mouseController) {
                this.options.rotateAnimateController = false;
            }
        });

        // 工具栏
        this.toolbar = new Toolbar();
        this.toolbar.onCreate(this.options, this.camera);
        rootEl.appendChild(this.toolbar);
        // 初始化方法
        this.options.onCreated?.(this);
    }

    rotateAnimate() {
        // 相机在xoz平面上的角度
        let anglexoz = -90;
        // 镜头自由旋转
        const rotateAnimateController = this.options.rotateAnimateController;
        if (rotateAnimateController && !this.options.deviceOrientationControls) {
            anglexoz += 0.1;
            if (anglexoz > 360) {
                anglexoz = 0;
            }
            let x = Math.cos(anglexoz * Math.PI / 180) * 500;
            let z = Math.sin(anglexoz * Math.PI / 180) * 500;
            this.camera.lookAt(x, 0, z);
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
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

    mouseController() {
        //初始化鼠标控制用变量
        let isUserInteracting = false, onPointerDownMouseX = 0, onPointerDownMouseY = 0,
            lon = -90, onPointerDownLon = 0, lat = 0, onPointerDownLat = 0,
            phi = 0, theta = 0;

        //鼠标控制视角、响应热点交互
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onMouseMove = (event: MouseEvent)=> {
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
        this.container.addEventListener('pointerdown', (event)=> {
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
                if (this.options.debug) {
                    console.log('点击坐标：', intersects[i].point);
                }
                /*//检测点击热点是否跳转场地
                if (intersects[i].object.jumpTo != null && i == 0) {
                    switchPhotoN(intersects[i].object.jumpTo);
                    console.log(scene);
                }*/
            }
        }

        const onPointerDown = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            //console.log(camera);
            onMouseMove(event);
            if (!event.isPrimary) return;
            isUserInteracting = true;
            onPointerDownMouseX = event.clientX;
            onPointerDownMouseY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }

        /**
         * 用户滚动鼠标滚轮或类似的输入设备时触发的事件
         * @param event 事件
         */
        const onDocumentMouseWheel = (event: WheelEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            const fov = this.camera.fov + event.deltaY * 0.05;
            this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
            this.camera.updateProjectionMatrix();
        }

        this.container.style.touchAction = 'none';
        this.container.addEventListener('pointerdown', onPointerDown);
        // 监听鼠标滚轮事件
        document.addEventListener('wheel', onDocumentMouseWheel);
        //计算摄像机目前视角状态，保持当前状态，在当前状态上附加变化
        lon = -1 * THREE.MathUtils.radToDeg(this.camera.rotation.y) - 90;//经度
        lat = THREE.MathUtils.radToDeg(this.camera.rotation.x);//纬度


        const onPointerMove = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            if (!event.isPrimary) return;
            //触控灵敏度 //想写个函数来线性计算这里的灵敏度，暂时没找到合适的函数
            const rate = this.isPhone() ? 0.4 : 0.1;

            //缩放视角时 暂停相机旋转
            if (this.mouseFovControllerSport) {
                lon = (onPointerDownMouseX - event.clientX) * rate + onPointerDownLon;
                //console.log('calc0:'+onPointerDownLat);
                lat = (event.clientY - onPointerDownMouseY) * rate + onPointerDownLat;
                //console.log('calc1:'+lat);
                update();
            }
        }

        const onPointerUp = (event: PointerEvent)=> {
            if (!this.options.mouseController) {
                return;
            }
            if (!event.isPrimary) return;
            isUserInteracting = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        const update = ()=> {
            if (!isUserInteracting) {
                //lon += 0.1;
            }
            //console.log('lon->' + lon, 'lat->' + lat);
            lat = Math.max(- 85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);
            const x = 500 * Math.sin(phi) * Math.cos(theta);
            const y = 500 * Math.cos(phi);
            const z = 500 * Math.sin(phi) * Math.sin(theta);
            //console.log('x=' + x + 'y=' + y + 'z=' + z);
            //console.log('x=' + THREE.MathUtils.radToDeg(camera.rotation.x), 'y=' + THREE.MathUtils.radToDeg(camera.rotation.y));
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
            this.texture[index] = new THREE.TextureLoader().load(photo.url, () => this.loadTextureLoaderEnd);
        }
    }

    loadTextureLoaderEnd() {
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

    changeLocal(lang: TPanoJsOptions['lang']) {
        this.destroy();
        this.options.lang = lang;
        i18next.changeLanguage(lang);
        this.initialize();
        return this;
    }

    changeTheme(theme?: "dark" | "light") {
        const rootEl = typeof this.options.container === "string" ?
                document.querySelector(this.options.container) as Element : this.options.container;
        if (!theme) {
            theme = this.options.theme === "dark" ? "light" : "dark";
        }
        this.destroy();
        rootEl.classList.remove(`t-pano-theme-${this.options.theme}`);
        rootEl.classList.add(`t-pano-theme-${theme}`);
        this.options.theme = theme;
        this.initialize();
        return this;
    }
}