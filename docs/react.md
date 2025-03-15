```tsx
import React, { useEffect, useRef } from 'react';
import { PanoramicView } from 'panoramic-view';
import "panoramic-view/dist/style.css";

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
                        name: "图片名称",
                        url: "图片地址(必须)",
                    },
                ]
            })
            return () => {
                panoramicView.destroy();
            }
        }
    }, [])
    
    return <div ref={divRef} style={{height: "98vh"}}/>
}
export default Panoramic;
```