import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Rightward extends AbstractToolbar {

    constructor() {
        super();
        this.template = `
            <svg t="1741335023544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11214" width="200" height="200"><path d="M512 896c-211.776 0-384-172.224-384-384s172.224-384 384-384 384 172.224 384 384-172.224 384-384 384zM512 192C335.552 192 192 335.552 192 512s143.552 320 320 320 320-143.552 320-320-143.552-320-320-320z" fill="#979797" p-id="11215"></path><path d="M640 544H384a32 32 0 0 1 0-64h256a32 32 0 0 1 0 64z" fill="#F5A623" p-id="11216"></path><path d="M512 672a32 32 0 0 1-22.464-54.784l105.216-103.68-105.536-107.072a32 32 0 1 1 45.568-44.928l128 129.792a32 32 0 0 1-0.32 45.312l-128 126.208A32.128 32.128 0 0 1 512 672z" fill="#F5A623" p-id="11217"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        this.panoramic.closeRateAnimate();
        this.panoramic.camera.rotateY(-0.1);
    }
}