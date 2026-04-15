# PopConfirm 气泡确认框

气泡确认框是指点击元素，弹出气泡式的确认框。

## 使用示例

### 基础用法


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm' 
export const Basic = () => {
 return (
 <> 
 <div className="pop-confirm-basic__wrap">
 <PopConfirm style={{ minWidth: 280 }} title="Hello! Are you OK?">
 <Button>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 自定义图标


```tsx
import Button from '@hi-ui/button'
import { CloseCircleFilled } from '@hi-ui/icons'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm' 
export const customIcon = () => {
 return (
 <> 
 <div className="pop-confirm-custom-icon__wrap">
 <PopConfirm
 title="Hello! Are you OK?"
 icon={<CloseCircleFilled style={{ color: '#fa4646' }} />}
 >
 <Button>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 自定义内容


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm' 
export const CustomContent = () => {
 return (
 <> 
 <div className="pop-confirm-basic__wrap">
 <PopConfirm
 style={{ minWidth: 280, maxWidth: 300 }}
 icon={null}
 title={<div style={{ whiteSpace: 'normal' }}>很长的通知标题</div>}
 content={<div>这是一段很长的内容这是一段很长的内容这是一段很长的内容</div>}
 >
 <Button>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 自定义底部内容


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm' 
export const CustomFooter = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="pop-confirm-custom-footer__wrap">
 <PopConfirm
 style={{ minWidth: 280 }}
 title="Hello! Are you OK?"
 visible={visible}
 footer={[
 <Button key="1" appearance="line" size="sm" onClick={() => setVisible(false)}>
 取消
 </Button>,
 <Button key="2" type="danger" size="sm" onClick={() => setVisible(false)}>
 确认
 </Button>,
 ]}
 >
 <Button onClick={() => setVisible(true)}>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 异步确认关闭

自定义 `footer` 实现自定义确认按钮以及点击事件


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm' 
export const Async = () => {
 const [visible, setVisible] = React.useState(false)
 const [loading, setLoading] = React.useState(false)

 return (
 <> 
 <div className="pop-confirm-async__wrap">
 <PopConfirm
 style={{ minWidth: 280 }}
 title="Hello! Are you OK?"
 visible={visible}
 footer={[
 <Button key="1" appearance="line" size="sm" onClick={() => setVisible(false)}>
 取消
 </Button>,
 <Button
 key="2"
 type="primary"
 size="sm"
 loading={loading}
 onClick={() => {
 setLoading(true)
 setTimeout(() => {
 // setLoading(false)
 // setVisible(false)
 }, 2000)
 }}
 >
 确认
 </Button>,
 ]}
 >
 <Button onClick={() => setVisible(true)}>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 设置间隙偏移量

设置基于依附元素的间隙偏移量


```tsx
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm'
import Button from '@hi-ui/button' 
export const GutterGap = () => {
 return (
 <> 
 <div className="pop-confirm-basic__wrap">
 <PopConfirm
 style={{ minWidth: 280 }}
 title="Delete this item along with the entered content?"
 gutterGap={12}
 >
 <Button>Trigger</Button>
 </PopConfirm>
 </div>
 </>
 )
}

```


### 不同方位


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm'
import { PopperJS } from '@hi-ui/popper' 
export const Placement = () => {
 const [placement, setPlacement] = React.useState<undefined | PopperJS.Placement>()

 const handleClick = (newPlacement) => () => {
 setPlacement(newPlacement)
 }

 const title = <span>Hello! Are you OK?</span>

 return (
 <> 
 <div className="pop-confirm-placement__wrap">
 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('top-start')}>
 topStart
 </Button>
 </PopConfirm>
 </td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('top')}>
 top
 </Button>
 </PopConfirm>
 </td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('top-end')}>
 topEnd
 </Button>
 </PopConfirm>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('left-start')}>
 leftStart
 </Button>
 </PopConfirm>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('right-start')}>
 rightStart
 </Button>
 </PopConfirm>
 </td>
 </tr>
 <tr>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('left')}>
 left
 </Button>
 </PopConfirm>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('right')}>
 right
 </Button>
 </PopConfirm>
 </td>
 </tr>
 <tr>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('left-end')}>
 leftEnd
 </Button>
 </PopConfirm>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('right-end')}>
 rightEnd
 </Button>
 </PopConfirm>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('bottom-start')}>
 bottomStart
 </Button>
 </PopConfirm>
 </td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('bottom')}>
 bottom
 </Button>
 </PopConfirm>
 </td>
 <td>
 <PopConfirm placement={placement} title={title}>
 <Button style={{ width: 100 }} onClick={handleClick('bottom-end')}>
 bottomEnd
 </Button>
 </PopConfirm>
 </td>
 <td></td>
 </tr>
 </tbody>
 </table>
 </div>
 </>
 )
}

```


### API 方式调用


```tsx
import React from 'react'
import PopConfirm from '@hi-ui/pop-confirm'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input' 
export const WithApi = () => {
 const FormItem = Form.Item
 const key = 'my_key'

 const Content = () => {
 return (
 <div style={{ width: 300, marginTop: 16 }}>
 <Form
 initialValues={{ testInput: 1, testInput2: 'testInput2' }}
 labelWidth={80}
 labelPlacement="top"
 rules={{
 testInput: [
 {
 required: true,
 message: 'testInput1 is required',
 },
 ],
 testInput2: [
 {
 required: true,
 type: 'string',
 message: 'testInput2 is required',
 },
 ],
 }}
 >
 <FormItem field="testInput" valueType="number" label="用户名" required>
 <Input onChange={console.log} />
 </FormItem>
 <FormItem field="testInput2" valueType="string" label="密码" required>
 <Input />
 </FormItem>
 </Form>
 </div>
 )
 }
 return (
 <> 
 <div className="pop-confirm-basic__wrap">
 <h4>此处展示多个操作使用同一个容器，即 API 调用时，将 key 设置为同一个</h4>
 <Button
 onClick={(e) => {
 PopConfirm.open(e.target as HTMLElement, {
 key: key,
 title: <div style={{ whiteSpace: 'normal' }}>标题1</div>,
 icon: null,
 content: <Content />,
 arrow: false,
 crossGap: 0,
 placement: 'bottom-start',
 disabledPortal: true,
 zIndex: 99,
 })
 }}
 >
 trigger 1
 </Button>
 <Button
 onClick={(e) => {
 PopConfirm.open(e.target as HTMLElement, {
 key: key,
 title: <div style={{ whiteSpace: 'normal' }}>标题2</div>,
 icon: null,
 content: <Content />,
 arrow: false,
 crossGap: 0,
 placement: 'bottom-start',
 disabledPortal: true,
 zIndex: 99,
 })
 }}
 >
 trigger 2
 </Button>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性控制各元素样式，继承 Popper 的 root/container/arrow/content


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import PopConfirm, { PopConfirmSemanticName } from '@hi-ui/pop-confirm' 
export const Semantic = () => {
 const [selected, setSelected] = useState<PopConfirmSemanticName>()

 return (
 <> 
 <div className="pop-confirm-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <PopConfirm
 visible
 placement="bottom"
 title="确定要执行此操作吗？"
 content="此操作不可撤销"
 classNames={{
 root: 'my-pop-confirm__root',
 container: 'my-pop-confirm__container',
 arrow: 'my-pop-confirm__arrow',
 content: 'my-pop-confirm__content',
 wrapper: 'my-pop-confirm__wrapper',
 contentSection: 'my-pop-confirm__content-section',
 contentIcon: 'my-pop-confirm__content-icon',
 contentTitle: 'my-pop-confirm__content-title',
 body: 'my-pop-confirm__body',
 footer: 'my-pop-confirm__footer',
 btnCancel: 'my-pop-confirm__btn-cancel',
 btnConfirm: 'my-pop-confirm__btn-confirm',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <Button>Trigger</Button>
 </PopConfirm>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: 'Popper 根' },
 { title: 'container', description: 'Popper 容器' },
 { title: 'arrow', description: 'Popper 箭头' },
 { title: 'content', description: 'Popper 内容区' },
 { title: 'wrapper', description: '确认框根' },
 { title: 'contentSection', description: '标题区' },
 { title: 'contentIcon', description: '图标' },
 { title: 'contentTitle', description: '标题' },
 { title: 'body', description: '正文' },
 { title: 'footer', description: '底部' },
 { title: 'btnCancel', description: '取消按钮' },
 { title: 'btnConfirm', description: '确认按钮' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as PopConfirmSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### PopConfirm Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| innerRef | | Ref<{ open: () => void; close: () => void; }> | - | - |
| title *(required)* | 确认框标题 | ReactNode | - | - |
| content | 确认框内容 | ReactNode | - | - |
| cancelText | 取消按钮文案 | ReactNode | - | - |
| confirmText | 确认按钮文案 | ReactNode | - | - |
| icon | 自定义提示的 icon 图标 | ReactNode | - | - |
| footer | 自定义底部内容 | ReactNode | - | - |
| visible | 是否显示确认框 | boolean | true \| false | - |
| onOpen | 弹窗打开时回调 | (() => void) | - | - |
| onClose | 弹窗关闭时回调 | (() => void) | - | - |
| onCancel | 点击取消按钮时回调 | (() => void) | - | - |
| onConfirm | 点击确认按钮时回调 | (() => void) | - | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| attachEl | 吸附的元素 | HTMLElement | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "auto" \| "auto-start" \| "auto-end" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | - |
| container | 指定 portal 的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| arrow | 是否展示箭头 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| onExited | 结束动画隐藏时回调 | (() => void) | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| classNames | | PopConfirmSemanticClassNames | - | - |
| styles | | PopConfirmSemanticStyles | - | - |

