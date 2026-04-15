# ResizeBox 伸缩框

用于可调整大小的布局。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import ResizeBox, { ResizeBoxPane } from '@hi-ui/resize-box' 
export const Basic = () => {
 return (
 <> 
 <div className="resize-box-basic__wrap">
 <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
 <ResizeBoxPane defaultWidth={300} onResize={console.log}>
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 left content
 </div>
 </ResizeBoxPane>
 <ResizeBoxPane>
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 right content
 </div>
 </ResizeBoxPane>
 </ResizeBox>
 </div>
 </>
 )
}

```


### 设置 pane 最小宽度


```tsx
import React from 'react'
import ResizeBox, { ResizeBoxPane } from '@hi-ui/resize-box' 
export const MinWidth = () => {
 return (
 <> 
 <div className="resize-box-min-width__wrap">
 <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
 <ResizeBoxPane defaultWidth={300} minWidth={100}>
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 left content
 </div>
 </ResizeBoxPane>
 <ResizeBoxPane>
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 right content
 </div>
 </ResizeBoxPane>
 </ResizeBox>
 </div>
 </>
 )
}

```


### 设置是否可折叠


```tsx
import React from 'react'
import ResizeBox, { ResizeBoxPane } from '@hi-ui/resize-box' 
export const Collapsible = () => {
 const [collapsed, setCollapsed] = React.useState<boolean>(false)

 return (
 <> 
 <div className="resize-box-collapsible__wrap">
 <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
 <ResizeBoxPane
 collapsible
 collapsed={collapsed}
 onCollapse={setCollapsed}
 defaultWidth={200}
 onResize={console.log}
 >
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 left content
 </div>
 </ResizeBoxPane>
 <ResizeBoxPane>
 <div
 style={{
 width: '100%',
 overflow: 'auto',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 right content
 </div>
 </ResizeBoxPane>
 </ResizeBox>
 </div>
 </>
 )
}

```


## Props

### ResizeBox Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---- | -------------- | ------ | ------ |
| separatorProps | | SeparatorProps | - | - |


### ResizeBoxPane Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ---- | ------------------------------ | ------------- | ------ |
| defaultWidth | | number | - | - |
| width | | number | - | - |
| minWidth | | number | - | - |
| collapsible | | boolean | true \| false | - |
| collapsed | | boolean | true \| false | - |
| onCollapse | | ((collapsed: boolean) => void) | - | - |
| onResizeStart | | (() => void) | - | - |
| onResizeEnd | | (() => void) | - | - |
| onResize | | ((width: number) => void) | - | - |

