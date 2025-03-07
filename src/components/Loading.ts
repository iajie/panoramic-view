export class Loading extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.children && this.children.length) {
            return;
        }
        this.classList.add("t-pano-loading");
        const loadBarK = document.createElement("div");
        loadBarK.classList.add("t-pano-loading-bar-k");
        const loadBarX = document.createElement("div");
        loadBarX.classList.add("t-pano-loading-bar-x");
        loadBarK.appendChild(loadBarX);
        this.appendChild(loadBarK);
    }

}