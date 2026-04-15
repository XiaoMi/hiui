# Scrollbar 滚动条

滚动条用于跨系统统一滚动视觉样式、行为，便捷监听滚动事件。

## 使用示例

### 基础用法

默认鼠标不再容器内隐藏，x、y轴都展示


```tsx
import React from 'react'
import Scrollbar from '@hi-ui/scrollbar' 
export const Basic = () => {
 return (
 <> 
 <div className="scrollbar-basic__wrap" style={{ height: 320 }}>
 <Scrollbar>
 <div style={{ height: 640, width: '100%' }}>
 <div style={{ height: 160, background: '#03A9F433' }} />
 <div style={{ height: 160, background: '#00968833' }} />
 <div style={{ height: 160, background: '#FF572233' }} />
 <div style={{ height: 160, background: '#E91E6333' }} />
 </div>
 </Scrollbar>
 </div>
 </>
 )
}

```


### 使用坐标轴

默认 `x`、`y` 都可滚动


```tsx
import React, { useMemo } from 'react'
import Scrollbar from '@hi-ui/scrollbar' 
export const Axes = () => {
 const scrollContent = useMemo(() => {
 return (
 <div style={{ height: 640, width: '200%' }}>
 <div style={{ height: 160, background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#00968833,#009688cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#FF572233,#FF5722cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)' }} />
 </div>
 )
 }, [])

 return (
 <> 
 <h2>both(default)</h2>
 <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar>{scrollContent}</Scrollbar>
 </div>
 <h2>x</h2>
 <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar axes={'x'}>{scrollContent}</Scrollbar>
 </div>
 <h2>y</h2>
 <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar axes={'y'}>{scrollContent}</Scrollbar>
 </div>
 <h2>none</h2>
 <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar axes={'none'}>{scrollContent}</Scrollbar>
 </div>
 </>
 )
}

```


### 展示配置

可配置轴展示行为


```tsx
import React, { useMemo } from 'react'
import Scrollbar from '@hi-ui/scrollbar' 
export const Config = () => {
 const scrollContent = useMemo(() => {
 return (
 <div style={{ height: 640, width: '100%' }}>
 <div style={{ height: 160, background: '#03A9F433' }} />
 <div style={{ height: 160, background: '#00968833' }} />
 <div style={{ height: 160, background: '#FF572233' }} />
 <div style={{ height: 160, background: '#E91E6333' }} />
 </div>
 )
 }, [])

 return (
 <> 
 <h2>keepVisible</h2>
 <div className="scrollbar-config__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar keepVisible>{scrollContent}</Scrollbar>
 </div>
 <h2>onlyScrollVisible</h2>
 <div className="scrollbar-config__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar onlyScrollVisible>{scrollContent}</Scrollbar>
 </div>
 </>
 )
}

```


### 带边框


```tsx
import React from 'react'
import Scrollbar from '@hi-ui/scrollbar' 
export const Bordered = () => {
 return (
 <> 
 <div className="scrollbar-bordered__wrap" style={{ height: 320 }}>
 <Scrollbar bordered keepVisible>
 <div style={{ height: 640, width: '200%' }}>
 <div
 style={{ height: 160, background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)' }}
 />
 <div
 style={{ height: 160, background: 'linear-gradient(90deg,#00968833,#009688cc)' }}
 />
 <div
 style={{ height: 160, background: 'linear-gradient(90deg,#FF572233,#FF5722cc)' }}
 />
 <div
 style={{ height: 160, background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)' }}
 />
 </div>
 </Scrollbar>
 </div>
 </>
 )
}

```


### 滚动事件

可以使用内置提供的一系列自定义滚动事件


