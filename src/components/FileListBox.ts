import { PanoramicView } from "../core/PanoramicView.ts";

export class FileListBox extends HTMLElement {

    panoramic!: PanoramicView;

    constructor(panoramic: PanoramicView) {
        super();
        this.panoramic = panoramic;
    }

    connectedCallback() {
        this.classList.add("t-panoramic-file-list");
        if (this.children && this.children.length) {
            return;
        }
        // 鼠标滚轮控制滚动条
        this.addEventListener("wheel", (e)=> {
            const step = 50;
            e.preventDefault();
            this.scrollLeft = this.scrollLeft + (e.deltaY > 0 ? step : -step);
        });
        const fileList = this.panoramic.options.fileList;
        for (let i = 0; i < fileList.length; i++) {
            const box = document.createElement("div");
            box.classList.add("t-panoramic-file-list-box");
            box.addEventListener("click", () => {
                this.panoramic.switchPhotoN(i);
            });
            if (fileList[i].type === "video") {
                box.innerHTML = `<svg t="1741659501609" class="t-panoramic-file-list-box-img" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7310" width="48" height="48"><path d="M547.2256 545.28m-385.1264 0a385.1264 385.1264 0 1 0 770.2528 0 385.1264 385.1264 0 1 0-770.2528 0Z" fill="#FFF7E6" p-id="7311"></path><path d="M915.4048 420.3008c-11.0592 0-21.248-7.2192-24.5248-18.3808a373.1456 373.1456 0 0 0-10.24-30.1568c-5.0688-13.2096 1.4848-28.0064 14.6944-33.0752 13.1584-5.12 28.0064 1.4848 33.0752 14.6944 4.3008 11.1616 8.192 22.6304 11.5712 34.0992 3.9936 13.568-3.7888 27.8016-17.3056 31.7952-2.4576 0.6656-4.864 1.024-7.2704 1.024z" fill="#44454A" p-id="7312"></path><path d="M514.7648 956.0064c-244.3776 0-443.1872-198.8096-443.1872-443.1872S270.3872 69.632 514.7648 69.632c147.8144 0 285.3376 73.3184 367.9744 196.096 7.8848 11.7248 4.7616 27.648-6.9632 35.5328s-27.648 4.7616-35.5328-6.9632c-73.0624-108.5952-194.7648-173.4656-325.4784-173.4656-216.1664 0-391.9872 175.872-391.9872 391.9872 0 216.1664 175.872 391.9872 391.9872 391.9872 216.1664 0 391.9872-175.872 391.9872-391.9872 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 244.3776-198.8096 443.1872-443.1872 443.1872z" fill="#44454A" p-id="7313"></path><path d="M660.5824 470.4256L460.8 355.072c-28.7232-16.5888-64.5632 4.1472-64.5632 37.2736v230.7072c0 33.1264 35.8912 53.8624 64.5632 37.2736l199.7824-115.3536c28.7232-16.5376 28.7232-58.0096 0-74.5472z" fill="#FD973F" p-id="7314"></path><path d="M439.2448 691.8144c-11.776 0-23.6032-3.1232-34.3552-9.3184-21.504-12.3904-34.304-34.6112-34.304-59.4432V392.3456c0-24.832 12.8512-47.0528 34.3552-59.4432s47.1552-12.3904 68.6592 0l199.7824 115.3536c21.504 12.3904 34.304 34.6112 34.304 59.4432s-12.8512 47.0528-34.304 59.4432L473.6 682.496c-10.752 6.1952-22.528 9.3184-34.3552 9.3184z m0.1024-316.9792c-4.0448 0-7.2192 1.4848-8.8064 2.4064-2.6112 1.536-8.7552 6.0416-8.7552 15.104v230.7072c0 9.1136 6.0928 13.6192 8.7552 15.104s9.5744 4.5568 17.4592 0l199.7824-115.3536c7.8848-4.5568 8.704-12.0832 8.704-15.104s-0.8704-10.5472-8.704-15.104L448 377.2416c-3.1232-1.792-6.0416-2.4064-8.6528-2.4064z" fill="#44454A" p-id="7315"></path></svg>
                    <p class="t-panoramic-file-list-box-p">${fileList[i].name}</p>`;
            } else {
                box.innerHTML = `<img src="${fileList[i].url}" class="t-panoramic-file-list-box-img" alt="${fileList[i].name}"/>
                <p class="t-panoramic-file-list-box-p">${fileList[i].name}</p>`;
            }
            this.appendChild(box);
        }
    }
}