import { PanoramicView } from "../../core/PanoramicView.ts";

export class AbstractToolbar extends HTMLElement {

    template = '';
    panoramic!: PanoramicView;
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

    onCreate(panoramic: PanoramicView) {
        this.panoramic = panoramic;
    }
}