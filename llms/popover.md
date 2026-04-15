# Popover 气泡卡片

以气泡的样式，在响应事件的时候，以浮层的形式弹出。

## 使用示例

### 基础用法

用于信息描述、辅助信息等


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const title = <span>文字提示</span>
 const content = (
 <div>
 <div>此处展示 Popover 具体内容</div>
 <div>具体内容可以自行渲染</div>
 </div>
 )

 return (
 <> 
 <div className="popover-basic__wrap">
 <Popover
 title={title}
 content={content}
 trigger="click"
 onExited={() => console.log('exited')}
 >
 <Button>trigger</Button>
 </Popover>
 </div>
 </>
 )
}

```


### 不带箭头


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button' 
export const Arrow = () => {
 return (
 <> 
 <div className="popper-arrow__wrap">
 <Popover arrow={false} gutterGap={4} content="Popover 文字内容">
 <Button>trigger</Button>
 </Popover>
 </div>
 </>
 )
}

```


### 自定义触发器

请确保子元素能接受对应的 onMouseEnter、onMouseLeave、onFocus、onClick 事件


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button' 
export const Trigger = () => {
 const title = <span>文字提示</span>
 const content = (
 <div>
 <div>此处展示 Popover 具体内容</div>
 <div>具体内容可以自行渲染</div>
 </div>
 )

 return (
 <> 
 <div className="Popover-trigger__wrap">
 <Popover title={title} content={content}>
 <Button>default click</Button>
 </Popover>
 <br />
 <br />
 <Popover title={title} content={content} trigger="hover">
 <Button>hover</Button>
 </Popover>
 <br />
 <br />
 <Popover title={title} content={content} trigger="contextmenu">
 <Button>contextmenu</Button>
 </Popover>
 </div>
 </>
 )
}

```


### 不同方位


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button'
import { PopperJS } from '@hi-ui/popper' 
export const Placement = () => {
 const [placement, setPlacement] = React.useState<undefined | PopperJS.Placement>()

 const handleClick = (newPlacement) => () => {
 setPlacement(newPlacement)
 }

 const title = <span>文字提示</span>
 const content = (
 <div>
 <div>当前展示方位：{placement}</div>
 </div>
 )

 return (
 <> 
 <div className="popper-placement__wrap">
 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('top-start')}>
 topStart
 </Button>
 </Popover>
 </td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('top')}>
 top
 </Button>
 </Popover>
 </td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('top-end')}>
 topEnd
 </Button>
 </Popover>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('left-start')}>
 leftStart
 </Button>
 </Popover>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('right-start')}>
 rightStart
 </Button>
 </Popover>
 </td>
 </tr>
 <tr>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('left')}>
 left
 </Button>
 </Popover>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('right')}>
 right
 </Button>
 </Popover>
 </td>
 </tr>
 <tr>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('left-end')}>
 leftEnd
 </Button>
 </Popover>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('right-end')}>
 rightEnd
 </Button>
 </Popover>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('bottom-start')}>
 bottomStart
 </Button>
 </Popover>
 </td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('bottom')}>
 bottom
 </Button>
 </Popover>
 </td>
 <td>
 <Popover placement={placement} title={title} content={content} trigger="click">
 <Button style={{ width: 100 }} onClick={handleClick('bottom-end')}>
 bottomEnd
 </Button>
 </Popover>
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


### 受控显隐

如何自定义控制创建可悬停和单击的弹出窗口


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button' 
export const Controlled = () => {
 const [clickVisible, setClickVisible] = React.useState(false)
 const [hoverVisible, setHoverVisible] = React.useState(false)

 const contentClick = (
 <div>
 <div>此处展示 Popover click 触发后的内容</div>
 <div
 style={{
 color: '#4285f4',
 fontSize: '14px',
 cursor: 'pointer',
 marginTop: '10px',
 }}
 onClick={() => {
 setClickVisible(false)
 }}
 >
 点击关闭
 </div>
 </div>
 )

 return (
 <> 
 <div className="popover-controlled__wrap">
 <Popover
 title={<span>文字提示</span>}
 content={
 <div>
 <div>此处展示 Popover hover 触发后的内容</div>
 </div>
 }
 visible={hoverVisible}
 >
 <span>
 <Popover visible={clickVisible} title={<span>文字提示</span>} content={contentClick}>
 <Button
 onMouseEnter={() => {
 setHoverVisible(true)
 setClickVisible(false)
 }}
 onMouseLeave={() => {
 setHoverVisible(false)
 }}
 onClick={() => {
 setHoverVisible(false)
 setClickVisible((prev) => !prev)
 }}
 >
 Hover and click / 悬停并单击
 </Button>
 </Popover>
 </span>
 </Popover>
 </div>
 </>
 )
}

```


