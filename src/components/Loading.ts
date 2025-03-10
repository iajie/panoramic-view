export class Loading extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add("t-pano-loading");
        if (this.children && this.children.length) {
            return;
        }
        const loadBarK = document.createElement("div");
        loadBarK.classList.add("t-pano-loading-bar-k");
        const loadBarX = document.createElement("div");
        loadBarX.classList.add("t-pano-loading-bar-x");
        loadBarK.appendChild(loadBarX);
        this.appendChild(loadBarK);
    }

}