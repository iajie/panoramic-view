# Vue2集成

```vue
<template>
    <div ref="panoramic" style="height: 98vh" />
</template>
<script>
import { PanoramicView } from "panoramic-view";
import "panoramic-view/style.css";
export default {
    data() {
        return {
            panoramic: null
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.panoramic.destroy();
        this.panoramic = null;
    },
    methods: {
        init() {
            this.panoramic = new PanoramicView({
                container: this.$refs.panoramic,
                fileList: [
                    {
                        name: "图片名称",
                        url: "图片地址(必须)",
                    },
                ]
            });
        }
    }
}
</script>
```