# SvgIcon SVG图标

用于快速生成 SVG 图标的组件。

## 使用示例

### 基础用法

作为 svg 容器快速绘制生成简单的 SvgIcon


```tsx
import React from 'react'
import SvgIcon from '@hi-ui/svg-icon' 
export const Basic = () => {
 return (
 <> 
 <div className="svg-icon-basic__wrap">
 <SvgIcon aria-label="home">
 <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
 </SvgIcon>
 </div>
 </>
 )
}

```


### Viewbox

自定义 viewBox 设置 svg 显示区域


```tsx
import React from 'react'
import SvgIcon from '@hi-ui/svg-icon' 
export const Viewbox = () => {
 return (
 <> 
 <div className="svg-icon-viewbox__wrap">
 <SvgIcon aria-label="action" viewBox="0 0 16 16">
 <path d="M4.5,6.5 L4.5,9.5 L1.5,9.5 L1.5,6.5 L4.5,6.5 Z M9.5,6.5 L9.5,9.5 L6.5,9.5 L6.5,6.5 L9.5,6.5 Z M14.5,6.5 L14.5,9.5 L11.5,9.5 L11.5,6.5 L14.5,6.5 Z"></path>
 </SvgIcon>
 </div>
 </>
 )
}

```


## Props

### SvgIcon Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------------ | ------ | ------ | ----------- |
| viewBox | svg 可视区盒 | string | - | "0 0 24 24" |
| size | svg 尺寸大小 | number | - | - |

