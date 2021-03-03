# Popper

基础弹层组件

## 快速使用

## 依附元素

```js
import Popper from "@hi-ui/hiui/es/popper"
import React, { useState, useRef } from "react"
const demo = () => {
  const PopperAttachEle = useRef()
  const [showPopper, setShowPopper] = useState(false)
  return (
    <div>
      <div ref={PopperAttachEle}>popper-attachEle</div>
      <Popper
        // 弹出层的显示隐藏
        show={showPopper}
        // 依附的元素
        attachEle={PopperAttachEle.current}
        // 点击弹出层以及依附元素以外的区域时会触发该回调
        onClickOutside={() => {
          setShowPopper(false)
        }}
      >
        <div className='popper-content'>Popper Content</div>
      </Popper>
    </div>
  )
}
```

## 无依附元素

```js
import Popper from "@hi-ui/hiui/es/popper"
import React, { useState, useRef } from react
const demo = () => {
  const [showPopper, setShowPopper] = useState(false)
  return (
    <div>
      <Popper
        // 弹出层的显示隐藏
        show={showPopper}
        left={20}
        top={20}
        // 点击弹出层以及依附元素以外的区域时会触发该回调
        onClickOutside={() => {
          setShowPopper(false)
        }}
      >
        <div className="popper-content">Popper Content</div>
      </Popper>
    </div>
  )
}
```

## Props

| 参数      | 说明                                                                                                           | 类型                     | 可选值                                                                                                                                                                                                                                                           | 默认值       |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| show      | 弹出层显示隐藏                                                                                                 | boolean                  | -                                                                                                                                                                                                                                                                | false        |
| attachEle | 依附元素，会自动显示到该元素下方，并跟随自动                                                                   | HTMLElement              | -                                                                                                                                                                                                                                                                | -            |
| container | 弹出层依赖定位的元素，也就是弹出层参考定位的元素                                                               | HTMLElement              | -                                                                                                                                                                                                                                                                | -            |
| width     | 弹层宽度，如果存在**attachEle**参数且宽度未传入的情况下，会根据**attachEle**的宽度进行计算，其他情况请传入宽度 | number \| string \| bool | -                                                                                                                                                                                                                                                                | -            |
| topGap    | 距离依附元素的上偏移量，存在 **attachEle** 属性时有效，                                                        | number                   | 0                                                                                                                                                                                                                                                                | 0            |
| leftGap   | 距离依附元素的左偏移量，存在 **attachEle** 属性时有效，                                                        | number                   | 0                                                                                                                                                                                                                                                                | 0            |
| zIndex    | 堆叠顺序                                                                                                       | number                   | -                                                                                                                                                                                                                                                                | 1060         |
| placement | 位于依附元素的方位                                                                                             | string                   | bottom \| bottom-start \| bottom-end \| top \| top-start \| top-end \| left \| left-start \| left-end \| right \| right-start \| right-end \| top-bottom-start(使用该属性会自动根据依附元素距离可视区域自动翻转) \| top-bottom \| left-right \| left-right-start | bottom-start |

## Events

| 参数                | 说明                                                                  | 类型                  | 可选值 | 默认值              |
| ------------------- | --------------------------------------------------------------------- | --------------------- | ------ | ------------------- |
| onClickOutside      | 点击该元素外的回调方法                                                | function              | -      | -                   |
| setOverlayContainer | 如遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位 (3.0 新增) | function(triggerNode) | -      | () => document.body |
