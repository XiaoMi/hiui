# Toast 弹出提示

弹出提示组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Toast from '@hi-ui/toast'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const ToastAPI = React.useMemo(() => Toast.create({ prefixCls: 'basic' }), [])

 return (
 <> 
 <div className="toast-basic__wrap">
 <Button
 onClick={() => {
 ToastAPI.open({
 title: 'xxxx',
 })
 }}
 >
 Toast
 </Button>

 <Button
 onClick={() => {
 ToastAPI.destroy()
 }}
 >
 Destroy Toast
 </Button>
 </div>
 </>
 )
}

```


## Props


