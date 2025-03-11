import { AbstractToolbar } from "./AbstractToolbar.ts";
import { hide } from "../../utils/DomUtils.ts";
import { JelleAnimator } from "../../utils/Animation.ts";

export class ShowList extends AbstractToolbar {

    constructor() {
        super();
        this.template  = `<div>
            <svg t="1741227541030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18547" width="200" height="200"><path d="M1024 1024H0V0h1024v1024zM64 960h896V64H64v896z" fill="#40496B" p-id="18548"></path><path d="M864 480H160V160h704v320zM224 416h576V224H224v192z" fill="#40496B" p-id="18549"></path><path d="M352 320l128 96H224z" fill="#FFA728" p-id="18550"></path><path d="M592 256l176 160H416z" fill="#FFA728" p-id="18551"></path><path d="M448 288m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#FFA728" p-id="18552"></path><path d="M864 864H160V544h704v320zM224 800h576v-192H224v192z" fill="#40496B" p-id="18553"></path><path d="M352 704l128 96H224z" fill="#FFA728" p-id="18554"></path><path d="M592 640l176 160H416z" fill="#FFA728" p-id="18555"></path><path d="M448 672m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#FFA728" p-id="18556"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    onClick() {
        if (this.panoramic.fileListBox.style.display === "none" || window.getComputedStyle(this.panoramic.fileListBox).display === "none") {
            this.panoramic.fileListBox.style.display = "flex";
            JelleAnimator.create(this.panoramic.fileListBox).animate({
                opacity: 1,
                height: this.panoramic.container.clientWidth < 1000 ? "120px" : "150px",
            }, 500);
        } else {
            setTimeout(()=> JelleAnimator.create(this.panoramic.fileListBox).animate({
                height: 0,
                opacity: 0,
            }, 500), 200);
            setTimeout(() => hide(this.panoramic.fileListBox), 1000);
        }
    }
}