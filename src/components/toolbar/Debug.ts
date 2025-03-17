import { AbstractToolbar } from "./AbstractToolbar.ts";

export class Debug extends AbstractToolbar {

    constructor() {
        super();
        this.template = `<svg t="1742177571558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5390" width="48" height="48"><path d="M893.349926 2.260385H129.411793C58.326281 2.260385 0.681719 59.885037 0.681719 130.966756V894.928593c0 71.083615 57.646459 128.707319 128.730074 128.707318h763.938133c71.10163 0 128.705422-57.623704 128.705422-128.707318V130.966756c0-71.081719-57.603793-128.70637-128.705422-128.706371z m79.905185 856.126578c0 64.341333-52.128237 116.425956-116.424059 116.425956H165.908859c-64.276859 0-116.404148-52.082726-116.404148-116.425956V167.507437c0-64.345126 52.127289-116.425007 116.404148-116.425007H856.832c64.297719 0 116.424059 52.08083 116.424059 116.425007V858.386963h-0.000948z" fill="#1AAA5E" p-id="5391"></path><path d="M578.485096 648.173985c-25.452089 19.378252-50.706963 32.148859-82.680415 32.439941V438.806756h-34.301155v241.985422c-34.274607 0.264533-60.660622-14.811022-85.940148-34.813156-14.454519 16.185837-28.668207 32.126104-42.923615 48.069215-2.128593 2.414933-4.125393 5.008119-6.515674 7.164207-7.537778 6.628504-15.808474 8.533333-24.124682 1.772089-7.538726-6.163911-8.334222-16.606815-1.19277-25.029214 14.674489-17.293274 29.531022-34.454756 45.317689-50.730667 7.359526-7.648711 7.094993-13.547141 4.08083-23.258074-6.033067-19.535644-9.136356-39.930311-13.882786-62.059141-12.973511 0-28.220681 0.019911-43.456474-0.026548-4.876326 0-9.752652 0.178252-14.587259-0.176356-10.463763-0.731022-16.872296-6.254933-16.582163-16.96237 0.263585-10.398341 6.694874-16.586904 16.871348-17.0496 14.96557-0.6656 29.999407-0.223763 44.965926-0.24557h15.853037c0-25.92237 0.24557-50.885215-0.288237-75.870815-0.063526-3.306193-3.388681-7.054222-6.051081-9.761185-12.728889-13.082548-25.853156-25.73843-38.626608-38.755556-8.668919-8.84717-9.224533-19.733807-1.818548-26.871467 7.074133-6.783052 17.497126-6.275793 25.96883 1.973097 12.747852 12.458667 24.809244 25.650252 37.934459 37.692681 4.256237 3.854222 10.951111 7.070341 16.538548 7.093096 70.130726 0.508207 140.215941 0.508207 210.325808 0 5.631052-0.023704 12.325926-3.192415 16.583111-7.073185 12.859733-11.727644 24.631941-24.609185 37.074489-36.803318 9.131615-8.998874 19.533748-9.933748 26.824059-2.926934 7.587081 7.275141 6.656948 18.401659-2.609304 27.783586-12.529778 12.705185-25.366756 25.055763-37.742933 37.937303-2.834963 2.951585-6.007467 7.226785-6.098489 10.934045-0.553719 24.274489-0.289185 48.530963-0.289185 74.651496h46.27437c4.457244 0.021807 8.916385-0.1792 13.370785 0.086282 10.686578 0.667496 18.226252 7.84877 18.249956 17.205096 0.018963 10.175526-6.411378 16.762311-17.985422 16.981333-19.400059 0.377363-38.800119 0.090074-58.489363 0.090074-2.084978 14.830933-3.726222 28.734578-6.1184 42.548148-1.152 6.738489-2.174104 14.254459-5.855763 19.644682-9.662578 14.077156-3.697778 22.725215 7.185066 32.326163 13.34803 11.7504 25.43123 24.965689 37.9392 37.669926 10.377481 10.593659 11.548444 19.708207 3.855171 27.472592-8.224237 8.270696-17.605215 7.424-28.446341-3.43514-16.304356-16.340385-32.222815-33.03443-48.605867-49.865008z" fill="#EDCF85" p-id="5392"></path><path d="M564.047644 367.676681H392.634785c-2.03757-46.293333 37.491674-85.608296 85.497363-85.805511 47.6672-0.178252 86.917689 38.532741 85.915496 85.805511z" fill="#EDCF85" p-id="5393"></path><path d="M692.98157 763.579733c-153.473896 131.126044-368.986074 85.670874-469.338074-43.790222-105.604741-136.204326-92.234904-324.352948 30.621393-440.004267 120.993185-113.896296 311.712237-118.48723 434.814104-12.795259 132.9664 114.187378 157.112889 320.186785 34.414933 465.346371 8.531437 7.446756 17.8688 14.861274 26.292148 23.150933 53.788444 52.9664 107.224178 106.273185 161.124504 159.109689 11.198578 10.974815 20.353896 21.881363 6.341215 35.918696-13.853393 13.836326-27.070578 7.605096-38.955615-4.193659a635848.078222 635848.078222 0 0 0-170.055111-168.263111c-5.019496-4.942696-10.207763-9.710933-15.259497-14.479171z m68.290371-247.570963c-0.627674-158.285748-126.074311-283.314252-283.806341-282.937837-156.179911 0.377363-283.357867 128.865659-282.249481 285.157452 1.108385 154.358519 128.596385 279.828859 283.556977 279.096889 158.355911-0.751881 283.091437-124.981096 282.498845-281.316504z" fill="#1AAA5E" p-id="5394"></path></svg>
            <div/>
        `;
        this.registerClickListener();
    }

    onClick() {
        for (let child of this.children) {
            if (child.tagName === "DIV") {
                if (this.panoramic.debug) {
                    child.classList.remove("point");
                } else {
                    child.classList.add("point");
                }
            }
        }
        this.panoramic.debug = !this.panoramic.debug;
    }
}