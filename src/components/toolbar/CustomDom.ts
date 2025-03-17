import { AbstractToolbar } from "./AbstractToolbar.ts";
import { Custom } from "../../core/PanoramicView.ts";

export class CustomDom extends AbstractToolbar {

    config?: Custom;

    constructor() {
        super();
    }

    onConfig(config: Custom) {
        this.config = config;
        if (config.html) {
            this.template = config.html;
        } else if (config.icon) {
            this.template = `<div style="height: 16px">${config.icon}</div>`;
        }

        this.addEventListener("click", () => {
            if (this.panoramic.camera && this.config && this.config.onClick) {
                this.config.onClick(this.panoramic);
            }
        });
    }
}