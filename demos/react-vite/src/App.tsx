import {useEffect, useRef} from 'react'
import { PanoramicView } from "panoramic-view";
import "panoramic-view/dist/style.css";

function App() {

    //定义 ref
    const divRef = useRef(null);

    //初始化 AiEditor
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

    return (
        <>
            <div>
                <h1>PanoramicView，一个基于three.js 的全景 图片/视频 查看器</h1>
            </div>
            <div ref={divRef} style={{height: "600px"}} />
        </>
    )
}

export default App