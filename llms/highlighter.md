# Highlighter 文本高亮

用于文本关键字高亮展示，实现快速结果匹配。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Highlighter from '@hi-ui/highlighter' 
export const Basic = () => {
 return (
 <> 
 <div className="highlighter-basic__wrap">
 <Highlighter keyword="高亮">我想要高亮的文案是：高亮</Highlighter>
 </div>
 </>
 )
}

```


### 自定义匹配规则


```tsx
import React from 'react'
import Highlighter from '@hi-ui/highlighter' 
export const Rule = () => {
 return (
 <> 
 <div className="highlighter-rule__wrap">
 <Highlighter keyword={/hiui/gi}>关键字 hiui，可以匹配上 hiui，也可匹配上 HiUI</Highlighter>
 </div>
 </>
 )
}

```


### 设置高亮样式


```tsx
import React from 'react'
import Highlighter from '@hi-ui/highlighter' 
export const Style = () => {
 return (
 <> 
 <div className="highlighter-style__wrap">
 <Highlighter keyword="高危" highlightStyle={{ color: 'red', fontWeight: 'bold' }}>
 请注意，这是一段高危操作！！
 </Highlighter>
 </div>
 </>
 )
}

```


## Props

### Highlighter Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | -------------- | ---------------- | ---------------- | ------ |
| keyword | 匹配高亮关键词 | string \| RegExp | string \| RegExp | - |
| highlightClassName | 高亮类名 | string | - | - |
| highlightStyle | 高亮样式 | CSSProperties | - | - |

