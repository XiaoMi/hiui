# GlobalContext 上下文

全局设置上下文。

## 使用示例

### 基础用法


```tsx
import React, { useContext } from 'react'
import { GlobalContext } from '@hi-ui/global-context' 
export const Basic = () => {
 useContext(GlobalContext)

 return (
 <> 
 <div className="global-context-basic__wrap"></div>
 </>
 )
}

```


## Props

### GlobalProvider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---- | ---------------- | ------ | ------ |
| value *(required)* | | UseGlobalContext | - | - |

