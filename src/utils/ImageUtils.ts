import * as THREE from "three";
/**
 * 判断图片是否为全景图片
 * @param url
 */
const isPanoramic = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        new THREE.TextureLoader().load(url, (data) => {
            // 定义一个阈值，例如宽度至少为高度的两倍以上
            const ratio = data.image.naturalWidth / data.image.naturalHeight;
            // 允许±5%的误差范围
            resolve(Math.abs(ratio - 2) <= 0.1);
        }, () => {}, () => {
            resolve(false);
        });
    });
}

export {
    isPanoramic
}