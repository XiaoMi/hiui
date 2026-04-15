# NumberInput 数字输入框

专门用于接收用户数字输入的输入框。

## 使用示例

### 基础用法

用于输入数字的输入框


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Basic = () => {
 return (
 <> 
 <div className="NumberInput-basic__wrap">
 <NumberInput
 autoFocus
 defaultValue={5}
 min={1}
 placeholder="请输入数字"
 onChange={(v) => console.log('onChange', v)}
 />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性两种


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Appearance = () => {
 return (
 <> 
 <div>
 <h2>outline</h2>
 <NumberInput appearance={'line'} />
 <br />
 <br />
 <NumberInput appearance={'line'} max={2} min={0} defaultValue={5} />
 </div>
 <div>
 <h2>filled</h2>
 <NumberInput appearance={'filled'} />
 <br />
 <br />
 <NumberInput appearance={'filled'} max={2} min={0} defaultValue={5} />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Size = () => {
 return (
 <> 
 <div>
 <h2>outline</h2>
 <br />
 <br />
 <NumberInput size={'sm'} />
 <br />
 <br />
 <NumberInput size="md" />
 <br />
 <br />
 <NumberInput size={'lg'} />
 </div>
 <div>
 <h2>filled</h2>
 <br />
 <br />
 <NumberInput size={'sm'} appearance={'filled'} />
 <br />
 <br />
 <NumberInput size="md" appearance={'filled'} />
 <br />
 <br />
 <NumberInput size={'lg'} appearance={'filled'} />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input'
import Button from '@hi-ui/button' 
export const Controlled = () => {
 const [current, setCurrent] = React.useState<number | null>(1)
 return (
 <> 
 <div className="NumberInput-controlled__wrap">
 <NumberInput
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


### 自定义步长


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Step = () => {
 return (
 <> 
 <div className="NumberInput-step__wrap">
 <NumberInput
 step={0.1}
 defaultValue={0}
 min={1}
 onChange={(v) => console.log('onChange', v)}
 />
 </div>
 </>
 )
}

```


### 滚轮滑动


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Wheel = () => {
 return (
 <> 
 <div className="NumberInput-wheel__wrap">
 <NumberInput
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


### 无效态

输入无效或异常时可激活此态


```tsx
import React from 'react'
import { NumberInput } from '@hi-ui/number-input' 
export const Invalid = () => {
 return (
 <> 
 <div className="NumberInput-invalid__wrap">
 <NumberInput invalid appearance={'line'} defaultValue={5} />
 <br />
 <br />
 <NumberInput invalid appearance={'filled'} defaultValue={5} />
 </div>
 </>
 )
}

```


### 格式化展示

自定义格式化展示


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Formatter = () => {
 const currency = {
 format(value: string) {
 return value.replace(/\d+/, (ret) => {
 return ret.replace(/(\d)(?=(\d{3})+$)/g, ($1) => $1 + ',')
 })
 },
 pure(valueString: string) {
 return valueString.replace(/[^\d|.]/g, '')
 },
 }

 function formatNumberPrecision(
 num: number,
 precision = 2,
 precisionMode: 'cut' | 'round' = 'round'
 ) {
 if (isNaN(num) || isNaN(precision)) {
 return num
 }

 let result: string | number = num

 if (precisionMode === 'round') {
 result = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
 if (
 String(result).split('.').length === 1 ||
 String(result).split('.')[1].length < precision
 ) {
 return parseFloat(String(result)).toFixed(precision)
 }
 }

 if (precisionMode === 'cut') {
 if (String(result).split('.')[1]?.length > precision) {
 result = String(result).substring(0, String(result).indexOf('.') + precision + 1)
 }
 return parseFloat(String(result)).toFixed(precision)
 }

 return result
 }

 const [value, setValue] = React.useState<number | null>(1234)

 return (
 <> 
 <div className="NumberInput-formatter__wrap">
 <h2>千分位展示</h2>
 <NumberInput
 defaultValue={1234}
 min={1}
 formatter={(value) => currency.format(value + '')}
 parser={(value) => Number(currency.pure(value + ''))}
 onChange={(v) => console.log('onChange', v)}
 />
 <h2>千分位展示 受控</h2>
 <NumberInput
 value={value}
 min={0}
 formatter={(value) => currency.format(value + '')}
 parser={(value) => Number(currency.pure(value + ''))}
 onChange={(v) => {
 console.log('onChange', v)
 setValue(v)
 }}
 />
 <h2>小数点精度展示</h2>
 <NumberInput
 defaultValue={null}
 formatter={(value) => formatNumberPrecision(Number(value), 2, 'cut')}
 onChange={(v) => console.log('onChange', v)}
 />
 <h2>小数点精度展示 受控</h2>
 <NumberInput
 value={value}
 min={0}
 formatter={(value) => formatNumberPrecision(Number(value), 2, 'round')}
 onChange={(v) => {
 console.log('onChange', v)
 setValue(v)
 }}
 />
 </div>
 </>
 )
}

```


### 前内置元素


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input'
import { AppStoreOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 return (
 <> 
 <div className="NumberInput-addon__wrap">
 <NumberInput
 defaultValue={5}
 min={1}
 placeholder="请输入数字"
 onChange={(v) => console.log('onChange', v)}
 prefix={<AppStoreOutlined />}
 suffix={'天'}
 />
 </div>
 </>
 )
}

```


### 语义化样式设置

支持设置 input、prefix、suffix、handler 的样式


```tsx
import React from 'react'
import NumberInput from '@hi-ui/number-input' 
export const Styles = () => {
 return (
 <> 
 <div className="NumberInput-basic__wrap">
 <NumberInput
 styles={{
 input: {
 textAlign: 'center',
 },
 }}
 classNames={{
 input: 'number-input-styles__input',
 }}
 defaultValue={5}
 min={1}
 placeholder="请输入数字"
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
import NumberInput, { NumberInputSemanticName } from '@hi-ui/number-input' 
export const Semantic = () => {
 const [selected, setSelected] = useState<NumberInputSemanticName>()

 return (
 <> 
 <div className="number-input-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <NumberInput
 defaultValue={5}
 min={1}
 prefix="￥"
 suffix="元"
 placeholder="请输入数字"
 classNames={{
 root: 'my-number-input__root',
 prefix: 'my-number-input__prefix',
 input: 'my-number-input__input',
 suffix: 'my-number-input__suffix',
 handler: 'my-number-input__handler',
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
 { title: 'root', description: '根元素' },
 { title: 'prefix', description: '前缀' },
 { title: 'input', description: '输入框' },
 { title: 'suffix', description: '后缀' },
 { title: 'handler', description: '加减按钮区域' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as NumberInputSemanticName)
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

### NumberInput Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ---------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- | ------ |
| prefix | | ReactNode | - | - |
| placeholder | | string | - | - |
| suffix | | ReactNode | - | - |
| defaultValue | 设置默认值 | number \| null | null \| number | - |
| onChange | 值改变时的回调 | ((value: number \| null) => void) | (value: number \| null) => void | - |
| value | 设置当前值 | number \| null | null \| number | - |
| size | 设置计数器尺寸 | CounterSizeEnum | Omit\<HiBaseSizeEnum, "xs"> | - |
| autoFocus | 开启自动聚焦 | boolean | true \| false | - |
| step | 每次改变值的大小 | number | - | - |
| precision | 数值精度，即小数位数；设置后会将值四舍五入到该精度 | number | - | - |
| min | 最小值 | number | - | - |
| max | 最大值 | number | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| appearance | 设置展现形式 | "line" \| "filled" | "line" \| "filled" | - |
| changeOnWheel | 开启滑轮改值 | boolean | true \| false | - |
| formatter | 指定输入框展示值的格式 | ((value: string \| number) => string \| number) | (value: string \| number) => string \| number | - |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | ((value: string \| number) => number) | (value: string \| number) => number | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | NumberInputSemanticClassNames | - | - |
| styles | | NumberInputSemanticStyles | - | - |