### 设置间隙偏移量

设置基于依附元素的间隙偏移量


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button' 
export const GutterGap = () => {
 const title = <span>文字提示</span>
 const content = (
 <div>
 <div>此处展示 Popover 具体内容</div>
 <div>具体内容可以自行渲染</div>
 </div>
 )

 return (
 <> 
 <div className="popover-basic__wrap">
 <Popover title={title} content={content} gutterGap={12} trigger="click">
 <Button>trigger</Button>
 </Popover>
 </div>
 </>
 )
}

```


### 自定义内容


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button' 
export const Content = () => {
 const FormItem = Form.Item

 const [visible, setVisible] = React.useState<boolean>(false)
 const [loading, setLoading] = React.useState<boolean>(false)
 const popoverVisibleRef = React.useRef<boolean>(false)

 const title = (
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 height: 20,
 }}
 >
 <span>文字标题</span>
 </div>
 )

 const content = (
 <div style={{ width: 344 }}>
 <div style={{}}>
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
 <div style={{ textAlign: 'right' }}>
 <Button
 appearance="line"
 onClick={() => {
 setVisible(false)
 popoverVisibleRef.current = false
 }}
 >
 取消
 </Button>
 <Button
 type="primary"
 loading={loading}
 onClick={() => {
 setLoading(true)
 setTimeout(() => {
 setLoading(false)
 setVisible(false)
 popoverVisibleRef.current = false
 }, 1000)
 }}
 >
 保存
 </Button>
 </div>
 </div>
 )

 return (
 <> 
 <div className="popover-basic__wrap">
 <Popover
 title={title}
 content={content}
 trigger="click"
 visible={visible}
 arrow={false}
 crossGap={0}
 placement={'bottom-start'}
 showTitleDivider
 disabledPortal
 >
 <Button
 onClick={() => {
 if (!popoverVisibleRef.current) {
 setVisible(true)
 popoverVisibleRef.current = true
 } else {
 setVisible(false)
 popoverVisibleRef.current = false
 }
 }}
 >
 trigger
 </Button>
 </Popover>
 </div>
 </>
 )
}

```


