# Popper 弹出框

弹出框组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const [btnRef, setBtnRef] = React.useState(null)
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="popper-basic__wrap">
 <Button ref={setBtnRef} onClick={() => setVisible(true)}>
 Open
 </Button>
 <Popper
 visible={visible}
 attachEl={btnRef}
 onClose={() => {
 console.log('onClose')
 setVisible(false)
 }}
 >
 The content of the Popper.
 </Popper>
 </div>
 </>
 )
}

```


### 不同方位


```tsx
import React from 'react'
import Popper, { PopperPlacementEnum } from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Placement = () => {
 const [btnEl, setBtnEl] = React.useState(null)
 const [visible, setVisible] = React.useState(false)
 const [placement, setPlacement] = React.useState<undefined | PopperPlacementEnum>()

 const handleClick = (newPlacement) => (event) => {
 setBtnEl(event.currentTarget)
 setPlacement(newPlacement)
 setVisible(true)
 }

 return (
 <> 
 <div className="popper-placement__wrap">
 <Popper
 visible={visible}
 attachEl={btnEl}
 placement={placement}
 onClose={() => setVisible(false)}
 >
 {/* <div style={{ width: 200 }}>HiUI</div> */}
 {/* <div style={{ height: 200 }}>HiUI</div> */}
 {/* <div style={{ width: 200, height: 200 }}>HiUI</div> */}
 </Popper>

 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <Button onClick={handleClick('top-start')}>topStart</Button>
 </td>
 <td>
 <Button onClick={handleClick('top')}>top</Button>
 </td>
 <td>
 <Button onClick={handleClick('top-end')}>topEnd</Button>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left-start')}>leftStart</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right-start')}>rightStart</Button>
 </td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left')}>left</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right')}>right</Button>
 </td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left-end')}>leftEnd</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right-end')}>rightEnd</Button>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <Button onClick={handleClick('bottom-start')}>bottomStart</Button>
 </td>
 <td>
 <Button onClick={handleClick('bottom')}>bottom</Button>
 </td>
 <td>
 <Button onClick={handleClick('bottom-end')}>bottomEnd</Button>
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


### 不带箭头


```tsx
import React from 'react'
import Popper, { PopperJS } from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Arrow = () => {
 const [btnEl, setBtnEl] = React.useState(null)
 const [visible, setVisible] = React.useState(false)
 const [placement, setPlacement] = React.useState<undefined | PopperJS.Placement>()

 const handleClick = (newPlacement) => (event) => {
 setBtnEl(event.currentTarget)
 setPlacement(newPlacement)
 setVisible(true)
 }

 return (
 <> 
 <div className="popper-arrow__wrap">
 <Popper
 visible={visible}
 attachEl={btnEl}
 placement={placement}
 onClose={() => setVisible(false)}
 arrow
 >
 <div style={{ width: 200, height: 80 }}>Here is HiUI Popper.</div>
 </Popper>

 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <Button onClick={handleClick('top-start')}>topStart</Button>
 </td>
 <td>
 <Button onClick={handleClick('top')}>top</Button>
 </td>
 <td>
 <Button onClick={handleClick('top-end')}>topEnd</Button>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left-start')}>leftStart</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right-start')}>rightStart</Button>
 </td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left')}>left</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right')}>right</Button>
 </td>
 </tr>
 <tr>
 <td>
 <Button onClick={handleClick('left-end')}>leftEnd</Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button onClick={handleClick('right-end')}>rightEnd</Button>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <Button onClick={handleClick('bottom-start')}>bottomStart</Button>
 </td>
 <td>
 <Button onClick={handleClick('bottom')}>bottom</Button>
 </td>
 <td>
 <Button onClick={handleClick('bottom-end')}>bottomEnd</Button>
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


### 性能优化


```tsx
import React from 'react'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Lazy = () => {
 const [btnRef, setBtnRef] = React.useState(null)
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="popper-lazy__wrap">
 <Button ref={setBtnRef} onClick={() => setVisible(true)}>
 Open
 </Button>
 <div> 
 <Popper visible={visible} attachEl={btnRef} onClose={() => setVisible(false)}>
 The content of the Popper1.
 </Popper>
 </div>
 <div> 
 <Popper
 visible={visible}
 preload={false}
 unmountOnClose={false}
 placement="top"
 attachEl={btnRef}
 onClose={() => setVisible(false)}
 >
 The content of the Popper2.
 </Popper>
 </div>
 <div> 
 <Popper
 visible={visible}
 preload={true}
 unmountOnClose={false}
 placement="right"
 attachEl={btnRef}
 onClose={() => setVisible(false)}
 >
 The content of the Popper3.
 </Popper>
 </div>
 </div>
 </>
 )
}

