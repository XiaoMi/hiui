# Portal 传送门

传送门组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Portal from '@hi-ui/portal' 
export const Basic = () => {
 return (
 <> 
 <div className="portal-basic__wrap">
 <Portal>
 <div
 style={{
 position: 'fixed',
 top: '50%',
 left: '50%',
 padding: 20,
 background: 'rgb(160, 182, 249)',
 }}
 >
 Portal
 </div>
 </Portal>
 </div>
 </>
 )
}

```


## Props

### Portal Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | -------------------- | -------------------------------------------------- | ------------------------------------------------ | ------ |
| className | 组件的注入选择器类 | string | - | - |
| children | portal 内容 | ReactNode | - | - |
| container | 指定 portal 位置节点 | (() => HTMLElement \| null) \| HTMLElement \| null | null \| () => HTMLElement \| null \| HTMLElement | - |
| disabled | 是否关闭传送 | boolean | true \| false | - |

