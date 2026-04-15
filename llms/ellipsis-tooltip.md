# EllipsisTooltip 文字超出提示

文字个数超出后展示省略号，鼠标悬停时出现全部描述。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const Basic = () => {
 const textOverview = '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？'

 return (
 <> 
 <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400, margin: '0 auto' }}>
 <h2>没有超出</h2>
 <EllipsisTooltip>这段文字没有超出限制时，不会出现提示</EllipsisTooltip>
 <h2>超出宽度限制</h2>
 <EllipsisTooltip
 tooltipProps={{
 title: <div style={{ width: 320 }}>{textOverview}</div>,
 }}
 >
 {textOverview}
 </EllipsisTooltip>
 </div>
 </>
 )
}

```


### 多行省略


```tsx
import React from 'react'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const MultiplyLine = () => {
 const textOverview =
 '【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”，【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”'

 return (
 <> 
 <div className="ellipsis-tooltip-basic__wrap" style={{ width: 400, margin: '0 auto' }}>
 <h4>超出 3 行(tooltip 内容过多可设置样式换行)</h4>
 <EllipsisTooltip
 numberOfLines={3}
 tooltipProps={{
 title: <div style={{ width: 420 }}>{textOverview}</div>,
 }}
 >
 {textOverview}
 </EllipsisTooltip>
 </div>
 </>
 )
}

```


### 超出字数省略


```tsx
import React from 'react'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const MaxTextCount = () => {
 const textOverview = '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？'

 return (
 <> 
 <div className="ellipsis-tooltip-multiple__wrap" style={{ width: 400, margin: '0 auto' }}>
 <h2>没有超出</h2>
 <EllipsisTooltip maxTextCount={20}>学而时习之</EllipsisTooltip>
 <h2>文字超出 20 个字符时</h2>
 <EllipsisTooltip
 maxTextCount={20}
 tooltipProps={{
 title: <div style={{ width: 320 }}>{textOverview}</div>,
 }}
 >
 {textOverview}
 </EllipsisTooltip>
 </div>
 </>
 )
}

```


## Props

### EllipsisTooltip Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ------------------------------------------------- | ---------------------- | ------ | ------ |
| numberOfLines | 超出行数展示省略号，children 是 string 类型时有效 | number | - | 1 |
| maxTextCount | 最大文字展示，children 是 string 类型时有效 | number | - | 0 |
| tooltipProps | tooltip 属性收敛 | Partial\<TooltipProps> | - | - |

