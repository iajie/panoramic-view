import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Import extends AbstractToolbar {

    constructor() {
        super();
        this.template = `<div>
            <input type="file" id="t-pano-toolbar-import" accept=".xml" style="display: none" />
            <svg t="1740199747735" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5425" width="200" height="200"><path d="M132.31104 12.47872h476.9152a40.97408 40.97408 0 0 1 28.5888 10.91968l291.74528 278.0672a36.56064 36.56064 0 0 1 11.42016 26.97088v62.9504c0 21.28512-17.98656 38.19264-39.98208 38.19264-22.31168 0-40.00896-16.90752-40.00896-38.19264v-39.77856H676.9536a91.05024 91.05024 0 0 1-64.5888-26.16576l-1.13408-0.83072a84.02304 84.02304 0 0 1-25.71392-60.512V89.09056H132.31104a27.68768 27.68768 0 0 0-18.83008 7.37152 25.0688 25.0688 0 0 0-8.01792 18.51776v793.81888c0 7.09504 2.56 13.63712 8.01792 17.9904a27.10144 27.10144 0 0 0 18.83008 8.17664h701.24928c7.12192 0 14.00448-3.54816 19.43808-8.17664 4.27264-4.352 7.99104-10.89536 7.99104-17.9904v-22.06464c0-21.28512 17.69728-38.4448 40.00896-38.4448 21.99552 0 39.98208 17.15968 39.98208 38.4448v22.06464a99.34592 99.34592 0 0 1-31.70048 72.4864l-0.8448 1.1072a110.99008 110.99008 0 0 1-74.88 29.15968H132.31104c-29.43232 0-55.99104-12.25216-75.98208-30.26688-19.46368-18.51776-31.72736-44.40704-31.72736-72.4864V114.97984c0-28.33024 12.26368-53.94304 31.72736-72.76288C75.50208 23.67488 102.61504 12.47872 132.31104 12.47872z m630.77888 383.58912a27.9808 27.9808 0 0 1 17.14304-6.56768c13.45024 0 24 10.6176 24 23.168v110.67776h170.5856c13.45024 0 24.576 10.06464 24.576 22.87104v185.93536c0 13.08288-11.1296 23.168-24.576 23.168H804.23936v110.65344a20.85248 20.85248 0 0 1-7.4368 16.1024 24.40192 24.40192 0 0 1-33.70624 0L525.35808 655.54048c-9.70496-8.98304-9.70496-23.424 0-32.68352l237.184-226.26176 0.55296-0.52864z m-186.59328 242.8672l179.15648 171.71584v-78.49856c0-12.55552 11.15648-23.168 24.576-23.168H950.528v-139.3152H780.23296c-13.42336 0-24.576-10.624-24.576-23.44832v-78.19776L576.49664 638.93504z m243.328-333.64608L633.5168 128.08832v136.01152a37.84576 37.84576 0 0 0 12.00256 28.08064l1.13408 1.08288c7.4368 7.6224 18.304 12.032 30.30272 12.032h142.86336z" p-id="5426"></path></svg>
        </div>`;
        this.registerClickListener();
    }

    onClick() {
        const fileInput = document.getElementById("t-pano-toolbar-import");
        if (fileInput) {
            fileInput.click();
            fileInput.onchange = this.handleFileChange;
        }
    }

    async handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            try {
            } catch (error) {
            } finally {
                target.value = ""; // 清空input，允许重复选择同一文件
            }
        }
    }
}