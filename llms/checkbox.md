# Checkbox 复选

复选是用来在一组平铺选项中同时选择 1 个以上的选项

## 使用示例

### 基础用法

展示所有备选项，数量不宜超出10个


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox' 
export const Basic = () => {
 return (
 <> 
 <div className="checkbox-basic__wrap">
 <Checkbox>复选框</Checkbox>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox' 
export const Disabled = () => {
 return (
 <> 
 <div className="checkbox-disabled__wrap">
 <Checkbox disabled checked>
 复选框
 </Checkbox>
 <br />
 <br />
 <Checkbox disabled>复选框</Checkbox>
 <br />
 <br />
 <Checkbox disabled indeterminate>
 复选框
 </Checkbox>
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox'
import Button from '@hi-ui/button' 
export const Controlled = () => {
 const [checked, setChecked] = React.useState(false)

 return (
 <> 
 <div className="checkbox-controlled__wrap">
 <Button onClick={() => setChecked((prev) => !prev)}>Toggle</Button>
 <br />
 <br />
 <Checkbox
 checked={checked}
 onChange={(evt) => {
 console.log('onChange', evt.target.checked)
 setChecked(evt.target.checked)
 }}
 >
 Checkbox
 </Checkbox>
 </div>
 </>
 )
}

```


### 成组


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox' 
export const Group = () => {
 const CheckboxGroup = Checkbox.Group

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
 const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

 return (
 <> 
 <div className="checkbox-group__wrap">
 <CheckboxGroup
 data={data}
 value={selectedList}
 onChange={(value) => {
 console.log(value)
 setSelectedList(value)
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
import Checkbox from '@hi-ui/checkbox' 
export const Placement = () => {
 const CheckboxGroup = Checkbox.Group

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
 const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

 return (
 <> 
 <div className="checkbox-placement__wrap">
 <CheckboxGroup
 data={data}
 placement="vertical"
 value={selectedList}
 onChange={(value) => {
 console.log(value)
 setSelectedList(value)
 }}
 />
 </div>
 </>
 )
}

```


### 全选

一次操作选中所有选项


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox' 
export const CheckAll = () => {
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
 },
 ])
 const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

 return (
 <> 
 <div
 className="checkbox-check-all__wrap"
 style={{ display: 'flex', gap: 12, flexDirection: 'column' }}
 >
 <Checkbox
 indeterminate={selectedList.length > 0 && selectedList.length < 4}
 checked={selectedList.length === 4}
 onChange={() => {
 setSelectedList((prev) => {
 return prev.length < 4 ? data.map(({ id }) => id) : []
 })
 }}
 >
 全选
 </Checkbox>
 <Checkbox.Group
 data={data}
 value={selectedList}
 onChange={(value) => {
 console.log(value)
 setSelectedList(value)
 }}
 />
 </div>
 </>
 )
}

```


### 灵活布局

Checkbox 与 Grid 组件一起使用，可以实现灵活的布局


```tsx
import React from 'react'
import Checkbox from '@hi-ui/checkbox'
import Grid from '@hi-ui/grid' 
export const Children = () => {
 const { Row, Col } = Grid
 const CheckboxGroup = Checkbox.Group

 const [selectedList, setSelectedList] = React.useState<React.ReactText[]>([
 'Phone',
 'Intelligent',
 ])

 return (
 <> 
 <div className="checkbox-children__wrap">
 <CheckboxGroup
 value={selectedList}
 style={{ width: '100%' }}
 onChange={(value) => {
 console.log(value)
 setSelectedList(value)
 }}
 >
 <Row>
 <Col span={8}>
 <Checkbox value="Phone">手机</Checkbox>
 </Col>
 <Col span={8}>
 <Checkbox value="Computer">电脑</Checkbox>
 </Col>
 <Col span={8}>
 <Checkbox value="Intelligent">智能</Checkbox>
 </Col>
 </Row>
 <Row>
 <Col span={8}>
 <Checkbox value="Transfer" onChange={console.log}>
 出行
 </Checkbox>
 </Col>
 <Col span={8}>
 <Checkbox value="ecological" onChange={console.log}>
 生态
 </Checkbox>
 </Col>
 </Row>
 </CheckboxGroup>
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
import Checkbox, { CheckboxGroup } from '@hi-ui/checkbox' 
export const Semantic = () => {
 const [selected, setSelected] = useState<'root' | 'input' | 'icon' | 'text'>()
 const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

 return (
 <> 
 <div className="checkbox-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <h2>普通用法</h2>
 <Checkbox
 classNames={{
 root: 'my-checkbox__root',
 icon: 'my-checkbox__icon',
 text: 'my-checkbox__text',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 复选框
 </Checkbox>
 <h2>成组用法</h2>
 <CheckboxGroup
 data={[
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
 ]}
 checkboxClassNames={{
 root: 'my-checkbox-group__item',
 icon: 'my-checkbox-group__item-icon',
 text: 'my-checkbox-group__item-text',
 }}
 checkboxStyles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 value={selectedList}
 onChange={(value) => {
 setSelectedList(value)
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
 title: 'icon',
 description: '图标元素',
 },
 {
 title: 'text',
 description: '文本元素',
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

### Checkbox Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ----------------------------------------- | ----------------------------------------------- | ------------- | ------ |
| autoFocus | 是否自动获取焦点 | boolean | true \| false | false |
| checked | 是否选中 | boolean | true \| false | - |
| defaultChecked | 是否默认选中 | boolean | true \| false | false |
| disabled | 是否禁用 | boolean | true \| false | - |
| indeterminate | 不全选的样式控制，优先级大于 checked | boolean | true \| false | false |
| name | checkbox 表单控件的名称，用于 form 提交 | string | - | - |
| value | checkbox 表单控件绑定的值，用于 form 提交 | ReactText | - | - |
| onChange | 值变化时的回调 | ((evt: ChangeEvent\<HTMLInputElement>) => void) | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | CheckboxSemanticClassNames | - | - |
| styles | | CheckboxSemanticStyles | - | - |


### CheckboxGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | --------------------------------------------------------- | ------------------------------------ | -------------------------- | ------------ |
| placement | 排列方式 | CheckboxPlacementEnum | "vertical" \| "horizontal" | "horizontal" |
| data | 指定可选项 | CheckboxDataItem\[] | - | \[] |
| defaultValue | 默认选中的项 | ReactText\[] | - | \[] |
| disabled | 是否禁用 | boolean | true \| false | false |
| name | CheckboxGroup 下所有 input\[type="checkbox"] 的 name 属性 | string | - | - |
| value | 指定选中的项 | ReactText\[] | - | - |
| onChange | 值变化时的回调 | ((checkedIds: ReactText\[]) => void) | - | - |
| checkboxClassNames | 复选框的语义化类名 | CheckboxSemanticClassNames | - | - |
| checkboxStyles | 复选框的语义化样式 | CheckboxSemanticStyles | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |


## Type

### CheckboxDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------- | --------- | ------------- | ------ |
| id | 选项值，唯一 id | ReactText | - | - |
| title | 选项显示内容 | ReactNode | - | - |
| disabled | 是否禁用该选项 | boolean | true \| false | false |
