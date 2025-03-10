import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Leftward extends AbstractToolbar {

    constructor() {
        super();
        this.template = `<div>
            <svg t="1741334996673" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9412" width="200" height="200"><path d="M512 896c-211.776 0-384-172.224-384-384s172.224-384 384-384 384 172.224 384 384-172.224 384-384 384zM512 192C335.552 192 192 335.552 192 512s143.552 320 320 320 320-143.552 320-320-143.552-320-320-320z" fill="#979797" p-id="9413"></path><path d="M640 544H384a32 32 0 0 1 0-64h256a32 32 0 0 1 0 64z" fill="#F5A623" p-id="9414"></path><path d="M512 672a32 32 0 0 1-22.464-9.216l-128-126.208a31.872 31.872 0 0 1-0.32-45.184l128-129.792a31.936 31.936 0 1 1 45.568 44.864L429.248 513.472l105.216 103.68A32 32 0 0 1 512 672z" fill="#F5A623" p-id="9415"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    onClick() {
        this.panoramic.closeRateAnimate();
        this.panoramic.camera.rotateY(0.1);
    }
}