import { TPanoJs } from "./core/TPanoJs.ts";

// @ts-ignore
window.tPano = new TPanoJs({
  container: '#t-pano',
  fileList: [{
    name: "足球场",
    url: "public/1.jpg"
  }]
});