# Preview 图片预览

预览当前图片。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Preview from '@hi-ui/preview'
import Grid from '@hi-ui/grid' 
export const Basic = () => {
 const [showIndex, setShowIndex] = React.useState(-1)
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
 ])

 return (
 <> 
 <div className="preview-basic__wrap">
 <Preview
 title={`pic_${showIndex}.png`}
 src={images[showIndex]}
 visible={showIndex !== -1}
 onClose={() => {
 setShowIndex(-1)
 }}
 />

 <Grid.Row gutter={true}>
 {images.map((url, index) => {
 return (
 <Grid.Col span={4} key={index}>
 <div>
 <img
 src={url}
 style={{ width: '100%', cursor: 'pointer' }}
 onClick={() => {
 setShowIndex(index)
 }}
 />
 </div>
 </Grid.Col>
 )
 })}
 </Grid.Row>
 </div>
 </>
 )
}

```


### 多图预览


```tsx
import React from 'react'
import Preview from '@hi-ui/preview'
import Grid from '@hi-ui/grid' 
export const Multiple = () => {
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
 ])
 const [visible, setVisible] = React.useState(false)
 const [current, setCurrent] = React.useState(0)

 return (
 <> 
 <div className="preview-multiple__wrap">
 <Preview
 src={images}
 current={current}
 onPreviewChange={setCurrent}
 visible={visible}
 onClose={() => {
 setVisible(false)
 }}
 />

 <Grid.Row gutter={true}>
 {images.map((url, index) => {
 return (
 <Grid.Col span={4} key={index}>
 <div>
 <img
 src={url}
 style={{ width: '100%', cursor: 'pointer' }}
 onClick={() => {
 setCurrent(index)
 setVisible(true)
 }}
 />
 </div>
 </Grid.Col>
 )
 })}
 </Grid.Row>
 </div>
 </>
 )
}

```


### 图片标题

默认使用图片的文件名作为标题，可以通过 <code>title</code> 属性自定义标题


```tsx
import React from 'react'
import Preview from '@hi-ui/preview'
import Grid from '@hi-ui/grid' 
export const Title = () => {
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
 ])
 const [visible, setVisible] = React.useState(false)
 const [current, setCurrent] = React.useState(0)

 return (
 <> 
 <div className="preview-title__wrap">
 <Preview
 src={images}
 title={(url, index) => {
 return `title_${index}`
 }}
 current={current}
 onPreviewChange={setCurrent}
 visible={visible}
 onClose={() => {
 setVisible(false)
 }}
 />

 <Grid.Row gutter={true}>
 {images.map((url, index) => {
 return (
 <Grid.Col span={4} key={index}>
 <div>
 <img
 src={url}
 style={{ width: '100%', cursor: 'pointer' }}
 onClick={() => {
 setCurrent(index)
 setVisible(true)
 }}
 />
 </div>
 </Grid.Col>
 )
 })}
 </Grid.Row>
 </div>
 </>
 )
}

```


### 添加水印


```tsx
import React from 'react'
import Preview from '@hi-ui/preview'
import Grid from '@hi-ui/grid' 
export const Watermark = () => {
 const [showIndex, setShowIndex] = React.useState(-1)
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
 ])

 return (
 <> 
 <div className="preview-watermark__wrap">
 <Preview
 title={`pic_${showIndex}.png`}
 src={images[showIndex]}
 visible={showIndex !== -1}
 onClose={() => {
 setShowIndex(-1)
 }}
 watermarkProps={{
 content: ['HiUI', '做中台，就用 HiUI'],
 style: {
 pointerEvents: 'none',
 position: 'fixed',
 top: 0,
 right: 0,
 bottom: 0,
 left: 0,
 zIndex: 2048,
 },
 }}
 />

 <Grid.Row gutter={true}>
 {images.map((url, index) => {
 return (
 <Grid.Col span={4} key={index}>
 <div>
 <img
 src={url}
 style={{ width: '100%', cursor: 'pointer' }}
 onClick={() => {
 setShowIndex(index)
 }}
 />
 </div>
 </Grid.Col>
 )
 })}
 </Grid.Row>
 </div>
 </>
 )
}

```


### 禁止下载


```tsx
import React from 'react'
import Preview from '@hi-ui/preview'
import Grid from '@hi-ui/grid' 
export const Banned = () => {
 const [showIndex, setShowIndex] = React.useState(-1)
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
 ])

 return (
 <> 
 <div className="preview-banned__wrap">
 <Preview
 title={`pic_${showIndex}.png`}
 src={images[showIndex]}
 visible={showIndex !== -1}
 disabledDownload={true}
 onClose={() => {
 setShowIndex(-1)
 }}
 />

 <Grid.Row gutter={true}>
 {images.map((url, index) => {
 return (
 <Grid.Col span={4} key={index}>
 <div>
 <img
 src={url}
 style={{ width: '100%', cursor: 'pointer' }}
 onClick={() => {
 setShowIndex(index)
 }}
 />
 </div>
 </Grid.Col>
 )
 })}
 </Grid.Row>
 </div>
 </>
 )
}

```


## Props

### Preview Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ---------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| visible | 是否显示预览窗体 | boolean | true \| false | false |
| title | 预览窗体标题 | ReactNode \| ((url: string, index: number) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (url: string, index: number) => ReactNode | - |
| src *(required)* | 预览图片地址 | string \| string\[] | string \| string\[] | - |
| current | 当前预览图片索引(受控) | number | - | - |
| defaultCurrent | 当前预览图片索引 | number | - | - |
| watermarkProps | 设置图片水印 | Omit\<WatermarkProps, "container"> | - | - |
| disabledDownload | 是否禁止右键下载图片 | boolean | true \| false | false |
| onError | 加载错误回调 | ReactEventHandler\<HTMLImageElement> | - | - |
| onClose | 关闭预览的回调 | (() => void) | - | - |
| onPreviewChange | 当前预览图片索引(受控) | ((current: number) => void) | - | - |
| onDownload | 下载图片的回调 | ((url: string) => void) | - | - |
| container | 指定 portal 的容器 | HTMLElement \| null | null \| HTMLElement | - |
| disabledPortal | 是否禁用 portal | boolean | true \| false | false |
| classNames | | PreviewSemanticClassNames | - | - |
| styles | | PreviewSemanticStyles | - | - |

