import { TPanoJsOptions } from "../../core/TPanoJs.ts";
import * as THREE from "three";

export class AbstractToolbar extends HTMLElement {

    template = '';
    options!: TPanoJsOptions;
    camera!: THREE.PerspectiveCamera;
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.template;
    }

    protected registerClickListener() {
        this.addEventListener("click", () => {
            this.onClick();
        })
    }

    onClick() {

    }

    onCreate(options: TPanoJsOptions, camera: THREE.PerspectiveCamera) {
        this.options = options;
        this.camera = camera;
    }
}