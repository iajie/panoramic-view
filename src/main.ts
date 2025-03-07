import { PanoramicView } from "./core/PanoramicView.ts";

// @ts-ignore
window.pv = new PanoramicView({
  container: '#t-pano',
  fileList: [{
    name: "足球场",
    url: "2.avi"
  }]
});