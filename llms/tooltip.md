# Tooltip 文字提示

常用的文字提示组件。

## 使用示例

### 基础用法

用于解释、描述、引导


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="Tooltip-basic__wrap">
 <Tooltip title="Tooltip Title" trigger="hover" placement="top">
 <Button>trigger</Button>
 </Tooltip>
 </div>
 </>
 )
}

```


### 自定义触发器

请确保子元素能接受对应的 onMouseEnter、onMouseLeave、onFocus、onClick 事件


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button' 
export const Trigger = () => {
 return (
 <> 
 <div className="Tooltip-trigger__wrap">
 <Tooltip title="Tooltip Title">
 <Button>default</Button>
 </Tooltip>
 <br />
 <br />
 <Tooltip title="Tooltip Title" trigger="click">
 <Button>click</Button>
 </Tooltip>
 <br />
 <br />
 <Tooltip title="Tooltip Title" trigger="contextmenu">
 <Button>contextmenu</Button>
 </Tooltip>
 <br />
 <br />
 <Tooltip title="Tooltip Title" trigger="focus">
 <Button>focus</Button>
 </Tooltip>
 </div>
 </>
 )
}

```


### 不同方位


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button' 
export const Placement = () => {
 return (
 <> 
 <div className="popper-placement__wrap">
 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="top-start"
 >
 <Button style={{ width: 100 }}>top-start</Button>
 </Tooltip>
 </td>
 <td>
 <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="top">
 <Button style={{ width: 100 }}>top</Button>
 </Tooltip>
 </td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="top-end"
 >
 <Button style={{ width: 100 }}>top-end</Button>
 </Tooltip>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="left-start"
 >
 <Button style={{ width: 100 }}>left-start</Button>
 </Tooltip>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="right-start"
 >
 <Button style={{ width: 100 }}>right-start</Button>
 </Tooltip>
 </td>
 </tr>
 <tr>
 <td>
 <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="left">
 <Button style={{ width: 100 }}>left</Button>
 </Tooltip>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Tooltip title="我是内容我是内容我是内容我是内容" trigger="hover" placement="right">
 <Button style={{ width: 100 }}>right</Button>
 </Tooltip>
 </td>
 </tr>
 <tr>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="left-end"
 >
 <Button style={{ width: 100 }}>left-end</Button>
 </Tooltip>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="right-end"
 >
 <Button style={{ width: 100 }}>right-end</Button>
 </Tooltip>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="bottom-start"
 >
 <Button style={{ width: 100 }}>bottom-start</Button>
 </Tooltip>
 </td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="bottom"
 >
 <Button style={{ width: 100 }}>bottom</Button>
 </Tooltip>
 </td>
 <td>
 <Tooltip
 title="我是内容我是内容我是内容我是内容"
 trigger="hover"
 placement="bottom-end"
 >
 <Button style={{ width: 100 }}>bottom-end</Button>
 </Tooltip>
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


### 文本换行


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button' 
export const BreakWord = () => {
 return (
 <> 
 <div className="Tooltip-break-word__wrap">
 <Tooltip
 title={
 <div style={{ width: 400 }}>
 这是两行提示文字这是两行提示文字这是两行提示文字这是两行提示文字这是两行提示文字这是两行提示文字
 </div>
 }
 trigger="click"
 >
 <Button>trigger</Button>
 </Tooltip>
 </div>
 </>
 )
}

```


### API 调用


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Tooltip from '@hi-ui/tooltip' 
export const WithAPI = () => {
 const [showTooltip, setShowTooltip] = React.useState(false)
 const triggerElementRef = React.useRef<HTMLSpanElement | null>(null)

 const toggleTooltip = () => {
 if (showTooltip) {
 Tooltip.close('123')
 setShowTooltip(false)
 } else {
 Tooltip.open(triggerElementRef.current, {
 key: '123',
 title: 'Click again to hide me.',
 placement: 'right',
 })
 setShowTooltip(true)
 }
 }

 return (
 <> 
 <div className="modal-with-api__wrap">
 <Button type="primary" onClick={toggleTooltip}>
 {showTooltip ? 'Hide' : 'Show'} tooltip
 </Button>
 <br />
 <span ref={triggerElementRef} style={{ marginTop: '10px', display: 'inline-block' }}>
 <Button disabled>Show tooltip on me</Button>
 </span>
 </div>
 </>
 )
}

```


### 设置间隙偏移量

设置基于依附元素的间隙偏移量


```tsx
import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button' 
export const GutterGap = () => {
 return (
 <> 
 <div className="Tooltip-basic__wrap">
 <Tooltip title="Tooltip Title" gutterGap={6} trigger="hover">
 <Button>trigger</Button>
 </Tooltip>
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
import Button from '@hi-ui/button'
import Tooltip, { TooltipSemanticName } from '@hi-ui/tooltip' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TooltipSemanticName>()

 return (
 <> 
 <div className="tooltip-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Tooltip
 visible
 placement="bottom"
 title="Tooltip 提示内容"
 classNames={{
 root: 'my-tooltip__root',
 popper: 'my-tooltip__popper',
 arrow: 'my-tooltip__arrow',
 content: 'my-tooltip__content',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <Button>Tooltip</Button>
 </Tooltip>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: 'Tooltip 根元素' },
 { title: 'popper', description: 'Popper 包裹层' },
 { title: 'arrow', description: '箭头' },
 { title: 'content', description: '内容区' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TooltipSemanticName)}
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

### Tooltip Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| title *(required)* | 提醒内容&#xA;TODO: 使用 content 统一字段 | ReactNode | - | - |
| arrow | 是否显示箭头 | boolean | true \| false | - |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 打开时回调 | (() => void) | - | - |
| onClose | 关闭时回调 | (() => void) | - | - |
| trigger | 气泡卡片触发方式 | TooltipTriggerActionEnum \| TooltipTriggerActionEnum\[] | "click" \| "contextmenu" \| "hover" \| "focus" \| TooltipTriggerActionEnum\[] | - |
| disabled | 开启禁用 | boolean | true \| false | - |
| mouseEnterDelay | 鼠标移入展示延时，单位：毫秒 | number | - | - |
| mouseLeaveDelay | 鼠标移出后隐藏延时，单位：毫秒 | number | - | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "auto" \| "auto-start" \| "auto-end" \| "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| classNames | | TooltipSemanticClassNames | - | - |
| styles | | TooltipSemanticStyles | - | - |


## Methods

### Tooltip.open(target, { title, placement, key })

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ----------------------------------- | ----------- | ------ | ------ |
| target | 要显示 Tooltip 的元素 | HTMLElement | - | - |
| title | 提示文字内容 | string | - | - |
| key | 标识 Tooltip 的唯一 key，仅用于关闭 | string | - | - |

### Tooltip.close(key)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ------------------------------------ | ------ | ------ | ------ |
| key | open 方法返回的 Tooltip 实例唯一标识 | string | - | - |
