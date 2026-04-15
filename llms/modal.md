# Modal 模态框

模态对话框一般会中断当前任务流，在相对无信息干扰的环境下完成微型任务。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Basic = () => {
 const [visible, setVisible] = React.useState(false)
 console.log('visible', visible)

 return (
 <> 
 <div className="modal-basic__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal title="提示" visible={visible} onCancel={() => setVisible(false)}>
 代码如写诗
 <br />
 <br />
 写诗如代码
 <br />
 <br />
 这是一门艺术
 </Modal>
 </div>
 </>
 )
}

```


### 带关闭按钮


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Closeable = () => {
 const [visible, setVisible] = React.useState(false)
 console.log(visible)

 return (
 <> 
 <div className="modal-closeable__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal title="提示消息" visible={visible} closeable onCancel={() => setVisible(false)}>
 <span>哈哈哈哈哈....</span>
 <br />
 <span>哈哈哈哈哈...</span>
 <br />
 <span>哈哈哈哈哈...</span>
 </Modal>
 </div>
 </>
 )
}

```


### 异步确认关闭

通过 confirmLoading 控制确定按钮的 loading 状态，实现异步关闭


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const AsyncConfirm = () => {
 const [visible, setVisible] = React.useState(false)
 const [confirmLoading, setConfirmLoading] = React.useState(false)
 console.log('visible', visible)

 return (
 <> 
 <div className="modal-async-confirm__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal
 title="提示"
 visible={visible}
 closeable={false}
 onCancel={() => setVisible(false)}
 onConfirm={() => {
 console.log('自定义确认事件')

 setConfirmLoading(true)
 setTimeout(() => {
 setVisible(false)
 setConfirmLoading(false)
 }, 1000)
 }}
 confirmLoading={confirmLoading}
 >
 代码如写诗
 <br />
 <br />
 写诗如代码
 <br />
 <br />
 这是一门艺术
 </Modal>
 </div>
 </>
 )
}

```


### 不同尺寸

通过 size 自定义尺寸


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal, { ModalSizeEnum } from '@hi-ui/modal' 
export const Size = () => {
 const [visibleModalSize, setVisibleModalSize] = React.useState<ModalSizeEnum>()

 return (
 <> 
 <div className="modal-size__wrap">
 <Button onClick={() => setVisibleModalSize('sm')}>sm</Button>

 <Button onClick={() => setVisibleModalSize('md')}>md</Button>

 <Button onClick={() => setVisibleModalSize('lg')}>lg</Button>
 <Modal
 title="提示"
 visible={!!visibleModalSize}
 size={visibleModalSize}
 onCancel={() => setVisibleModalSize(undefined)}
 >
 这是一个标题描述…
 <br />
 这是一个标题描述…
 <br />
 这是一个标题描述…
 </Modal>
 </div>
 </>
 )
}

```


### 自定义按钮

通过 footer 自定义底部的按钮，并自定义事件


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Footer = () => {
 const [visible, setVisible] = React.useState(false)
 console.log('visible', visible)

 return (
 <> 
 <div className="modal-footer__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal
 title="提示"
 visible={visible}
 closeable={false}
 onCancel={() => setVisible(false)}
 footer={[
 <Button type="primary" key={0} onClick={() => console.log(1)}>
 自定义按钮1
 </Button>,
 <Button type="success" key={1} onClick={() => console.log(2)}>
 自定义按钮2
 </Button>,
 <Button type="danger" key={2} onClick={() => console.log(3)}>
 自定义按钮3
 </Button>,
 <Button type="default" key={3} onClick={() => setVisible(false)}>
 关闭
 </Button>,
 ]}
 >
 代码如写诗
 <br />
 <br />
 写诗如代码
 <br />
 <br />
 这是一门艺术
 </Modal>
 </div>
 </>
 )
}

```


### 提示弹窗

未传入 title 及 closeable 为 false，可取消 title 部分；footer 为 null，可取消底部按钮


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Popup = () => {
 const [visible, setVisible] = React.useState(false)
 console.log('visible', visible)

 return (
 <> 
 <div className="modal-popup__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal visible={visible} closeable={false} onCancel={() => setVisible(false)} footer={null}>
 <div style={{ padding: '18px 0' }}>
 代码如写诗
 <br />
 <br />
 写诗如代码
 <br />
 <br />
 这是一门艺术
 </div>
 </Modal>
 </div>
 </>
 )
}

```


### 内容溢出滚动


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Scroll = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="modal-scroll__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal title="弹窗标题" visible={visible} onCancel={() => setVisible(false)}>
 <div>
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区 模拟超长的内容区 模拟超长的内容区 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 <br />
 模拟超长的内容区
 </div>
 </Modal>
 </div>
 </>
 )
}

