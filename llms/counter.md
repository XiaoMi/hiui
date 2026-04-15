# Counter 数字加减器

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const Basic = () => {
 return (
 <> 
 <div className="counter-basic__wrap">
 <Counter defaultValue={0} onChange={(v) => console.log('onChange', v)} />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性两种


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const Appearance = () => {
 return (
 <> 
 <div>
 <h2>Line 线性</h2>
 <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
 <Counter appearance={'line'} />
 <Counter appearance={'line'} max={2} min={0} defaultValue={5} />
 </div>

 <h2>Filled 面性</h2>
 <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
 <Counter appearance={'filled'} />
 <Counter appearance={'filled'} max={2} min={0} defaultValue={5} />
 </div>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const Size = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: 160 }}>
 <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
 <Counter size={'sm'} />
 <Counter size="md" />
 <Counter size={'lg'} />
 </div>

 <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
 <Counter size={'sm'} appearance={'filled'} />
 <Counter size="md" appearance={'filled'} />
 <Counter size={'lg'} appearance={'filled'} />
 </div>
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Counter from '@hi-ui/counter'
import Button from '@hi-ui/button' 
export const Controlled = () => {
 const [current, setCurrent] = React.useState<number | null>(1)
 return (
 <> 
 <div className="counter-controlled__wrap">
 <Counter
 value={current}
 min={1}
 onChange={(v) => {
 console.log('onChange', v)
 setCurrent(v)
 }}
 />

 <br />
 <br />
 <Button onClick={() => setCurrent(5)}>更新为 5</Button>
 </div>
 </>
 )
}

```


### 自动聚焦


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const AutoFocus = () => {
 return (
 <> 
 <div className="counter-auto-focus__wrap">
 <Counter autoFocus defaultValue={1} min={1} onChange={(v) => console.log('onChange', v)} />
 </div>
 </>
 )
}

```


### 自定义步长


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const Step = () => {
 return (
 <> 
 <div className="counter-step__wrap">
 <Counter step={0.1} defaultValue={0} min={1} onChange={(v) => console.log('onChange', v)} />
 </div>
 </>
 )
}

```


### 滚轮滑动


```tsx
import React from 'react'
import Counter from '@hi-ui/counter' 
export const Wheel = () => {
 return (
 <> 
 <div className="counter-wheel__wrap">
 <Counter
 step={10}
 changeOnWheel
 defaultValue={0}
 min={1}
 onChange={(v) => console.log('onChange', v)}
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
import Counter from '@hi-ui/counter' 
export const Semantic = () => {
 const [selected, setSelected] = useState<
 'root' | 'content' | 'minus' | 'inputWrapper' | 'input' | 'plus'
 >()

 return (
 <> 
 <div className="counter-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Counter
 defaultValue={0}
 classNames={{
 root: 'my-counter__root',
 content: 'my-counter__content',
 minus: 'my-counter__minus',
 inputWrapper: 'my-counter__input-wrapper',
 input: 'my-counter__input',
 plus: 'my-counter__plus',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 />
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
 title: 'content',
 description: '内容容器',
 },
 {
 title: 'minus',
 description: '减号按钮',
 },
 {
 title: 'inputWrapper',
 description: '输入框包装器',
 },
 {
 title: 'input',
 description: '输入框',
 },
 {
 title: 'plus',
 description: '加号按钮',
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


## Props

### Counter Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ---------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- | ------ |
| autoFocus | 开启自动聚焦 | boolean | true \| false | - |
| value | 设置当前值 | number \| null | null \| number | - |
| defaultValue | 设置默认值 | number \| null | null \| number | - |
| step | 每次改变值的大小 | number | - | - |
| min | 最小值 | number | - | - |
| max | 最大值 | number | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| onChange | 值改变时的回调 | ((value: number \| null) => void) | (value: number \| null) => void | - |
| appearance | 设置展现形式 | "line" \| "filled" | "line" \| "filled" | - |
| size | 设置计数器尺寸 | CounterSizeEnum | Omit\<HiBaseSizeEnum, "xs"> | - |
| changeOnWheel | 开启滑轮改值 | boolean | true \| false | - |
| formatter | 指定输入框展示值的格式 | ((value: string \| number) => string \| number) | (value: string \| number) => string \| number | - |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | ((value: string \| number) => number) | (value: string \| number) => number | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | CounterSemanticClassNames | - | - |
| styles | | CounterSemanticStyles | - | - |

