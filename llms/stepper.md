# Stepper 步骤条

用来标识和组织完成一个任务时的信息。

## 使用示例

### 基础用法

一个复杂任务需要拆分多个步骤完成，步骤数量不宜过多，4-7个为宜


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper' 
export const Basic = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 },
 {
 title: '邮箱激活',
 },
 {
 title: '信息登记',
 },
 ])

 return (
 <> 
 <div className="stepper-basic__wrap">
 <Stepper data={data} current={2} />
 </div>
 </>
 )
}

```


### 辅助信息

步骤名称不足以表达明确用意，用辅助信息进一步说明


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper' 
export const Content = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 content: '请输入账号信息',
 },
 {
 title: '邮箱激活',
 content: '请输入邮箱',
 },
 {
 title: '信息登记',
 content:
 '请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息',
 },
 ])

 return (
 <> 
 <div className="stepper-content__wrap">
 <Stepper data={data} current={2} onChange={console.log} />
 </div>
 </>
 )
}

```


### 小圆点


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper' 
export const Dot = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 content: '请输入账号信息',
 },
 {
 title: '邮箱激活',
 content: '请输入邮箱',
 },
 {
 title: '信息登记',
 content: '请输入个人信息',
 },
 ])

 return (
 <> 
 <div className="stepper-dot__wrap">
 <Stepper data={data} current={2} type="dot" />
 </div>
 </>
 )
}

```


### 图标用法

每个步骤可用图标明确表示含义，带来丰富生动的效果


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper'
import { TimeOutlined, UserOutlined } from '@hi-ui/icons' 
export const CustomIcon = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 icon: <UserOutlined />,
 },
 {
 title: '邮箱激活',
 icon: <TimeOutlined />,
 },
 {
 title: '信息登记',
 icon: <UserOutlined />,
 },
 ])

 return (
 <> 
 <div className="stepper-custom-icon__wrap">
 <Stepper
 data={data}
 current={2}
 itemLayout="vertical"
 // type="dot"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 标题结构

步骤与内容通过上下结构可以有效利用页面空间


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper' 
export const ItemLayout = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 content: '请输入账号信息',
 },
 {
 title: '邮箱激活',
 content: '请输入邮箱',
 },
 {
 title: '信息登记',
 content: '请输入个人信息',
 },
 ])

 return (
 <> 
 <div className="stepper-item-vertical__wrap">
 <Stepper data={data} current={2} itemLayout="vertical" />
 <br />
 <br />
 <Stepper data={data} current={3} itemLayout="vertical" type="dot" />
 </div>
 </>
 )
}

```


### 垂直用法


```tsx
import React from 'react'
import Stepper from '@hi-ui/stepper' 
export const Placement = () => {
 const [data] = React.useState([
 {
 title: '账号信息',
 content: '请输入账号信息',
 },
 {
 title: '邮箱激活',
 content: '请输入邮箱',
 },
 {
 title: '信息登记信息登记信息登记信息登记信息登记',
 content: '请输入个人信息',
 },
 ])

 return (
 <> 
 <div className="stepper-placement__wrap">
 <Stepper data={data} current={2} placement="vertical" />
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
import Stepper, { StepperSemanticName } from '@hi-ui/stepper' 
export const Semantic = () => {
 const [selected, setSelected] = useState<StepperSemanticName>()

 return (
 <> 
 <div className="stepper-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Stepper
 data={[
 { title: '步骤一', content: '描述' },
 { title: '步骤二', content: '描述' },
 { title: '步骤三', content: '描述' },
 ]}
 current={2}
 style={{ overflow: 'unset' }}
 classNames={{
 root: 'my-stepper__root',
 item: 'my-stepper__item',
 itemStatus: 'my-stepper__item-status',
 itemTip: 'my-stepper__item-tip',
 itemTipTitle: 'my-stepper__item-tip-title',
 itemTipContent: 'my-stepper__item-tip-content',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'item', description: '单个步骤项' },
 { title: 'itemStatus', description: '步骤状态（图标/数字）' },
 { title: 'itemTip', description: '步骤文案容器' },
 { title: 'itemTipTitle', description: '步骤标题' },
 { title: 'itemTipContent', description: '步骤描述' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as StepperSemanticName)}
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

### Stepper Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ------------------------------- | --------------------------- | -------------------------- | ------------ |
| data | 步骤条数据项 | StepperDataItem\[] | - | \[] |
| fieldNames | 设置data 中的每一项对应的key | HiBaseFieldNames | - | - |
| current | 当前步骤位置索引，从 1 开始计数 | number | - | - |
| onChange | 步骤项的变更回调 | ((current: number) => void) | - | - |
| placement | 水平或垂直展示步骤条 | "vertical" \| "horizontal" | "vertical" \| "horizontal" | "horizontal" |
| itemLayout | 步骤项的布局方式 | "vertical" \| "horizontal" | "vertical" \| "horizontal" | "horizontal" |
| type | 节点类型 | "dot" \| "default" | "dot" \| "default" | "default" |
| classNames | | StepperSemanticClassNames | - | - |
| styles | | StepperSemanticStyles | - | - |


## Type

### StepperDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ----------- | --------- | ------ | ------ |
| title | 步骤项标题 | ReactNode | - | - |
| content | 步骤项内容 | ReactNode | - | - |
| icon | 步骤项 icon | ReactNode | - | - |
