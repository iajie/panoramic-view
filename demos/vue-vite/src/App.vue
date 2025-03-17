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