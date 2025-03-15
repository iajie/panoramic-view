import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Switch extends AbstractToolbar {

    constructor() {
        super();
        this.template = `
            <svg t="1741226813586" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8370" width="200" height="200"><path d="M512.8 151.74c12.85 0 21.68 2.96 24.76 4.75l279.12 156.87c11.38 6.4 29.79 29.01 29.79 41.78v313.68c0 12.8-18.41 35.38-29.79 41.78L537.57 867.46c-3.09 1.77-11.91 4.8-24.76 4.8-12.85 0-21.68-2.96-24.76-4.75L208.83 710.65c-11.35-6.4-29.76-29.01-29.76-41.78V355.13c0-12.8 18.41-35.38 29.76-41.78l279.12-156.87c7.79-3.4 16.3-5.03 24.85-4.74z m0-86.29c-22.28 0-44.53 4.77-61.42 14.25L158.84 244.07c-33.78 18.98-61.49 65.56-61.49 103.56v328.69c0 37.97 27.67 84.57 61.45 103.56l292.48 164.38c16.86 9.48 39.14 14.21 61.42 14.21 22.25 0 44.53-4.77 61.42-14.21L866.6 779.88c33.75-18.98 61.42-65.56 61.42-103.56V347.63c0-37.97-27.67-84.57-61.42-103.56L574.23 79.75c-16.89-9.53-39.15-14.3-61.43-14.3z" p-id="8371"></path><path d="M653.93 360.76c-2.37 0.26-5.65 0.79-10.02 3.43l-157.29 111c-9.21 5.99-13.99 28.28-2.64 43.65 12.06 16.34 33.38 19.11 43.11 14.08l156.78-109.68c10.1-8.2 13.06-12.38 11.65-24.45-1.4-11.94-14.57-40.77-41.12-38.06l-0.47 0.03zM482.22 480.22c-1.17 2.07-2.66 5.04-3.08 10.14l-1.97 192.5c-0.53 10.98 14.76 27.89 33.86 27.68 20.31-0.23 35.03-15.9 36.63-26.73l2.75-191.32c-0.74-12.99-2.4-17.84-13.02-23.75-10.5-5.85-41.59-12.04-54.92 11.09l-0.25 0.39z m-147.94-66.69c1.01 2.16 2.56 5.09 6.47 8.39L496.4 535.2c8.64 6.8 31.28 4.16 42.19-11.52 11.6-16.67 7.37-37.75-0.52-45.35L383.83 365.1c-11.01-6.93-15.92-8.39-26.9-3.17-10.85 5.16-33.93 26.89-22.83 51.17l0.18 0.43z" fill="#0173FE" p-id="8372"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        const nodes = this.parentNode?.children;
        if (nodes && nodes.length > 0) {
            for (let child of nodes) {
                if (!child.nodeName.toLowerCase().endsWith("switch")) {
                    // @ts-ignore
                    if (child.style.display === "block") {
                        // @ts-ignore
                        child.style.display = "none";
                        this.toolbar(false);
                    } else {
                        // @ts-ignore
                        child.style.display = "block";
                        this.toolbar();
                    }
                }
            }
        }
    }

    toolbar(add: boolean = true) {
        const height = this.panoramic.container.clientHeight;
        if (height <= 600) {
            if (add) {
                this.panoramic.toolbar.classList.add("two-column");
            } else {
                this.panoramic.toolbar.classList.remove("two-column");
            }
        }
    }
}