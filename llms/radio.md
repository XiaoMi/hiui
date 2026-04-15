# Radio 单选

单选是用来在一组平铺选项中选择目标选项，每次只选一个。

## 使用示例

### 基础用法

展示所有备选项，数量不宜超出10个


```tsx
import React from 'react'
import { Radio } from '@hi-ui/radio' 
export const Basic = () => {
 return (
 <> 
 <div className="radio-basic__wrap">
 <Radio onChange={console.log}>Radio</Radio>
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Radio from '@hi-ui/radio'
import Button from '@hi-ui/button' 
export const Controlled = () => {
 const [checked, setChecked] = React.useState(false)

 return (
 <> 
 <div className="radio-controlled__wrap">
 <Button onClick={() => setChecked((prev) => !prev)}>Toggle</Button>
 <div style={{ marginTop: 10 }}>
 <Radio
 checked={checked}
 onChange={(evt) => {
 console.log('onChange', evt)
 setChecked(evt.target.checked)
 }}
 >
 Radio
 </Radio>
 </div>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Radio from '@hi-ui/radio' 
export const Disabled = () => {
 return (
 <> 
 <div
 className="radio-disabled__wrap"
 style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
 >
 <Radio disabled checked>
 disabled Checked Radio
 </Radio>
 <Radio disabled>Disabled No-Checked Radio</Radio>
 </div>
 </>
 )
}

```


### 成组


```tsx
import React from 'react'
import Radio from '@hi-ui/radio' 
export const Group = () => {
 const RadioGroup = Radio.Group

 const [data] = React.useState([
 {
 id: 0,
 title: '手机类',
 },
 {
 id: 1,
 title: '电脑类',
 },
 {
 id: 2,
 title: '生活类',
 },
 {
 id: 3,
 title: '其它',
 },
 {
 id: 4,
 title: '禁用未选',
 disabled: true,
 },
 ])

 return (
 <> 
 <div className="radio-group__wrap">
 <RadioGroup
 defaultValue={0}
 data={data}
 onChange={(value) => {
 console.log('onChange', value)
 }}
 />
 </div>
 </>
 )
}

```


### 垂直样式

选项的另一种布局形式，视页面空间选用


```tsx
import React from 'react'
import Radio from '@hi-ui/radio' 
export const Placement = () => {
 const RadioGroup = Radio.Group

 const [data] = React.useState([
 {
 title: '手机',
 id: 'Phone',
 },
 {
 title: '电脑',
 id: 'Computer',
 },
 {
 title: '智能',
 id: 'Intelli',
 },
 {
 title: '出行',
 id: 'Transfer',
 disabled: true,
 },
 ])
 const [selectedId, setSelectedId] = React.useState<React.ReactText>('Phone')

 return (
 <> 
 <div className="checkbox-placement__wrap">
 <RadioGroup
 data={data}
 placement="vertical"
 value={selectedId}
 onChange={(value) => {
 console.log(value)
 setSelectedId(value)
 }}
 />
 </div>
 </>
 )
}

```


### 灵活布局

Radio 与 Grid 组件一起使用，可以实现灵活的布局


```tsx
import React from 'react'
import Radio from '@hi-ui/radio'
import Grid from '@hi-ui/grid' 
export const Children = () => {
 const { Row, Col } = Grid
 const RadioGroup = Radio.Group

 const [selectedId, setSelectedId] = React.useState<React.ReactText>('Phone')

 return (
 <> 
 <div className="radio-children__wrap">
 <RadioGroup
 value={selectedId}
 style={{ width: '100%' }}
 onChange={(value) => {
 console.log(value)
 setSelectedId(value)
 }}
 >
 <Row>
 <Col span={8}>
 <Radio value="Phone">手机</Radio>
 </Col>
 <Col span={8}>
 <Radio value="Computer">电脑</Radio>
 </Col>
 <Col span={8}>
 <Radio value="Intelligent">智能</Radio>
 </Col>
 </Row>
 <Row>
 <Col span={8}>
 <Radio value="Transfer" onChange={console.log}>
 出行
 </Radio>
 </Col>
 <Col span={8}>
 <Radio value="ecological" onChange={console.log}>
 生态
 </Radio>
 </Col>
 </Row>
 </RadioGroup>
 </div>
 </>
 )
}

```