```


### 受控显隐


```tsx
import React from 'react'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button'
import { useToggle } from '@hi-ui/hooks' 
export const Toggle = () => {
 const [btnRef, setBtnRef] = React.useState(null)
 const [visible, visibleAction] = useToggle(true)

 return (
 <> 
 <div className="popper-toggle__wrap">
 <Button ref={setBtnRef} onClick={() => visibleAction.not()}>
 Toggle
 </Button>
 <Popper visible={visible} attachEl={btnRef} onClose={() => visibleAction.off()}>
 The content of the Popper.
 </Popper>
 </div>
 </>
 )
}

```


### 跟随当前文档流


```tsx
import React from 'react'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Portal = () => {
 const [btnRef, setBtnRef] = React.useState(null)
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="popper-portal__wrap">
 <Button ref={setBtnRef} onClick={() => setVisible(true)}>
 Open
 </Button>
 <Popper
 visible={visible}
 disabledPortal
 attachEl={btnRef}
 onClose={() => setVisible(false)}
 >
 The content of the Popper.
 </Popper>
 </div>
 </>
 )
}

```


### 指定挂载容器

默认挂载到 body 下


```tsx
import React from 'react'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Container = () => {
 const [btnRef, setBtnRef] = React.useState(null)
 const [visible, setVisible] = React.useState(false)
 const containerRef = React.useRef(null)

 return (
 <div
 style={{
 width: '60vw',
 height: '200px',
 overflow: 'auto',
 border: '1px solid #eee',
 position: 'relative',
 }}
 > 
 <div
 ref={containerRef}
 className="popper-container__wrap"
 style={{ zoom: 2, height: '200vh' }}
 >
 <Button ref={setBtnRef} onClick={() => setVisible(true)}>
 Open
 </Button>
 <Popper
 visible={visible}
 attachEl={btnRef}
 onClose={() => setVisible(false)}
 container={btnRef}
 >
 The content of the Popper.
 </Popper>
 </div>
 </div>
 )
}

