# Message 消息

轻量级的页面操作反馈提示。

## 使用示例

### 基础用法

一般提醒，不具有明确的引导倾向，自动关闭


```tsx
import React from 'react'
import message from '@hi-ui/message'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="message-basic__wrap">
 <Button
 onClick={() => {
 message.open({
 title: '欢迎使用 HiUI 组件库',
 type: 'success',
 })
 }}
 >
 Toast
 </Button>
 </div>
 </>
 )
}

```


### 不同类型

通过 type 指定不同类型场景的消息提醒


```tsx
import React from 'react'
import message from '@hi-ui/message'
import Button from '@hi-ui/button' 
export const Type = () => {
 function addToast(type) {
 return () => {
 message.open({
 title: '问君能有几多愁，恰似一江春水向东流',
 type,
 })
 }
 }

 return (
 <> 
 <div className="message-close__wrap">
 <Button type="primary" onClick={addToast('info')}>
 Info
 </Button>
 <Button type="success" onClick={addToast('success')}>
 Success
 </Button>
 <Button type="danger" onClick={addToast('error')}>
 Error
 </Button>
 <Button type="default" appearance="solid" onClick={addToast('warning')}>
 Warning
 </Button>
 </div>
 </>
 )
}

```


### 设置图标


```tsx
import React from 'react'
import message from '@hi-ui/message'
import Button from '@hi-ui/button'
import Spinner from '@hi-ui/spinner' 
export const Icon = () => {
 return (
 <> 
 <div className="message-icon__wrap">
 <Button
 onClick={() => {
 message.open({
 icon: <Spinner size="sm" />,
 title: '数据提交中，请勿关闭页面',
 })
 }}
 >
 Toast
 </Button>
 </div>
 </>
 )
}

```


### 手动关闭


```tsx
import React from 'react'
import message from '@hi-ui/message'
import Button from '@hi-ui/button' 
export const Close = () => {
 const toastIdsRef = React.useRef([])

 function close() {
 const popId = toastIdsRef.current.pop()
 message.close(popId)
 }

 function closeAll() {
 message.closeAll()
 }

 function addToast() {
 const id = message.open({
 title: '问君能有几多愁，恰似一江春水向东流',
 type: ['error', 'warning', 'success', 'info'][Math.floor(Math.random() * 4)] as any,
 })
 toastIdsRef.current.push(id)
 }

 return (
 <> 
 <div className="message-close__wrap">
 <Button onClick={addToast}>Toast</Button>

 <Button onClick={close}>Close latest toast</Button>

 <Button onClick={closeAll}>Close all toasts</Button>
 </div>
 </>
 )
}

```


### 取消自动关闭


```tsx
import React from 'react'
import message from '@hi-ui/message'
import Button from '@hi-ui/button' 
export const AutoClose = () => {
 return (
 <> 
 <div className="message-auto-close">
 <Button
 onClick={() => {
 const toastId = message.open({
 autoClose: false,
 title: (
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <span>这个 Toast 将不会自动被关闭哦 </span>
 <Button
 style={{ marginLeft: 24 }}
 type="primary"
 appearance="link"
 onClick={() => {
 message.close(toastId)
 }}
 >
 撤销
 </Button>
 </div>
 ),
 type: 'success',
 })
 }}
 >
 Toast
 </Button>
 </div>
 </>
 )
}

```


### message 属性自定义

支持配置 container 和 zIndex


```tsx
import React, { useMemo, useState } from 'react'
import { createMessage } from '@hi-ui/message'
import Button from '@hi-ui/button' 

export const Custom = () => {
 const [container, setContainer] = useState<HTMLElement>()
 const message = useMemo(
 () =>
 createMessage({
 container,
 zIndex: 1000,
 }),
 [container]
 )
 return (
 <> 
 <div className="message-custom__wrap">
 <div
 ref={(e) => {
 setContainer(e as HTMLDivElement)
 }}
 style={{
 width: '100%',
 minWidth: 660,
 height: 420,
 marginBottom: 20,
 background: '#f5f7fa',
 boxShadow: '1px 2px 8px #ddd',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',

 // Need add for it
 position: 'relative',
 overflow: 'hidden',
 zIndex: 0,
 }}
 >
 <Button
 type="primary"
 onClick={() => {
 message.open({
 title: '欢迎使用 HiUI 组件库',
 type: 'success',
 })
 }}
 >
 Toast
 </Button>
 </div>
 </div>
 </>
 )
}

```


## Props

## Methods

### message.open({ type, title, duration })

> 新开一个 message 实例

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ----------------------- | ------------------------------------------- | ------------------------------------------- | ------ |
| onClose | 关闭时触发的回调函数 | (() => void) | - | - |
| title _(required)_ | 通知框标题 | ReactNode | - | - |
| type | 通知框类型 | "info" \| "success" \| "error" \| "warning" | "info" \| "success" \| "error" \| "warning" | "info" |
| duration | 自动关闭时间，单位为 ms | number | - | 5000 |
| autoClose | 是否开启自动关闭 | boolean | true \| false | true |

### message.close(key)

> 关闭指定 message 弹层实例

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ------------------------------------ | ------ | ------ | ------ |
| key | open 方法返回的 message 实例唯一标识 | string | - | - |

### message.closeAll()

> 关闭所有 message 弹层实例
