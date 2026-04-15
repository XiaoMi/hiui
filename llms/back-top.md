# BackTop 回到顶部

当内容滑动到设定高度时，显示回到顶部按钮，点击按钮回到最顶部。

## 使用示例

### 基础用法

当滚动到设定高度时，会出现回到顶部按钮，点击回到最顶部


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import { UpShortOutlined } from '@hi-ui/icons'
import BackTop from '@hi-ui/back-top' 
export const Basic = () => {
 return (
 <> 
 <div className="back-top-basic__wrap">
 <div style={{ position: 'relative', height: 400 }}>
 <BackTop
 style={{ position: 'absolute' }}
 container={() => document.getElementById('back-top_target')}
 />
 <div
 id="back-top_target"
 style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
 >
 {Array.from({ length: 10 }, (_, index) => (
 <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
 页面内容{index}
 </div>
 ))}
 </div>
 </div>
 </div>
 <BackTop>
 <Tooltip title="回到顶部" placement="left" disabledPortal={true}>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: 40,
 height: 40,
 borderRadius: '50%',
 color: '#fff',
 background: '#237ffa',
 }}
 >
 <UpShortOutlined />
 </div>
 </Tooltip>
 </BackTop>
 </>
 )
}

```


### 参数设置

设置按钮形状、主题、滚动时间、滚动到多高时显示


```tsx
import React, { useState } from 'react'
import Space from '@hi-ui/space'
import Select from '@hi-ui/select'
import Input from '@hi-ui/input'
import BackTop from '@hi-ui/back-top' 
export const Settings = () => {
 const [shape, setShape] = useState<any>('circle')
 const [duration, setDuration] = useState<any>(400)
 const [visibleHeight, setVisibleHeight] = useState<any>(400)

 return (
 <> 
 <div className="back-top-basic__wrap">
 <Space style={{ marginBottom: 20 }}>
 <span>形状</span>
 <Select
 style={{ width: 110, marginRight: 20 }}
 clearable={false}
 value={shape}
 onChange={setShape}
 data={[
 { id: 'circle', title: '圆形' },
 { id: 'square', title: '圆角矩形' },
 ]}
 />
 <span>滚动时间(ms)</span>
 <Input
 value={duration}
 onChange={(data) => setDuration(data.target.value)}
 style={{ width: 110, marginRight: 20 }}
 />
 <span>visibleHeight</span>
 <Input
 value={visibleHeight}
 onChange={(data) => setVisibleHeight(data.target.value)}
 style={{ width: 110 }}
 />
 </Space>
 <div style={{ position: 'relative', height: 400 }}>
 <BackTop
 shape={shape}
 duration={duration}
 visibleHeight={visibleHeight}
 style={{ position: 'absolute' }}
 container={() => document.getElementById('back-top_setting')}
 />
 <div
 id="back-top_setting"
 style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
 >
 {Array.from({ length: 10 }, (_, index) => (
 <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
 页面内容{index}
 </div>
 ))}
 </div>
 </div>
 </div>
 </>
 )
}

```


### 自定义按钮位置和内容

给组件传入样式和children


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import { ToTopOutlined } from '@hi-ui/icons'

import BackTop from '@hi-ui/back-top' 
export const Custom = () => {
 return (
 <> 
 <div className="back-top-basic__wrap">
 <div style={{ position: 'relative', height: 400 }}>
 <BackTop
 style={{ position: 'absolute', right: 50, bottom: 112 }}
 container={() => document.getElementById('back-top_custom')}
 onClick={() => {
 Tooltip.close('back-top-custom')
 }}
 onMouseEnter={(evt) => {
 Tooltip.open(evt.currentTarget, {
 key: 'back-top-custom',
 title: '回到顶部',
 placement: 'left',
 })
 }}
 onMouseLeave={() => {
 Tooltip.close('back-top-custom')
 }}
 >
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: 40,
 height: 40,
 borderRadius: '50%',
 color: '#fff',
 background: '#237ffa',
 }}
 >
 <ToTopOutlined />
 </div>
 </BackTop>
 <div
 id="back-top_custom"
 style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
 >
 {Array.from({ length: 10 }, (_, index) => (
 <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
 页面内容{index}
 </div>
 ))}
 </div>
 </div>
 </div>
 </>
 )
}

```


### 组合使用

和其他元素组合使用


```tsx
import React from 'react'
import { ScanOutlined, MessageOutlined } from '@hi-ui/icons'
import BackTop from '@hi-ui/back-top' 
export const Compose = () => {
 return (
 <> 
 <div className="back-top-basic__wrap">
 <div style={{ position: 'relative', height: 400 }}>
 <div
 style={{
 position: 'absolute',
 right: 32,
 bottom: 88,
 width: 40,
 zIndex: 9,
 }}
 >
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: 40,
 height: 40,
 borderRadius: '50%',
 background: '#fff',
 color: '#5f6a7a',
 fontSize: 20,
 boxShadow: '0 12px 24px 8px rgba(31, 39, 51, 0.1)',
 }}
 >
 <ScanOutlined />
 </div>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: 40,
 height: 40,
 borderRadius: '50%',
 background: '#fff',
 color: '#5f6a7a',
 fontSize: 20,
 boxShadow: '0 12px 24px 8px rgba(31, 39, 51, 0.1)',
 marginTop: 16,
 }}
 >
 <MessageOutlined />
 </div>
 </div>
 <BackTop
 shape="circle"
 style={{ position: 'absolute' }}
 container={() => document.getElementById('back-top_compose')}
 />
 <div
 id="back-top_compose"
 style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
 >
 {Array.from({ length: 10 }, (_, index) => (
 <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
 页面内容{index}
 </div>
 ))}
 </div>
 </div>
 </div>
 </>
 )
}

```


## Props

### BackTop Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ | -------- |
| shape | 设置形状 | "circle" \| "square" | "circle" \| "square" | "circle" |
| visibleHeight | 当内容滚动到该高度时，显示回到顶部组件 | number | - | 400 |
| duration | 回到顶部所需时间（ms） | number | - | 400 |
| container | 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| onClick | 点击回到顶部时的回调函数 | (() => void) | - | - |

