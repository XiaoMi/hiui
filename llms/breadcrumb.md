# Breadcrumb 面包屑

一种特殊的导航，用来指引在系统中用户的行踪和方向

## 使用示例

### 基础用法

明确访问路径的每一个节点


```tsx
import React from 'react'
import Breadcrumb from '@hi-ui/breadcrumb' 
export const Basic = () => {
 const [data] = React.useState([
 {
 title: '首页',
 href: '/home',
 },
 {
 title: '列表',
 href: '/list',
 },
 {
 title: '手机详情',
 href: '/phone',
 },
 ])

 return (
 <> 
 <div className="breadcrumb-basic__wrap">
 <Breadcrumb
 data={data}
 onClick={(evt, item) => {
 console.log('get item: ', item)
 }}
 />
 </div>
 </>
 )
}

```


### 不同尺寸

通过 size 设置不同大小的面包屑


```tsx
import React from 'react'
import Breadcrumb from '@hi-ui/breadcrumb' 
export const Size = () => {
 const [data] = React.useState([
 {
 title: '首页',
 href: '/home',
 },
 {
 title: '列表',
 href: '/list',
 },
 {
 title: '手机详情',
 href: '/phone',
 },
 ])

 return (
 <> 
 <div className="breadcrumb-size__wrap">
 <Breadcrumb
 data={data}
 size="sm"
 onClick={(evt, item) => {
 console.log('get item: ', item)
 }}
 />
 <br />
 <Breadcrumb
 data={data}
 size="md"
 onClick={(evt, item) => {
 console.log('get item: ', item)
 }}
 />
 </div>
 </>
 )
}

```


### 前缀图标


```tsx
import React from 'react'
import Breadcrumb from '@hi-ui/breadcrumb'
import { HomeOutlined } from '@hi-ui/icons' 
export const CustomIcon = () => {
 const [data] = React.useState([
 {
 icon: <HomeOutlined />,
 title: '首页',
 href: '/home',
 },
 {
 icon: <HomeOutlined />,
 title: '列表',
 href: '/list',
 },
 {
 icon: <HomeOutlined />,
 title: '手机详情',
 href: '/phone',
 },
 ])

 return (
 <> 
 <div className="breadcrumb-custom-icon__wrap">
 <Breadcrumb
 data={data}
 onClick={(evt, item) => {
 console.log('get item: ', item)
 }}
 />
 </div>
 </>
 )
}

```


### 自定义分隔符


```tsx
import { RightOutlined } from '@hi-ui/icons'
import React from 'react'
import Breadcrumb from '@hi-ui/breadcrumb' 
export const Separator = () => {
 const [data] = React.useState([
 {
 title: '首页',
 href: '/home',
 },
 {
 title: '列表',
 href: '/list',
 },
 {
 title: '手机详情',
 href: '/phone',
 },
 ])

 return (
 <> 
 <div className="breadcrumb-separator__wrap">
 <Breadcrumb
 data={data}
 separator={'/'}
 onClick={(evt, item) => {
 console.log('get item: ', item)
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
import { HomeOutlined } from '@hi-ui/icons'
import Breadcrumb from '@hi-ui/breadcrumb' 
export const Semantic = () => {
 const [selected, setSelected] = useState<'root' | 'item' | 'content' | 'icon' | 'separator'>()

 const [data] = React.useState([
 {
 icon: <HomeOutlined />,
 title: '首页',
 href: '/home',
 },
 {
 icon: <HomeOutlined />,
 title: '列表',
 href: '/list',
 },
 {
 icon: <HomeOutlined />,
 title: '手机详情',
 href: '/phone',
 },
 ])

 return (
 <> 
 <div className="breadcrumb-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Breadcrumb
 classNames={{
 root: 'my-breadcrumb__root',
 item: 'my-breadcrumb__item',
 content: 'my-breadcrumb__content',
 icon: 'my-breadcrumb__icon',
 separator: 'my-breadcrumb__separator',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 data={data}
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
 title: 'item',
 description: '项目元素',
 },
 {
 title: 'content',
 description: '内容元素',
 },
 {
 title: 'icon',
 description: '图标元素',
 },
 {
 title: 'separator',
 description: '分隔符元素',
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

### Breadcrumb Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------ | ------------------ |
| separator | 面包屑分隔符 | ReactNode | - | \<RightOutlined /> |
| data | 面包屑数据项 | BreadcrumbDataItem\[] | - | - |
| fieldNames | 设置 data 中 title, href, target, icon 对应的 key | HiBaseFieldNames | - | - |
| size | 面包屑尺寸 | BreadcrumbSizeEnum | "sm" \| "md" | - |
| onClick | 点击事件 | ((evt: MouseEvent\<Element, MouseEvent>, item: BreadcrumbDataItem, index: number) => void) | - | - |
| classNames | | BreadcrumbSemanticClassNames | - | - |
| styles | | BreadcrumbSemanticStyles | - | - |


## Type

### BreadcrumbDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | --------------------------------------------- | --------- | ----------------------------------------------- | ------ |
| title | 面包屑的标题 | ReactNode | - | - |
| href | 设置按钮链接，设置后将用 a 标签渲染按钮 | string | ︎ | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | string | ︎'\_self' \| '\_blank' \| '\_parent' \| '\_top' | - |
| icon | 自定义图标 | ReactNode | ︎ | - |