```


### usePopper


```tsx
import React from 'react'
import { usePopper } from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const Hook = () => {
 const [btnEl, setBtnEl] = React.useState(null)
 const [visible, setVisible] = React.useState(false)
 const { shouldRenderPopper, getPopperProps } = usePopper({
 attachEl: btnEl,
 visible,
 placement: 'bottom-end',
 onClose: () => setVisible(false),
 unmountOnClose: false,
 // preload: true,
 })

 return (
 <> 
 <div className="popper-hook__wrap">
 <Button ref={setBtnEl} onClick={() => setVisible((prev) => !prev)}>
 Open
 </Button>
 {shouldRenderPopper ? (
 <div {...getPopperProps()}>The content of the Popper.The content of the Popper.</div>
 ) : null}
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
import Popper, { PopperSemanticName } from '@hi-ui/popper' 
export const Semantic = () => {
 const [btnRef, setBtnRef] = useState<HTMLButtonElement | HTMLAnchorElement | null>(null)
 const [visible, setVisible] = useState(false)
 const [selected, setSelected] = useState<PopperSemanticName>()

 return (
 <> 
 <div className="popper-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Button ref={setBtnRef} onClick={() => setVisible(true)}>
 Open Popper
 </Button>
 <Popper
 visible={visible}
 attachEl={btnRef}
 arrow
 onClose={() => setVisible(false)}
 classNames={{
 root: 'my-popper__root',
 container: 'my-popper__container',
 arrow: 'my-popper__arrow',
 content: 'my-popper__content',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 The content of the Popper.
 </Popper>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'container', description: '容器元素' },
 { title: 'arrow', description: '箭头元素' },
 { title: 'content', description: '内容区域' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as PopperSemanticName)
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


## Props

### Popper Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| arrow | 是否展示箭头 | boolean | true \| false | false |
| preload | 开启 popper 预加载渲染，用于性能优化，优先级小于 \`unmountOnClose\` | boolean | true \| false | false |
| unmountOnClose | 开启 popper 关不时销毁，用于性能优化，优先级大于 \`preload\` | boolean | true \| false | true |
| autoFocus | 开启自动聚焦弹出层 | boolean | true \| false | true |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExited | 结束动画隐藏时回调 | (() => void) | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| container | 指定 portal 的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| animationType | 动画类型 | "scale" \| "scaleX" \| "scaleY" | "scale" \| "scaleX" \| "scaleY" | "scale" |
| visible *(required)* | 开启 popper 展示（受控） | boolean | true \| false | - |
| attachEl *(required)* | reference 目标元素，吸附跟随的节点 | Element \| VirtualElement \| null | null \| Element \| VirtualElement | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| preventOverflow | 设置边缘区域可见 | boolean | true \| false | - |
| flip | 自动反转，尽可能保证显示在可视区域 | boolean | true \| false | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| minWidth | 弹出层最小宽度 | ReactText | - | - |
| matchWidthStrictly | 开启宽度匹配严格模式，将不会根据内容自适应撑开 | boolean | true \| false | - |
| eventListeners | 开启重新定位，当 \`scroll\` 和 \`resize\` 触发时 | boolean \| { scroll?: boolean; resize?: boolean \| undefined; } \| undefined | false \| true \| { scroll?: boolean \| undefined; resize?: boolean \| undefined; } | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "auto" \| "auto-start" \| "auto-end" \| "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| arrowPadding | 设置 arrow 的 padding，避免 arrow 处在 popper 边界 | number | - | - |
| strategy | 设置 popper 的 css 定位方式 | "absolute" \| "fixed" | "absolute" \| "fixed" | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| closeOnEsc | 开启按键 Esc 时触发 onClose 回调 | boolean | true \| false | - |
| onClose | 关闭 popper 时回调 | (() => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| classNames | | PopperSemanticClassNames | - | - |
| styles | | PopperSemanticStyles | - | - |


### getEventListenersModifier Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ---- | ------- | ------------- | ------ |
| scroll | | boolean | true \| false | - |
| resize | | boolean | true \| false | - |


### PopperPortal Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| arrow | 是否展示箭头 | boolean | true \| false | - |
| preload | 开启 popper 预加载渲染，用于性能优化，优先级小于 \`unmountOnClose\` | boolean | true \| false | - |
| unmountOnClose | 开启 popper 关不时销毁，用于性能优化，优先级大于 \`preload\` | boolean | true \| false | - |
| autoFocus | 开启自动聚焦弹出层 | boolean | true \| false | - |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExited | 结束动画隐藏时回调 | (() => void) | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| container | 指定 portal 的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| animationType | 动画类型 | "scale" \| "scaleX" \| "scaleY" | "scale" \| "scaleX" \| "scaleY" | - |
| visible *(required)* | 开启 popper 展示（受控） | boolean | true \| false | - |
| attachEl *(required)* | reference 目标元素，吸附跟随的节点 | Element \| VirtualElement \| null | null \| Element \| VirtualElement | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| preventOverflow | 设置边缘区域可见 | boolean | true \| false | - |
| flip | 自动反转，尽可能保证显示在可视区域 | boolean | true \| false | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| minWidth | 弹出层最小宽度 | ReactText | - | - |
| matchWidthStrictly | 开启宽度匹配严格模式，将不会根据内容自适应撑开 | boolean | true \| false | - |
| eventListeners | 开启重新定位，当 \`scroll\` 和 \`resize\` 触发时 | boolean \| { scroll?: boolean; resize?: boolean \| undefined; } \| undefined | false \| true \| { scroll?: boolean \| undefined; resize?: boolean \| undefined; } | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "auto" \| "auto-start" \| "auto-end" \| "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| arrowPadding | 设置 arrow 的 padding，避免 arrow 处在 popper 边界 | number | - | - |
| strategy | 设置 popper 的 css 定位方式 | "absolute" \| "fixed" | "absolute" \| "fixed" | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| closeOnEsc | 开启按键 Esc 时触发 onClose 回调 | boolean | true \| false | - |
| onClose | 关闭 popper 时回调 | (() => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| classNames | | PopperSemanticClassNames | - | - |
| styles | | PopperSemanticStyles | - | - |

