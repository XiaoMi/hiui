# Notification 通知

系统发布通知、公布、公告等类型的全局信息。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="notification-basic__wrap">
 <Button
 onClick={() => {
 notification.open({
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 })
 }}
 >
 Notice
 </Button>
 </div>
 </>
 )
}

```


### 不同类型


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Type = () => {
 return (
 <> 
 <div className="notification-type__wrap">
 <Button
 type="primary"
 onClick={() => {
 notification.open({
 type: 'info',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 })
 }}
 >
 Info
 </Button>
 <Button
 type="success"
 onClick={() => {
 notification.open({
 type: 'success',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 })
 }}
 >
 Success
 </Button>
 <Button
 type="danger"
 onClick={() => {
 notification.open({
 type: 'error',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 })
 }}
 >
 Error
 </Button>
 <Button
 type="default"
 appearance="solid"
 onClick={() => {
 notification.open({
 type: 'warning',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 })
 }}
 >
 Warning
 </Button>
 </div>
 </>
 )
}

```


### 手动关闭


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Close = () => {
 const toastIdsRef = React.useRef([])

 function close() {
 const popId = toastIdsRef.current.pop()
 notification.close(popId)
 }

 function closeAll() {
 notification.closeAll()
 }

 function addToast() {
 const id = notification.open({
 title: 'some text',
 type: ['error', 'warning', 'success', 'info'][Math.floor(Math.random() * 4)] as any,
 content: 'some content',
 })
 toastIdsRef.current.push(id)
 }

 return (
 <> 
 <div className="notification-close__wrap">
 <Button onClick={addToast}>Notice</Button>

 <Button onClick={close}>Close latest Notice</Button>

 <Button onClick={closeAll}>Close all Notices</Button>
 </div>
 </>
 )
}

```


### 通知内容


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Title = () => {
 return (
 <> 
 <div className="notification-title__wrap">
 <Button
 onClick={() => {
 notification.open({
 autoClose: false,
 title: '重要通知：重复三遍',
 })
 notification.open({
 title: '重要通知：重复三遍',
 })
 notification.open({
 title: '重要通知：重复三遍',
 })
 }}
 >
 Notice
 </Button>
 </div>
 </>
 )
}

```


### 取消自动关闭


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const AutoClose = () => {
 return (
 <> 
 <div className="notification-auto-close">
 {/* <Message></Message> */}
 <Button
 onClick={() => {
 notification.open({
 autoClose: false,
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
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


### 带操作


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Action = () => {
 const notificationIdRef = React.useRef<React.ReactText | undefined>(undefined)

 return (
 <> 
 <div className="notification-action__wrap">
 <Button
 onClick={() => {
 notificationIdRef.current = notification.open({
 autoClose: false,
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！',
 action: (
 <>
 <Button
 type="default"
 appearance="line"
 onClick={() => {
 if (notificationIdRef.current) {
 notification.close(notificationIdRef.current)
 }
 }}
 >
 取消
 </Button>
 <Button
 type="primary"
 onClick={() => {
 if (notificationIdRef.current) {
 notification.close(notificationIdRef.current)
 }
 }}
 >
 确认
 </Button>
 </>
 ),
 })
 }}
 >
 Notice
 </Button>
 </div>
 </>
 )
}

```


### 设置尺寸


```tsx
import React from 'react'
import notification from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Size = () => {
 const notificationIdRef = React.useRef<React.ReactText>()

 const openNotification = (size) => {
 notificationIdRef.current = notification.open({
 size,
 autoClose: false,
 title: '数据备份通知',
 content: '将于 2035.08.10 00:00:00-08:00：00 期间进行系统服务器升级维护！',
 })
 }
 return (
 <> 
 <div className="notification-size__wrap">
 <Button onClick={() => openNotification('lg')}>Notice lg</Button>
 <Button onClick={() => openNotification('md')}>Notice md</Button>
 <Button onClick={() => openNotification('sm')}>Notice sm</Button>
 </div>
 </>
 )
}

```


### notification 属性配置

支持配置 container 和 zIndex


```tsx
import React, { useState, useMemo } from 'react'
import { createNotification } from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Custom = () => {
 const [container, setContainer] = useState<HTMLElement>()

 const notification = useMemo(
 () =>
 createNotification({
 container,
 zIndex: 2000,
 }),
 [container]
 )

 return (
 <> 

 <div
 ref={(e) => {
 e && setContainer(e)
 }}
 className="notification-custom__wrap"
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
 notification.open({
 size: 'sm',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护！',
 })
 }}
 >
 Open
 </Button>
 </div>
 </>
 )
}

```


### 弹出方向


```tsx
import React, { useMemo } from 'react'
import { createNotification } from '@hi-ui/notification'
import Button from '@hi-ui/button' 
export const Direction = () => {
 const notificationInstanceForTop = useMemo(
 () =>
 createNotification({
 placement: 'top',
 }),
 []
 )

 const notificationInstanceForBottom = useMemo(
 () =>
 createNotification({
 placement: 'bottom',
 }),
 []
 )

 return (
 <> 
 <div className="notification-direction__wrap">
 <h2>顶部左侧</h2>
 <Button
 onClick={() => {
 notificationInstanceForTop.open({
 direction: 'left',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
 new Date().toLocaleString(),
 })
 }}
 >
 top left
 </Button>
 <h2>顶部右侧</h2>
 <Button
 onClick={() => {
 notificationInstanceForTop.open({
 direction: 'right',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
 new Date().toLocaleString(),
 })
 }}
 >
 top right
 </Button>
 <h2>底部左侧</h2>
 <Button
 onClick={() => {
 notificationInstanceForBottom.open({
 direction: 'left',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
 new Date().toLocaleString(),
 })
 }}
 >
 bottom left
 </Button>
 <h2>底部右侧</h2>
 <Button
 onClick={() => {
 notificationInstanceForBottom.open({
 direction: 'right',
 title: '数据备份通知',
 content:
 '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！ ' +
 new Date().toLocaleString(),
 })
 }}
 >
 bottom right
 </Button>
 </div>
 </>
 )
}

```


## Props

## Methods

### notification.open({ type, title, content, duration, action, closeable, autoClose, onClose })

> 新开一个 notification 实例

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ----------------------- | ------------ | ------------------------------------------- | ------ |
| type | 通知框类型 | string | "info" \| "success" \| "error" \| "warning" | "info" |
| title _(required)_ | 通知框标题 | ReactNode | - | - |
| content | 通知框内容 | ReactNode | - | - |
| duration | 自动关闭时间，单位为 ms | number | - | 5000 |
| action | 操作配置 | ReactNode | - | - |
| closeable | 开启点击关闭 | boolean | true \| false | true |
| autoClose | 是否开启自动关闭 | boolean | true \| false | true |
| onClose | 关闭时触发的回调函数 | (() => void) | - | - |

### notification.close(key)

> 关闭指定 message 弹层实例

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ----------------------------------------- | ------ | ------ | ------ |
| key | open 方法返回的 notification 实例唯一标识 | string | - | - |

### notification.closeAll()

> 关闭所有 notification 弹层实例
