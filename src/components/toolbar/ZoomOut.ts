import { AbstractToolbar } from "./AbstractToolbar.ts";
import * as THREE from "three";

export class ZoomOut extends AbstractToolbar {

    constructor() {
        super();
        this.template = `
            <svg t="1739257151564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6194" width="200" height="200"><path d="M889.6 829.44l-170.666667-170.666667a104.106667 104.106667 0 0 0-18.346666-14.933333l-42.666667-29.44A298.666667 298.666667 0 1 0 426.666667 725.333333a298.666667 298.666667 0 0 0 186.453333-65.28l32 42.666667a110.933333 110.933333 0 0 0 12.8 15.36l170.666667 170.666667a21.333333 21.333333 0 0 0 30.293333 0l29.866667-29.866667a21.333333 21.333333 0 0 0 0.853333-29.44zM426.666667 640a213.333333 213.333333 0 1 1 213.333333-213.333333 213.333333 213.333333 0 0 1-213.333333 213.333333zM320 389.12a21.333333 21.333333 0 0 0-21.333333 21.333333v32.426667a21.333333 21.333333 0 0 0 21.333333 21.333333h213.333333a21.333333 21.333333 0 0 0 21.333334-21.333333v-32.426667a21.333333 21.333333 0 0 0-21.333334-21.333333z" p-id="6195"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        this.panoramic.closeRateAnimate();
        const fov = this.panoramic.camera.fov + 1;
        this.panoramic.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        this.panoramic.camera.updateProjectionMatrix();
    }
}