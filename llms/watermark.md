# Watermark 水印

用于向元素添加水印。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Watermark from '@hi-ui/watermark' 
export const Basic = () => {
 return (
 <> 
 <div
 className="watermark-basic__wrap"
 style={{ height: 402, minWidth: 660, position: 'relative', zIndex: 0 }}
 >
 <Watermark content={['HiUI', '做中台，就用 HiUI']}></Watermark>
 </div>
 </>
 )
}

```


### 自定义疏密度

通过 density 设置水印的疏密度


```tsx
import React from 'react'
import Watermark from '@hi-ui/watermark' 
export const Density = () => {
 return (
 <> 
 <div
 className="watermark-density__wrap"
 style={{ height: 402, minWidth: 660, position: 'relative', zIndex: 0 }}
 >
 <Watermark density="low" content={['HiUI', '做中台，就用 HiUI']}></Watermark>
 </div>
 </>
 )
}

```


### 指定容器

指定要挂载水印的容器位置


```tsx
import React, { useState } from 'react'
import Watermark from '@hi-ui/watermark'
import { Button } from '@hi-ui/button' 
export const Container = () => {
 const [mounted, setMounted] = useState<any>(false)

 return (
 <> 
 <div className="watermark-container__wrap" style={{ height: 402, minWidth: 660 }}>
 <Button
 type="primary"
 onClick={() => {
 setMounted(!mounted)
 }}
 >
 {mounted ? '取消挂载水印到全局' : '挂载水印到全局'}
 </Button>
 </div>
 {mounted ? (
 <Watermark
 style={{
 pointerEvents: 'none',
 position: 'fixed',
 top: 0,
 right: 0,
 bottom: 0,
 left: 0,
 zIndex: 2048,
 }}
 content={['HiUI', '做中台，就用 HiUI']}
 container={document.body}
 allowCopy={true}
 />
 ) : null}
 </>
 )
}

```


## Props

### Watermark Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ------------------------------------------------------------------------------- | ---------------------------- | ---------------------------- | ------ |
| container | 水印挂载的容器 | HTMLElement | - | - |
| logo | 图片资源地址 | string \| null | null \| string | - |
| density | 水印间距，调节疏密程度 | "default" \| "low" \| "high" | "default" \| "low" \| "high" | - |
| opacity | 水印透明度 | number | - | - |
| content | 水印文案，传入数组代表多行，不建议超过三行 | string \| string\[] | string \| string\[] | - |
| allowCopy | 是否允许拷贝 | boolean | true \| false | - |
| zIndex | 水印层级 | number | - | - |
| fontSize | 水印文字大小 | number | - | - |
| grayscale | 开启水印灰度化 | boolean | true \| false | - |
| textOverflowEffect | 文本长度超出画布长度时的处理方式，zoom - 缩小文字 cut - 截断文字 wrap - 换行 | "zoom" \| "wrap" \| "cut" | "zoom" \| "wrap" \| "cut" | - |
| color | 水印文字颜色，建议使用低透明度的 rgba 值 | string | - | - |

