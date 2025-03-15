# 属性
|           属性名            |      描述      |                 类型                 | 默认值                             |
|:------------------------:|:------------:|:----------------------------------:|:--------------------------------|
|        container         | 节点dom或者节点id  |       `string` 丨 `Element`         | 必填                              |
|         fileList         |     文件列表     |       [FileList](#fileList)        | 必填                              |
|           lang           | 语言(工具栏提示框文字) |             `zh`丨`en`              | `zh`                            |
|           i18n           |     国际化      |                                    | `{}`                            |
|          debug           | 开启可打印点位xyz坐标 |             `boolean`              | `false`                         |
|       toolbarKeys        |     工具栏      |              `string`              | [Custom](#Custom)               |  |
|    toolbarExcludeKeys    |  不想用的工具栏可排除  |              `string`              |                                 |
|        onCreated         |   对象创建完成触发   | `(options: PanoramicView) => void` |                                 |
|     mouseController      |  是否开启鼠标控制    | `boolean` | `true`                          |
| rotateAnimateController  |  开场视角自转    | `boolean` | `true`                          |

## fileList
|        属性名         |             描述             |               类型                | 默认值     |
|:------------------:|:--------------------------:|:-------------------------------:|:--------|
|        name        |            文件名             |            `string`             | 必填      |
|        url         |          图片/视频路径           |            `string`             | 必填      |
|       key          |     文件id(唯一)可用作`热点跳转`      |            `string`             |         |
|        type        |         文件类型图片/视频          |         `image`丨`video`         | `image` |
|        fov        | 为单张设置相机视野pc:电脑端,phone: 手机端 | `{ pc: number; phone: number }` | `{}`    |
|       hotspot        |       图片热点(在视频中不可用)        |          [hotspot](#hotspot)           | `[]`    |

## hotspot
?> **图片热点** 在单张图片可已有多个热点，拿全景看房做个栗子，在客厅可以有好几个热点通往其他的房间。

|        属性名         |                  描述                   |                   类型                    | 默认值     |
|:------------------:|:-------------------------------------:|:---------------------------------------:|:--------|
|        position        |         热点位置，可通过`debug`点击图片获取         |   `{ x: number; y: number; z: number;}` | 必填      |
|        icon         |           热点图标可以是图片路径或者svg            |                `string`                 | 必填      |
|       jumpTo          | 跳转到何处，在文件中定义的`key`就可以使用到该属性上，没有也可以用`name` |                `string`                 |         |

## Custom 
?> **自定义工具栏属性** 可通过该属性将工具栏上没有的功能补齐 [自定义工具栏案例]()

|    属性名     |         描述         |    类型    | 默认值 |
|:----------:|:------------------:|:--------:|:----|
|     id     |     工具栏dom id      | `string` |  |
| className  |       自定义样式名       | `string` |   |
|    icon    |       图标svg        | `string` |     |
|    html    | html代码块和`icon`二选一  | `string` |     |
|    tip     |        工具提示        | `string` |     |
| onClick    |        点击事件        | `(event: MouseEvent, camera: PerspectiveCamera) => void` |     |