
<h1 align="center">
    <a href="https://iajie.github.io/panoramic-view/#/" target="_blank">panoramic-view</a>
</h1>
<h4 align="center">
    <a href='https://gitee.com/iajie/panoramic-view/stargazers'>
        <img src='https://gitee.com/iajie/panoramic-view/badge/star.svg?theme=gvp' alt='star' />
    </a>
    <a href='https://github.com/iajie/panoramic-view/stargazers'>
        <img src='https://img.shields.io/github/stars/iajie/panoramic-view.svg?logo=github' alt='star' />
    </a>
</h4>

<h2 align="center">简易 开源全景图片查看器</h2>
<h3 align="center">开箱即用、支持所有前端框架</h4>

## 开始关注并使用 panoramic-view

给我们 star，这样，在我们发布新的版本时，您可以及时获得通知。


## 什么是 panoramic-view

panoramic-view 是一个基于three.js加工的360°全景图片查看器，它基于 Web Component，因此支持 Layui、Vue、React、Angular 等几乎任何前端框架。它适配了 PC Web
端~~和手机端~~，并支持手机遥感和自动旋转播放。除此之外，它还提供了灵活的配置，开发者可以方便的使用其开发流程设计的应用。

**[技术文档](https://iajie.github.io/panoramic-view/#/)**

## panoramic-view 的与众不同之处

### 简单、友好、易用

panoramic-view 基于 Web Component 开发，支持与任意主流的前端框架集成。panoramic-view 使用更加友好的 LGPL 开源协议，通过 `npm i panoramic-view` 使用，
不用担心 GPL 协议可能带来的 GPL 传染问题。

### 1、react中使用
```tsx
import React, { useEffect, useRef } from 'react';
import { PanoramicView } from 'panoramic-view';
import "panoramic-view/style.css";
const Panoramic: React.FC = ({}) => {

    //定义 ref
    const divRef = useRef(null);

    //初始化 PanoramicView
    useEffect(() => {
        if (divRef.current) {
            const panoramicView = new PanoramicView({
                container: divRef.current,
                fileList: [
                    {
                        name: "乌蒙大草原入口",
                        url: "1.jpg",
                    },
                    {
                        name: "乌蒙大草原漫游2",
                        url: "2.jpg",
                    },
                    {
                        name: "乌蒙大草原漫游3",
                        url: "3.jpg",
                    },
                ]
            })
            return () => {
                panoramicView.destroy();
            }
        }
    }, [])
    
    return <div/>
}
export default Panoramic;
```

### 2、Vue中使用
```vue
<template>
    <div>
        <h1>PanoramicView，一个基于three.js 的全景 图片/视频 查看器</h1>
    </div>
    <div ref="panoramic" style="height: 600px" />
</template>
<script setup lang="ts">
import { PanoramicView } from "panoramic-view";
import "panoramic-view/style.css";
import { onMounted, ref, onUnmounted } from 'vue';

const panoramic = ref();
const panoramicView = ref<PanoramicView>();

onMounted(() => {
    panoramicView.value = new PanoramicView({
        container: panoramic.value,
        fileList: [
            {
                name: "乌蒙大草原入口",
                url: "1.jpg",
            },
            {
                name: "乌蒙大草原漫游2",
                url: "2.jpg",
            },
            {
                name: "乌蒙大草原漫游3",
                url: "3.jpg",
            },
        ]
    });
});

onUnmounted(() => {
    panoramicView.value?.destroy();
});

</script>
```

## 参与贡献

1.  Fork 本仓库
2.  新建 feature-xxx 分支
3.  提交代码
4.  新建 Pull Request


## ✨ 特别鸣谢

- TPno: [push_0x57df](https://gitee.com/push_0x57df/TPano.git)
- Three.js