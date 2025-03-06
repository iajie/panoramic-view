import { AbstractToolbar } from "./toolbar/AbstractToolbar.ts";
import { Custom, TPanoJsOptions } from "../core/TPanoJs.ts";
import * as THREE from "three";
import { t } from "i18next";
import tippy from "tippy.js";
import { CustomDom } from "./toolbar/CustomDom.ts";
import { defineCustomElement } from "../utils/DomUtils.ts";
import { ShowList } from "./toolbar/ShowList.ts";
import { Import } from "./toolbar/Import.ts";
import { ZoomIn } from "./toolbar/ZoomIn.ts";
import { ZoomOut } from "./toolbar/ZoomOut.ts";
import { Reset } from "./toolbar/Reset.ts";
import { Switch } from "./toolbar/Function.ts";

const defaultToolbarKeys = ["show-list", "import", "zoom-in", "zoom-out", "reset", "switch"];

defineCustomElement("t-pano-toolbar-show-list", ShowList);
defineCustomElement("t-pano-toolbar-import", Import);
defineCustomElement("t-pano-toolbar-zoom-in", ZoomIn);
defineCustomElement("t-pano-toolbar-zoom-out", ZoomOut);
defineCustomElement("t-pano-toolbar-reset", Reset);
defineCustomElement("t-pano-toolbar-switch", Switch);

export class Toolbar extends HTMLElement {

    toolbar: AbstractToolbar[] = [];
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("t-pano-toolbar");
        for (let button of this.toolbar) {
            this.appendChild(button);
        }
    }

    onCreate(options: TPanoJsOptions, camera: THREE.PerspectiveCamera) {
        let toolbarKeys = options.toolbarKeys || defaultToolbarKeys;
        toolbarKeys = toolbarKeys.filter((tool) => {
            if (typeof tool === "string") {
                return !options.toolbarExcludeKeys?.includes(tool);
            }
            return true;
        });
        this.initToolbarKeys(options, camera, toolbarKeys);
    }

    initToolbarKeys(options: TPanoJsOptions, camera: THREE.PerspectiveCamera, toolbarKeys: (string | Custom)[]) {
        for (let i = 0; i < toolbarKeys.length; i++) {
            let toolbarKey = toolbarKeys[i];
            if (!toolbarKey) continue;
            try {
                if (typeof toolbarKey === "string") {
                    toolbarKey = toolbarKey.trim();
                    const button = document.createElement(`t-pano-toolbar-${toolbarKey}`) as AbstractToolbar;
                    button.style.display = toolbarKey === "switch" ? "block" : "none";
                    button.classList.add("t-pano-toolbar-item");
                    button.onCreate(options, camera);
                    const tip = t(toolbarKey) as string;
                    button.setAttribute("data-title", tip);
                    tip && tippy(button, {
                        appendTo: document.querySelector('.t-pano-container')!,
                        content: tip,
                        theme: "t-pano-tip",
                        arrow: true,
                    });
                    this.toolbar.push(button);
                } else {
                    const custom = toolbarKey as Custom;
                    const button = document.createElement("t-pano-toolbar-custom") as CustomDom;
                    button.classList.add("t-pano-toolbar-item");
                    if (custom.id) {
                        button.setAttribute("id", custom.id);
                    }
                    if (custom.className) {
                        button.classList.add(custom.className);
                    }
                    button.onCreate(options, camera);
                    button.onConfig(custom);
                    if (custom.tip) {
                        const tip = t(custom.tip) as string;
                        tip && tippy(button, {
                            appendTo: document.querySelector('.t-pano-container')!,
                            content: tip,
                            theme: 'easy-bpmn-designer-tip',
                            arrow: true,
                        });
                    }
                    this.toolbar.push(button);
                }
            } catch (e) {
                console.error("创建工具栏异常", e);
            }
        }
    }
}