### API 方式调用


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Button from '@hi-ui/button'
import Form from '@hi-ui/form'
import Input from '@hi-ui/input'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button' 
export const WithApi = () => {
 const FormItem = Form.Item
 const key = 'my_key'

 const Title = ({ title }: { title: string }) => {
 return (
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 height: 20,
 }}
 >
 <span>{title}</span>
 </div>
 )
 }

 const Content = () => {
 const [loading, setLoading] = React.useState<boolean>(false)

 return (
 <div style={{ width: 344 }}>
 <div style={{}}>
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
 <div style={{ textAlign: 'right' }}>
 <Button style={{ flex: 1 }} appearance="line" onClick={() => Popover.close(key)}>
 取消
 </Button>
 <Button
 style={{ flex: 1 }}
 type="primary"
 loading={loading}
 onClick={() => {
 setLoading(true)
 setTimeout(() => {
 setLoading(false)
 Popover.close(key)
 }, 1000)
 }}
 >
 保存
 </Button>
 </div>
 </div>
 )
 }

 return (
 <> 
 <div className="popover-basic__wrap">
 <h4>此处展示多个操作使用同一个容器，即 API 调用时，将 key 设置为同一个</h4>
 <Button
 onClick={(e) => {
 Popover.open(e.target as HTMLElement, {
 key: key,
 title: <Title title="文字标题" />,
 content: <Content />,
 arrow: false,
 crossGap: 0,
 placement: 'bottom-start',
 showTitleDivider: true,
 disabledPortal: true,
 zIndex: 99,
 })
 }}
 >
 trigger 1
 </Button>
 <Button
 onClick={(e) => {
 Popover.open(e.target as HTMLElement, {
 key: key,
 title: <Title title="文字标题 2" />,
 content: <Content />,
 arrow: false,
 crossGap: 0,
 placement: 'bottom-start',
 showTitleDivider: true,
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

通过 classNames 和 styles 控制各元素样式，继承 Popper 的 root/container/arrow/content


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Popover, { PopoverSemanticName } from '@hi-ui/popover' 
export const Semantic = () => {
 const [selected, setSelected] = useState<PopoverSemanticName>()
 const title = <span>文字提示</span>
 const content = (
 <div>
 <div>此处展示 Popover 具体内容</div>
 <div>具体内容可以自行渲染</div>
 </div>
 )

 return (
 <> 
 <div className="popover-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Popover
 title={title}
 content={content}
 visible
 placement="bottom"
 trigger="click"
 classNames={{
 root: 'my-popover__root',
 container: 'my-popover__container',
 arrow: 'my-popover__arrow',
 content: 'my-popover__content',
 wrapper: 'my-popover__wrapper',
 title: 'my-popover__title',
 body: 'my-popover__body',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <Button>Trigger</Button>
 </Popover>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: 'Popper 根' },
 { title: 'container', description: 'Popper 容器' },
 { title: 'arrow', description: 'Popper 箭头' },
 { title: 'content', description: 'Popper 内容区' },
 { title: 'wrapper', description: '气泡根' },
 { title: 'title', description: '标题' },
 { title: 'body', description: '正文' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as PopoverSemanticName)}
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

### Popover Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| innerRef | | Ref\<PopoverHelper> | - | - |
| title | 气泡卡片标题 | ReactNode | - | - |
| content *(required)* | 气泡卡片内容 | ReactNode | - | - |
| shouldWrapChildren | 使用标签强制包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| autoWrapChildren | 使用标签自动包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| wrapTagName | 指定包裹 children 的标签 | ElementType\<any> | - | - |
| attachEl | 吸附的元素 | HTMLElement | - | - |
| showTitleDivider | 显示标题分割线 | boolean | true \| false | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 打开时回调 | (() => void) | - | - |
| onClose | 关闭时回调 | (() => void) | - | - |
| trigger | 气泡卡片触发方式 | PopoverTriggerActionEnum \| PopoverTriggerActionEnum\[] | "click" \| "contextmenu" \| "hover" \| "focus" \| PopoverTriggerActionEnum\[] | - |
| mouseEnterDelay | 鼠标移入展示延时，单位：毫秒 | number | - | - |
| mouseLeaveDelay | 鼠标移出后隐藏延时，单位：毫秒 | number | - | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| popperClassName | 自定义 Popper 的 className | string | - | - |
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
| classNames | | PopoverSemanticClassNames | - | - |
| styles | | PopoverSemanticStyles | - | - |


### PopoverHelper
| 名称 | 说明 | 类型 |
| ------------- | ------------------- | ------------- |
| open | 打开弹窗 | () => void |
| close | 关闭弹窗 | () => void |
| update | 刷新弹窗，用于解决某些特殊情况下位置显示异常问题 | () => void |
