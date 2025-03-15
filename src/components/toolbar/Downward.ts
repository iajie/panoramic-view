import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Downward extends AbstractToolbar {

    constructor() {
        super();
        this.template = `
            <svg t="1741335078555" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15676" width="200" height="200"><path d="M512 896c-211.776 0-384-172.224-384-384s172.224-384 384-384 384 172.224 384 384-172.224 384-384 384zM512 192C335.552 192 192 335.552 192 512s143.552 320 320 320 320-143.552 320-320-143.552-320-320-320z" fill="#979797" p-id="15677"></path><path d="M512 672a32 32 0 0 1-32-32V384a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32z" fill="#F5A623" p-id="15678"></path><path d="M513.792 672a32.128 32.128 0 0 1-22.464-9.216l-129.792-128a32 32 0 1 1 44.928-45.568l107.008 105.536 103.68-105.216a32 32 0 0 1 45.696 44.928l-126.208 128c-6.016 6.08-13.568 10.496-22.848 9.536z" fill="#F5A623" p-id="15679"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        this.panoramic.closeRateAnimate();
        this.panoramic.camera.rotateX(-0.1);
    }
}