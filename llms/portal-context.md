# PortalContext 上下文

容器设置上下文。

## 使用示例

### 基础用法


```tsx
import React, { useContext } from 'react'
import { PortalContext } from '@hi-ui/portal-context' 
export const Basic = () => {
 useContext(PortalContext)

 return (
 <> 
 <div className="portal-context-basic__wrap"></div>
 </>
 )
}

```


## Props

### PortalProvider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------------------ | ---------------- | ------ | ------ |
| portal | 指定 portal 的容器 | UsePortalContext | - | - |