```tsx
import React, { useMemo } from 'react'
import Scrollbar from '@hi-ui/scrollbar' 
export const Event = () => {
 const scrollContent = useMemo(() => {
 return (
 <div style={{ height: 640, width: '200%' }}>
 <div style={{ height: 160, background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#00968833,#009688cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#FF572233,#FF5722cc)' }} />
 <div style={{ height: 160, background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)' }} />
 </div>
 )
 }, [])

 return (
 <> 
 <h2>x、y滚动事件</h2>
 <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar
 onScrollX={() => console.log('scroll x')}
 onScrollY={() => console.log('scroll y')}
 >
 {scrollContent}
 </Scrollbar>
 </div>
 <h2>特定滚动方向事件</h2>
 <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar
 onScrollUp={() => console.log('scroll up')}
 onScrollDown={() => console.log('scroll down')}
 onScrollLeft={() => console.log('scroll left')}
 onScrollRight={() => console.log('scroll right')}
 >
 {scrollContent}
 </Scrollbar>
 </div>
 <h2>滚动到边界事件</h2>
 <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
 <Scrollbar
 onXReachStart={() => console.log('reach x start')}
 onXReachEnd={() => console.log('reach x end')}
 onYReachStart={() => console.log('reach y start')}
 onYReachEnd={() => console.log('reach y end')}
 >
 {scrollContent}
 </Scrollbar>
 </div>
 </>
 )
}

```


### 滚动条吸底

默认不开启，开启后默认在 Scrollbar 组件内部滚动有效，如需外部使用，需要手动调用 update 方法


```tsx
import React, { useRef, useEffect } from 'react'
import Scrollbar, { ScrollbarHelpers } from '@hi-ui/scrollbar' 
export const Fixed = () => {
 const innerRef = useRef<ScrollbarHelpers>(null)
 const update = () => innerRef.current?.update?.()

 // 此处演示在外部使用该效果
 useEffect(() => {
 document.addEventListener('scroll', update)

 return () => {
 document.removeEventListener('scroll', update)
 }
 }, [])

 return (
 <> 
 <div className="scrollbar-sticky__wrap">
 <Scrollbar
 innerRef={innerRef}
 keepVisible
 style={{
 height: 400,
 }}
 settings={{ scrollbarXStickToBottom: true, scrollbarXStickToBottomGap: 20 }}
 >
 <div style={{ height: 640, width: '200%' }}>
 <div
 style={{
 height: 160,
 background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)',
 }}
 />
 <div
 style={{
 height: 160,
 background: 'linear-gradient(90deg,#00968833,#009688cc)',
 }}
 />
 <div
 style={{
 height: 160,
 background: 'linear-gradient(90deg,#FF572233,#FF5722cc)',
 }}
 />
 <div
 style={{
 height: 160,
 background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)',
 }}
 />
 </div>
 </Scrollbar>
 </div>
 </>
 )
}

```


## Props

### Scrollbar Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | --------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| position | 容器 css position | ScrollbarPositionEnum | "-moz-initial" \| "inherit" \| "initial" \| "revert" \| "unset" \| "-webkit-sticky" \| "absolute" \| "fixed" \| "relative" \| "sticky" | "relative" |
| zIndex | 设置滚动条 z-index | string \| number | string \| number | "'auto'" |
| axes | 开启滚动的轴 | ScrollbarAxesEnum | "none" \| "both" \| "x" \| "y" | "both" |
| keepVisible | 轴一直保持可视状态(优先级高于\`onlyScrollVisible\`) | boolean | true \| false | false |
| onlyScrollVisible | 只有滚动的时候才会展示滚动条 | boolean | true \| false | false |
| settings | 滚动条配置 | Settings | - | "{}" |
| bordered | 是否显示边框 | boolean | true \| false | "false" |
| onScrollY | y轴滚动 | ((e: Event) => void) | - | - |
| onScrollX | x轴滚动 | ((e: Event) => void) | - | - |
| onScrollUp | 向上滚动 | ((e: Event) => void) | - | - |
| onScrollDown | 向下滚动 | ((e: Event) => void) | - | - |
| onScrollLeft | 向左滚动 | ((e: Event) => void) | - | - |
| onScrollRight | 向右滚动 | ((e: Event) => void) | - | - |
| onYReachStart | y轴抵达最开始 | ((e: Event) => void) | - | - |
| onYReachEnd | y轴抵达最后 | ((e: Event) => void) | - | - |
| onXReachStart | x轴抵达最开始 | ((e: Event) => void) | - | - |
| onXReachEnd | x轴抵达最后 | ((e: Event) => void) | - | - |


## Type

#### Settings

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------------------- | --------------- | ------- | ------------- | ----- |
| scrollbarXStickToBottom | 开启横向滚动条吸底 | boolean | true \| false | - |
| scrollbarXStickToBottomGap | 横向滚动条吸底间隙 | number | - | - |
