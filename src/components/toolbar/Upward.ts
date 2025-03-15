import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Upward extends AbstractToolbar {

    constructor() {
        super();
        this.template = `
            <svg t="1741335054685" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13037" width="200" height="200"><path d="M512 896c-211.776 0-384-172.224-384-384s172.224-384 384-384 384 172.224 384 384-172.224 384-384 384zM512 192C335.552 192 192 335.552 192 512s143.552 320 320 320 320-143.552 320-320-143.552-320-320-320z" fill="#979797" p-id="13038"></path><path d="M512 672a32 32 0 0 1-32-32V384a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32z" fill="#F5A623" p-id="13039"></path><path d="M640 544a32 32 0 0 1-22.784-9.536l-103.68-105.216-107.072 105.536a32 32 0 1 1-44.928-45.568l129.792-128c6.08-5.952 15.04-7.296 22.72-9.216 8.512 0.064 16.64 3.52 22.592 9.536l126.208 128A32 32 0 0 1 640 544z" fill="#F5A623" p-id="13040"></path></svg>
        `;
        this.registerClickListener();
    }

    onClick() {
        this.panoramic.closeRateAnimate();
        this.panoramic.camera.rotateX(0.1);
    }
}