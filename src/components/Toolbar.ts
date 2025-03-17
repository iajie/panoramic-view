import { AbstractToolbar } from "./toolbar/AbstractToolbar.ts";
import { Custom, PanoramicView } from "../core/PanoramicView.ts";
import { t } from "i18next";
import tippy from "tippy.js";
import { CustomDom } from "./toolbar/CustomDom.ts";
import { defineCustomElement } from "../utils/DomUtils.ts";
import { ShowList } from "./toolbar/ShowList.ts";
import { ZoomIn } from "./toolbar/ZoomIn.ts";
import { ZoomOut } from "./toolbar/ZoomOut.ts";
import { Reset } from "./toolbar/Reset.ts";
import { Switch } from "./toolbar/Function.ts";
import { AutoView } from "./toolbar/AutoView.ts";
import { Upward } from "./toolbar/Upward.ts";
import { Downward } from "./toolbar/Downward.ts";
import { Leftward } from "./toolbar/Leftward.ts";
import { Rightward } from "./toolbar/Rightward.ts";
import { Debug } from "./toolbar/Debug.ts";

const defaultToolbarKeys = [
    "zoom-in", "zoom-out", "reset", "auto-view",
    "up", "down", "left", "right", "show-list",
    "debug", "switch",
];

defineCustomElement("t-panoramic-toolbar-show-list", ShowList);
defineCustomElement("t-panoramic-toolbar-zoom-in", ZoomIn);
defineCustomElement("t-panoramic-toolbar-zoom-out", ZoomOut);
defineCustomElement("t-panoramic-toolbar-reset", Reset);
defineCustomElement("t-panoramic-toolbar-auto-view", AutoView);
defineCustomElement("t-panoramic-toolbar-switch", Switch);
defineCustomElement("t-panoramic-toolbar-up", Upward);
defineCustomElement("t-panoramic-toolbar-down", Downward);
defineCustomElement("t-panoramic-toolbar-left", Leftward);
defineCustomElement("t-panoramic-toolbar-right", Rightward);
defineCustomElement("t-panoramic-toolbar-debug", Debug);

export class Toolbar extends HTMLElement {

    toolbar: AbstractToolbar[] = [];
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("t-panoramic-toolbar");
        for (let button of this.toolbar) {
            this.appendChild(button);
        }
    }

    onCreate(panoramic: PanoramicView) {
        const { options } = panoramic;
        let toolbarKeys = panoramic.options.toolbarKeys || defaultToolbarKeys;
        toolbarKeys = toolbarKeys.filter((tool) => {
            if (typeof tool === "string") {
                return !options.toolbarExcludeKeys?.includes(tool);
            }
            return true;
        });
        this.initToolbarKeys(panoramic, toolbarKeys);
    }

    initToolbarKeys(panoramic: PanoramicView, toolbarKeys: (string | Custom)[]) {
        for (let i = 0; i < toolbarKeys.length; i++) {
            let toolbarKey = toolbarKeys[i];
            if (!toolbarKey) continue;
            try {
                if (typeof toolbarKey === "string") {
                    toolbarKey = toolbarKey.trim();
                    const button = document.createElement(`t-panoramic-toolbar-${toolbarKey}`) as AbstractToolbar;
                    button.style.display = toolbarKey === "switch" ? "block" : "none";
                    button.classList.add("t-panoramic-toolbar-item");
                    button.onCreate(panoramic);
                    const tip = t(toolbarKey) as string;
                    button.setAttribute("data-title", tip);
                    tip && tippy(button, {
                        appendTo: document.querySelector('.t-panoramic-container')!,
                        content: tip,
                        theme: "t-panoramic-tip",
                        arrow: true,
                        placement: "left"
                    });
                    this.toolbar.push(button);
                } else {
                    const custom = toolbarKey as Custom;
                    const button = document.createElement("t-panoramic-toolbar-custom") as CustomDom;
                    button.classList.add("t-panoramic-toolbar-item");
                    if (custom.id) {
                        button.setAttribute("id", custom.id);
                    }
                    if (custom.className) {
                        button.classList.add(custom.className);
                    }
                    button.onCreate(panoramic);
                    button.onConfig(custom);
                    if (custom.tip) {
                        const tip = t(custom.tip) as string;
                        tip && tippy(button, {
                            appendTo: document.querySelector('.t-panoramic-container')!,
                            content: tip,
                            theme: 't-panoramic-tip',
                            arrow: true,
                            placement: "left"
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