```


### 嵌套弹窗

反复操作确认弹窗场景


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Nested = () => {
 const [visible, setVisible] = React.useState(false)
 const [nestVisible, setNestVisible] = React.useState(false)

 return (
 <> 
 <div className="modal-nested__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Modal title="提示" visible={visible} onCancel={() => setVisible(false)}>
 <div>这里是弹窗内容</div>
 <Button style={{ marginTop: 20 }} onClick={() => setNestVisible(!nestVisible)}>
 Nested
 </Button>
 <Modal title="提示" visible={nestVisible} onCancel={() => setNestVisible(false)}>
 Nest这里是弹窗内容
 </Modal>
 </Modal>
 </div>
 </>
 )
}

```


### 局部容器弹窗


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Container = () => {
 const [visible, setVisible] = React.useState(false)
 const [container, setContainer] = React.useState(undefined)

 console.log('visible', visible)

 return (
 <> 

 <div
 ref={setContainer}
 className="modal-container__wrap"
 style={{
 width: '100%',
 minWidth: 660,
 height: 420,
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
 <Button type="primary" onClick={() => setVisible(!visible)}>
 open
 </Button>
 <Modal
 title="提示"
 style={{ position: 'absolute' }}
 visible={visible}
 onCancel={() => setVisible(false)}
 container={container}
 >
 我是挂载指定容器的模态框内容
 </Modal>
 </div>
 </>
 )
}

```


### 询问式弹窗

用户在界面交互过程中的行为确认，适合轻量简单的场景


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const WithAPI = () => {
 return (
 <> 
 <div className="modal-with-api__wrap">
 <Button
 type="danger"
 onClick={() =>
 Modal.confirm({
 type: 'error',
 title: '错误',
 content: '操作失败，请联系管理员！',
 cancelText: '取消',
 confirmText: '我知道了',
 closeable: false,
 })
 }
 >
 打开错误提示
 </Button>
 <Button
 type="default"
 appearance="solid"
 onClick={() =>
 Modal.confirm({
 type: 'warning',
 title: '警告',
 content: '执行该操作后将无法撤销，是否确定继续？',
 cancelText: '取消',
 confirmText: '确定',
 closeOnEsc: false,
 maskClosable: false,
 closeable: false,
 })
 }
 >
 打开警告提示
 </Button>

 <Button
 type="success"
 onClick={() =>
 Modal.confirm({
 type: 'success',
 title: '成功',
 content:
 '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 打开成功提示
 </Button>

 <Button
 type="primary"
 onClick={() =>
 Modal.confirm({
 type: 'info',
 title: '普通',
 content:
 '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 打开普通提示
 </Button>

 <Button
 type="secondary"
 onClick={() =>
 Modal.confirm({
 type: 'info',
 title: '普通',
 content:
 '这是信息提示对话框的描述，这是信息提示对话框的描述，这是信息提示对话框的描述',
 cancelText: '取消',
 confirmText: '确定',
 onConfirm: async () => {
 return new Promise((resolve) => setTimeout(resolve, 1000))
 },
 closeable: false,
 })
 }
 >
 异步确认关闭
 </Button>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Modal, { ModalSemanticName } from '@hi-ui/modal' 
export const Semantic = () => {
 const [selected, setSelected] = useState<ModalSemanticName>()
 const [container, setContainer] = useState<HTMLDivElement | null>(null)

 return (
 <> 
 <div className="modal-semantic__wrap">
 <Row gutter={12}>
 <Col span={18} style={{ position: 'relative', zIndex: 0 }} ref={setContainer}>
 <Modal
 visible
 title="语义化功能示例"
 type="success"
 style={{ position: 'absolute', overflow: 'unset' }}
 container={container}
 classNames={{
 root: 'my-modal__root',
 overlay: 'my-modal__overlay',
 wrapper: 'my-modal__wrapper',
 header: 'my-modal__header',
 title: 'my-modal__title',
 icon: 'my-modal__icon',
 closeButton: 'my-modal__close-button',
 body: 'my-modal__body',
 footer: 'my-modal__footer',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 overflow: 'unset',
 },
 }}
 >
 <div>这是 Modal 的内容区域</div>
 <div>通过 classNames 和 styles 属性可以自定义各个元素的样式</div>
 </Modal>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 {
 title: 'root',
 description: '根元素',
 },
 {
 title: 'overlay',
 description: '遮罩层',
 },
 {
 title: 'wrapper',
 description: '内容包装器',
 },
 {
 title: 'header',
 description: '头部区域',
 },
 {
 title: 'title',
 description: '标题',
 },
 {
 title: 'icon',
 description: '图标',
 },
 {
 title: 'closeButton',
 description: '关闭按钮',
 },
 {
 title: 'body',
 description: '内容区域',
 },
 {
 title: 'footer',
 description: '底部区域',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as any)
 }}
 onMouseLeave={() => {
 setSelected(undefined)
 }}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### Context 访问

可通过 Modal.useModal 在使用 api 式调用时，访问外层 Context


```tsx
import React, { useContext, useState } from 'react'
import Button from '@hi-ui/button'
import Modal from '@hi-ui/modal' 
export const Context = () => {
 const [ThemeContext] = useState(() => React.createContext<string>('light'))
 const ThemeConsumer = () => {
 const theme = useContext(ThemeContext)
 return <span>当前主题: {theme}</span>
 }

 const [modal, contextHolder] = Modal.useModal()

 return (
 <ThemeContext.Provider value="dark">
 <div> 
 <p>将 contextHolder 放在 ThemeContext.Provider 内，模态窗内容区域可正常获取外部 Context</p>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
 <Button
 type="primary"
 onClick={() =>
 modal.confirm({
 title: 'useModal 可访问 Context',
 content: (
 <div>
 <ThemeConsumer />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
 将显示默认值「当前主题: dark」
 </p>
 </div>
 ),
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 使用 useModal
 </Button>
 <Button
 type="secondary"
 appearance="line"
 onClick={() =>
 Modal.confirm({
 title: '静态 API 无法访问 Context',
 content: (
 <div>
 <ThemeConsumer />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
 将显示默认值，因为创建了新 React 根
 </p>
 </div>
 ),
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 使用 Modal.confirm
 </Button>
 </div>
 {contextHolder}
 </div>
 </ThemeContext.Provider>
 )
}

```


## Props

### Modal Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | --------------------------------------------------------------------- | ----------------------- | ------------------------------------------- | ------ |
| size | 模态框尺寸 | ModalSizeEnum | Omit\<HiBaseSizeEnum, "xs"> | - |
| visible | 是否显示模态框 | boolean | true \| false | - |
| closeable | 是否展示右上角关闭按钮 | boolean | true \| false | - |
| container | 指定 portal 的容器 | HTMLElement \| null | null \| HTMLElement | - |
| title | 模态框标题 | ReactNode | - | - |
| cancelText | 取消按钮文案 | ReactNode | - | - |
| confirmText | 确认按钮文案 | ReactNode | - | - |
| confirmLoading | 确认按钮 loading 状态 | boolean | true \| false | - |
| footer | 自定义模态框底部 | ReactNode | - | - |
| onConfirm | 确认事件触发时的回调 | (() => void) | - | - |
| onCancel | 取消事件触发时的回调 | (() => void) | - | - |
| preload | 开启预加载渲染，用于性能优化，优先级小于 \`unmountOnClose\` | boolean | true \| false | - |
| unmountOnClose | 开启关闭时销毁，用于性能优化，优先级大于 \`preload\` | boolean | true \| false | - |
| width | 弹出层宽度设置 | ReactText | - | - |
| height | 弹出层高度设置 | ReactText | - | - |
| zIndex | 自定义css展示层级 | number | - | - |
| showMask | 是否显示蒙层 | boolean | true \| false | - |
| showHeaderDivider | 展示 header 与内容的分割线 | boolean | true \| false | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| type | 确认框类型 | ModalTypeEnum | "success" \| "error" \| "warning" \| "info" | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| maskClosable | 开启点击蒙层时关闭 | boolean | true \| false | - |
| onClose | 关闭时回调（设置该项后，如果要实现点击蒙层关闭，还需要设置 onCancel） | (() => void) | - | - |
| classNames | | ModalSemanticClassNames | - | - |
| styles | | ModalSemanticStyles | - | - |


## Methods

### Modal.confirm({ onConfirm, onCancel, title, content, type, confirmText, cancelText })

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------- | -------------------- | ---------- | -------------------------------------------------------- | --------- |
| onConfirm | 确认事件触发时的回调 | () => void | - | - |
| onCancel | 取消事件触发时的回调 | () => void | - | - |
| key | 组件实例唯一标识 | string | - | - |
| title | 确认弹窗的标题 | string | - | - |
| content | 确认弹窗的内容 | ReactNode | - | - |
| type | confirm 的类型 | string | 'default' \| 'success' \| 'error' \| 'warning' \| 'info' | 'default' |
| cancelText | 取消按钮文案 | string | - | '取消' |
| confirmText | 确认按钮文案 | string | - | '确定' |
| showHeaderDivider | 展示 header 与内容的分割线 | boolean | - | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | - | true |
| maskClosable | 开启点击蒙层时关闭 | boolean | - | true |

### Modal.close(key)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ------------------------------------ | ------ | ------ | ------ |
| key | Modal 实例唯一标识 | string | - | - |
