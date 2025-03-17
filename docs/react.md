# React集成

```javascript
import React, { useEffect, useRef } from 'react';
import { PanoramicView } from "panoramic-view";
import "panoramic-view/style.css";

function App() {

    //定义 ref
    const ref = useRef(null);

    const [panoramic, setPanoramic] = React.useState<PanoramicView>();

    useEffect(() => {
        if (!!ref.current) {
            if (panoramic) return ;
            const pv = new PanoramicView({
                container: ref.current,
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
                ],
            });
            setPanoramic(pv);
            return () => {
                return pv.destroy();
            }
        }
    }, [])

    return <>
        <div>
            <h1>PanoramicView，一个基于three.js 的全景 图片/视频 查看器</h1>
        </div>
        <div ref={ref} style={{height: "600px"}} />
    </>
}

export default App
```