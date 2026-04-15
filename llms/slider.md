# Slider 滑块

通过简单拖拽的交互形式实现数值的设置。

## 使用示例

### 基础用法

滑动输入连续或离散数据的单点值或范围值


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const Basic = () => {
 return (
 <> 
 <div className="slider-basic__wrap">
 <Slider
 style={{ width: 300 }}
 onChange={(value) => {
 console.log(value)
 }}
 ></Slider>
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Slider from '@hi-ui/slider'
import { Counter } from '@hi-ui/counter' 
export const Controlled = () => {
 const [value, setValue] = React.useState(0)
 return (
 <> 
 <div className="slider-controlled__wrap">
 <Slider value={value} onChange={(v) => setValue(v as number)} style={{ width: 300 }} />
 <Counter
 style={{ marginTop: 16 }}
 value={value as number}
 onChange={(v) => setValue(v as number)}
 step={10}
 min={0}
 max={100}
 />
 </div>
 </>
 )
}

```


### 方向反转


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const Reversed = () => {
 return (
 <> 
 <div className="slider-reversed__wrap">
 <Slider
 reversed
 style={{ width: 300 }}
 onChange={(value) => {
 console.log(value)
 }}
 ></Slider>
 </div>
 </>
 )
}

```


### 垂直用法


```tsx
import React from 'react'
import Slider from '@hi-ui/slider'
import { Counter } from '@hi-ui/counter' 
export const Vertical = () => {
 const [value, setValue] = React.useState(0)
 return (
 <> 
 <div className="slider-Vertical__wrap">
 <Slider
 vertical
 value={value}
 onChange={(v) => setValue(v as number)}
 style={{ height: 300 }}
 />
 <br />
 <Counter
 value={value}
 onChange={(v) => setValue(v as number)}
 step={10}
 min={0}
 max={100}
 />
 </div>
 </>
 )
}

```


### 设置范围


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const SetRange = () => {
 const [value, setValue] = React.useState(0)
 return (
 <> 
 <div className="slider-set-range__wrap">
 <Slider
 style={{ width: 300 }}
 defaultValue={value}
 min={1}
 max={90}
 onChange={(value) => {
 console.log(value)
 setValue(value as number)
 }}
 showRangeLabel
 />
 </div>
 </>
 )
}

```


### 范围选择


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const Range = () => {
 return (
 <> 
 <div className="slider-range__wrap">
 <Slider
 style={{ width: 300 }}
 range
 defaultValue={[20, 80]}
 onChange={(value) => {
 console.log(value)
 }}
 ></Slider>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const Disabled = () => {
 return (
 <> 
 <div className="slider-disabled__wrap">
 <Slider
 style={{ width: 300 }}
 onChange={(value) => {
 console.log(value)
 }}
 defaultValue={80}
 disabled
 ></Slider>
 </div>
 </>
 )
}

```


### 自定义提示

可自定义提示内容的格式


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const TipFormatter = () => {
 return (
 <> 
 <div className="slider-tip-formatter__wrap">
 <Slider
 style={{ width: 300 }}
 onChange={(value) => {
 console.log(value)
 }}
 tipFormatter={(value) => {
 console.log(value)
 return value + '英寸'
 }}
 ></Slider>
 </div>
 </>
 )
}

```


### 自定义颜色

自定义滑块条的颜色


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const CustomColor = () => {
 const colorMap = [
 {
 color: '#237ffa',
 type: 'primary',
 },
 {
 color: '#ff5959',
 type: 'danger',
 },
 {
 color: '#14ca64',
 type: 'success',
 },
 {
 color: '#fab007',
 type: 'warning',
 },
 ]

 const [type, setType] = React.useState('primary')
 return (
 <> 
 <div className="slider-custom-color__wrap">
 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
 {colorMap.map((item) => (
 <span
 style={{
 width: 25,
 height: 22,
 marginRight: 12,
 background: item.color,
 display: 'inline-block',
 cursor: 'pointer',
 boxShadow: type === item.type ? '0px 2px 4px 0px rgba(0,0,0,0.5)' : 'none',
 }}
 onClick={() => {
 setType(item.type)
 }}
 key={item.color}
 ></span>
 ))}
 </div>
 <Slider color={colorMap.find((item) => item.type === type)?.color} />
 </div>
 </>
 )
}

```


### 自定义步长

按定义步长输入离散型数值，可加入特殊位置


```tsx
import React from 'react'
import Slider from '@hi-ui/slider' 
export const Mark = () => {
 const [marks] = React.useState({
 0: '0°C',
 27: '27°C',
 45: '45°C',
 100: '100°C',
 })
 return (
 <> 
 <div className="slider-mark__wrap">
 <Slider
 style={{ width: 300 }}
 marks={marks}
 step={9}
 onChange={(value) => {
 console.log(value)
 }}
 />
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
import Slider, { SliderSemanticName } from '@hi-ui/slider' 
export const Semantic = () => {
 const [selected, setSelected] = useState<SliderSemanticName>()

 return (
 <> 
 <div className="slider-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Slider
 defaultValue={50}
 classNames={{
 root: 'my-slider__root',
 rail: 'my-slider__rail',
 track: 'my-slider__track',
 handle: 'my-slider__handle',
 marks: 'my-slider__marks',
 mark: 'my-slider__mark',
 labels: 'my-slider__labels',
 label: 'my-slider__label',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 marks={{
 0: '0°C',
 27: '27°C',
 45: '45°C',
 100: '100°C',
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'rail', description: '轨道' },
 { title: 'track', description: '进度条' },
 { title: 'handle', description: '滑块' },
 { title: 'marks', description: '刻度容器' },
 { title: 'mark', description: '刻度点' },
 { title: 'labels', description: '标签容器' },
 { title: 'label', description: '标签' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as SliderSemanticName)}
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

### Slider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- | ------ |
| tipFormatter | 自定义 Tooltip 中显示文案 | ((value: number) => ReactNode) | - | - |
| showRangeLabel | 是否显示范围label | boolean | true \| false | false |
| marks | 刻度标记，key 的类型必须为 number，且取值在闭区间 \[min, max] 内 | Record\<number, any> | - | - |
| color | 自定义颜色 | string | - | - |
| classNames | | SliderSemanticClassNames | - | - |
| styles | | SliderSemanticStyles | - | - |
| defaultValue | 设置初始默认值 | number \| \[number, number] | number \| \[number, number] | - |
| value | 设置当前值（受控） | number \| \[number, number] | number \| \[number, number] | - |
| min | 最小值 | number | - | - |
| max | 最大值 | number | - | - |
| disabled | 开启禁用状态 | boolean | true \| false | - |
| step | 步长 | number | - | - |
| vertical | 值为 true 时，Slider 为垂直方向 | boolean | true \| false | - |
| reversed | 开启反转 | boolean | true \| false | - |
| range | 是否为范围选择 | boolean | true \| false | - |
| onChange | 当 Slider 的值发生改变时触发，value 为变化后的值 | ((value: number \| \[number, number]) => void) | (value: number \| \[number, number]) => void | - |