### 按钮组用法

样式突出，突显在页面的重要级别，选项数5个左右为宜


```tsx
import React from 'react'
import Radio from '@hi-ui/radio' 
export const Button = () => {
 const RadioGroup = Radio.Group

 const [data] = React.useState([
 {
 id: 0,
 title: '手机类',
 },
 {
 id: 1,
 title: '电脑类',
 },
 {
 id: 2,
 title: '生活类',
 },
 {
 id: 3,
 title: '其它',
 },
 ])

 return (
 <> 
 <div className="radio-button__wrap">
 <div>
 <RadioGroup
 defaultValue={0}
 type={'button'}
 data={data}
 onChange={(value) => {
 console.log('onChange', value)
 }}
 />
 </div>
 <h2>vertical</h2>
 <div>
 <RadioGroup
 defaultValue={0}
 placement={'vertical'}
 type={'button'}
 data={data}
 onChange={(value) => {
 console.log('onChange', value)
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 宽度自适应

仅支持横向按钮组


```tsx
import React from 'react'
import Radio from '@hi-ui/radio' 
export const AutoWidth = () => {
 const RadioGroup = Radio.Group

 const [data] = React.useState([
 {
 id: 0,
 title: '手机类',
 },
 {
 id: 1,
 title: '电脑类',
 },
 {
 id: 2,
 title: '生活类',
 },
 {
 id: 3,
 title: '其它',
 },
 ])

 return (
 <> 
 <div className="radio-auto-width__wrap">
 <div>
 <RadioGroup
 defaultValue={0}
 type={'button'}
 data={data}
 autoWidth={true}
 onChange={(value) => {
 console.log('onChange', value)
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 Radio 进行更细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Radio, { RadioSemanticName } from '@hi-ui/radio' 
export const Semantic = () => {
 const [selected, setSelected] = useState<RadioSemanticName>()

 return (
 <> 
 <div className="radio-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Radio
 checked
 classNames={{
 root: 'my-radio__root',
 controller: 'my-radio__controller',
 label: 'my-radio__label',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 选项一
 </Radio>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素 (label)' },
 { title: 'controller', description: '圆形控制器' },
 { title: 'label', description: '文案' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as RadioSemanticName)}
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

### Radio Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------- | ------------------------------------------------- | ------------- | ------ |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | RadioSemanticClassNames | - | - |
| styles | | RadioSemanticStyles | - | - |
| name | input\[type="radio"] 的 name 属性 | string | - | - |
| value | 单选对应的值 | ReactText | - | - |
| checked | 是否选中（受控） | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| autoFocus | 页面载入时，是否自动获取焦点 | boolean | true \| false | - |
| readOnly | 是否只读 | boolean | true \| false | - |
| onChange | 选中态改变时的回调 | ((event: ChangeEvent\<HTMLInputElement>) => void) | - | - |


### RadioGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------ | ---------------------------------------------- | ---------------------------- | -------------------------- | ------------ |
| data | 指定可选项 | RadioDataItem\[] | - | - |
| type | 单选按钮展示类型 | RadioGroupTypeEnum | "button" \| "default" | "default" |
| placement | 设置水平或垂直展示 | RadioGroupPlacementEnum | "vertical" \| "horizontal" | "horizontal" |
| autoWidth | 宽度是否自适应 | boolean | true \| false | false |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | RadioGroupSemanticClassNames | - | - |
| styles | | RadioGroupSemanticStyles | - | - |
| name | \`RadioGroup\` 下透传给所有 Radio 的 name 属性 | string | - | - |
| value | 选中项的值（受控） | ReactText | - | - |
| defaultValue | 默认选中项的值 | ReactText | - | - |
| onChange | 选中态改变时的回调 | ((value: ReactText) => void) | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |


## Type

### RadioDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------- | --------- | ------------- | ------ |
| id | 选项唯一标识 id | ReactText | - | - |
| title | 选项显示内容 | ReactNode | - | - |
| disabled | 是否禁用该选项 | boolean | true \| false | false |
