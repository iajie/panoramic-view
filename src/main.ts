import { PanoramicView } from "./core/PanoramicView.ts";
import qq from "./assets/1.jpg";
// @ts-ignore
import gg from "./assets/2.JPG";

// @ts-ignore
window.pv = new PanoramicView({
    container: '#t-pano',
    fileList: [
        {
            name: "客源",
            url: qq,
            hotspot: [
                {
                    icon: "https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/img/cartoon.31472f0.png",
                    position: {
                        "x": 58.13976389105291,
                        "y": -159.89940836807145,
                        "z": -469.5766942477247
                    },
                    jumpTo: "gg"
                }
            ]
        },
        {
            name: "户外",
            key: "gg",
            url: gg,
            hotspot: [
                {
                    icon: `<svg t="1741766871855" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4825" width="256" height="256"><path d="M829.802 55.924l0.002-0.002H627.198l0.046 0.04h-0.052v142.19h202.618V55.924z" fill="#DFDFDF" p-id="4826"></path><path d="M983.354 504.96h-52.67v-15.416h44.962v-33.48l-249.988-194.076 9.454-12.178L988.08 446.2c1.88 1.46 2.98 3.708 2.98 6.09v44.962a7.704 7.704 0 0 1-7.706 7.708zM94.548 504.96H40.646a7.706 7.706 0 0 1-7.708-7.708v-37.818c0-2.396 1.114-4.656 3.016-6.114l96.724-74.2V64.436a7.706 7.706 0 0 1 7.708-7.708h160.216a7.706 7.706 0 0 1 7.708 7.708v178.39l77.694-60.33a7.696 7.696 0 0 1 4.728-1.62h124.402v15.416h-121.76l-88.044 68.366a7.706 7.706 0 0 1-12.434-6.086V72.144H148.092V382.92a7.702 7.702 0 0 1-3.016 6.114l-96.724 74.2v26.31h46.194v15.416z" fill="#4A555F" p-id="4827"></path><path d="M274.912 275.534V90.108H166.076v270z" fill="#F58E6F" p-id="4828"></path><path d="M903.348 1024H629.876a7.706 7.706 0 0 1-7.708-7.708V701.506H403.474v314.786a7.706 7.706 0 0 1-7.708 7.708H126.922a7.706 7.706 0 0 1-7.708-7.708V446.226c0-2.384 1.104-4.634 2.988-6.094l278.764-215.92a7.706 7.706 0 0 1 4.72-1.614h109.448a7.706 7.706 0 0 1 7.708 7.708v71.724l46.226-51.244a7.896 7.896 0 0 1 5.776-2.596h82.834a7.7 7.7 0 0 1 4.72 1.616l245.672 190.328a7.704 7.704 0 0 1 2.988 6.092v570.066a7.71 7.71 0 0 1-7.71 7.708z m-265.764-15.416H895.64v-558.58l-240.6-186.398h-76.8l-57.384 63.64a7.708 7.708 0 0 1-13.43-5.164v-84.068h-99.104L134.63 450.004v558.58H388.06V693.8a7.706 7.706 0 0 1 7.708-7.708h234.11a7.706 7.706 0 0 1 7.708 7.708v314.784z" fill="#4A555F" p-id="4829"></path><path d="M515.146 566.746c-55.702 0-100.868-45.168-100.868-100.868 0-55.704 45.168-100.87 100.868-100.87 55.702 0 100.868 45.168 100.868 100.87 0 55.7-45.166 100.868-100.868 100.868z m100.652-310.798h-41.006l-59.658 66.132v-66.132h-100.664L152.614 458.816v531.732h217.46v-322.44h285.444v322.44h222.138V458.816L615.798 255.948z" fill="#71CCE0" p-id="4830"></path><path d="M515.148 574.448c-59.866 0-108.568-48.702-108.568-108.568 0-59.862 48.702-108.566 108.568-108.566 59.862 0 108.566 48.702 108.566 108.566 0 59.864-48.702 108.568-108.566 108.568z m0-201.72c-51.364 0-93.152 41.788-93.152 93.15 0 51.364 41.788 93.152 93.152 93.152 51.362 0 93.15-41.788 93.15-93.152 0.002-51.362-41.786-93.15-93.15-93.15z" fill="#4A555F" p-id="4831"></path><path d="M515.148 541.046c-41.444 0-75.166-33.72-75.166-75.166 0-41.448 33.722-75.166 75.166-75.166s75.166 33.718 75.166 75.166c-0.002 41.446-33.722 75.166-75.166 75.166z" fill="#FFD452" p-id="4832"></path><path d="M507.442 365.022h15.416V566.74h-15.416z" fill="#4A555F" p-id="4833"></path><path d="M414.288 458.172h201.718v15.416H414.288zM40.628 1008.566h86.314v15.416H40.628zM903.354 1008.566h86.314v15.416h-86.314zM515.144 329.786a7.71 7.71 0 0 1-7.704-7.708V59.068C507.438 26.498 533.936 0 566.506 0h328.646c32.57 0 59.068 26.498 59.068 59.068v145.474c0 32.57-26.498 59.068-59.068 59.068H578.256l-57.386 63.632a7.708 7.708 0 0 1-5.726 2.544zM566.506 15.416c-24.07 0-43.652 19.582-43.652 43.652v242.956l46.252-51.284a7.706 7.706 0 0 1 5.724-2.546h320.322c24.07 0 43.652-19.582 43.652-43.652V59.068c0-24.07-19.582-43.652-43.652-43.652H566.506z" fill="#4A555F" p-id="4834"></path><path d="M829.812 205.86H627.194a7.706 7.706 0 0 1-7.708-7.708V55.962a7.708 7.708 0 0 1 7.706-7.708l202.58-0.038c2.044 0 4.024 0.81 5.472 2.258a7.72 7.72 0 0 1 2.276 5.45v142.23a7.708 7.708 0 0 1-7.708 7.706z m-194.91-15.414h187.202V63.634l-187.202 0.032v126.78z" fill="#4A555F" p-id="4835"></path><path d="M728.482 149.782a7.684 7.684 0 0 1-4.992-1.836l-101.284-86.152 9.986-11.742 96.292 81.904 96.33-81.904 9.986 11.742-101.322 86.152a7.71 7.71 0 0 1-4.996 1.836z" fill="#4A555F" p-id="4836"></path><path d="M829.804 205.856H627.202a7.712 7.712 0 0 1-5.014-13.564l83.34-71.336a7.712 7.712 0 0 1 10.004-0.018l12.966 11.014 12.976-11.052a7.704 7.704 0 0 1 10.012 0.016l83.33 71.38a7.704 7.704 0 0 1-5.012 13.56zM648.06 190.44h160.896l-62.498-53.536-12.956 11.034a7.708 7.708 0 0 1-9.988 0.006l-12.954-11.004-62.5 53.5z" fill="#4A555F" p-id="4837"></path></svg>`,
                    position: {
                        "x": -111.38926509123391,
                        "y": -37.373071483553325,
                        "z": -485.56392621462254
                    },
                    jumpTo: "客源"
                }
            ]
        }
    ],
    debug: true,
    rotateAnimateController: false
});