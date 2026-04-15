# PageHeader 页头

页面头部内容

## 使用示例

### 基础用法

默认不带背景色和左右边距


```tsx
import React from 'react'
import PageHeader from '@hi-ui/page-header' 
export const Basic = () => {
 return (
 <> 
 <div className="page-header-basic__wrap">
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 backIcon={false}
 />
 </div>
 </>
 )
}

```


### 带返回图标


```tsx
import React from 'react'
import PageHeader from '@hi-ui/page-header'
import { LeftOutlined } from '@hi-ui/icons' 
export const BackIcon = () => {
 return (
 <> 
 <div className="page-header-back-icon__wrap">
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 onBack={() => console.log('back button clicked')}
 />
 <br />
 <br />
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 backIcon={<LeftOutlined />}
 onBack={() => alert('back button clicked')}
 />
 </div>
 </>
 )
}

```


### 副标题


```tsx
import React from 'react'
import PageHeader from '@hi-ui/page-header'
import { InfoCircleOutlined } from '@hi-ui/icons'
import Space from '@hi-ui/space'
import Tag from '@hi-ui/tag'
import Tooltip from '@hi-ui/tooltip' 
export const SubTitle = () => {
 return (
 <> 
 <div className="page-header-sub-title__wrap">
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 subTitle={
 <Tooltip title="提示信息">
 <InfoCircleOutlined />
 </Tooltip>
 }
 />
 <br />
 <br />
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 subTitle={
 <Space size="sm">
 <Tag size="sm" type="primary">
 标签
 </Tag>
 <Tag size="sm" type="primary">
 标签
 </Tag>
 </Space>
 }
 />
 </div>
 </>
 )
}

```


### 额外元素


```tsx
import React from 'react'
import PageHeader from '@hi-ui/page-header'
import { EllipsisOutlined, PlusOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown' 
export const Extra = () => {
 return (
 <> 
 <div className="page-header-extra__wrap">
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 extra={
 <Space>
 <Dropdown
 data={[
 { id: 'add', title: '添加' },
 { id: 'edit', title: '编辑' },
 { id: 'delete', title: '删除' },
 ]}
 width={80}
 >
 <Button appearance="line" icon={<EllipsisOutlined />} />
 </Dropdown>
 <Button type="primary" appearance="line">
 次要操作
 </Button>
 <Button type="primary" icon={<PlusOutlined />}>
 主操作
 </Button>
 </Space>
 }
 />
 </div>
 </>
 )
}

```


### 带面包屑


```tsx
import React from 'react'
import PageHeader from '@hi-ui/page-header'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'
import Button from '@hi-ui/button'
import { EllipsisOutlined, PlusOutlined } from '@hi-ui/icons' 
export const Breadcrumb = () => {
 return (
 <> 
 <div className="page-header-breadcrumb__wrap">
 <PageHeader
 style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
 title="页面标题"
 breadcrumb={{
 data: [
 {
 title: '首页',
 href: '/',
 },
 {
 title: '列表',
 href: '/',
 },
 {
 title: '手机详情',
 href: '/',
 },
 ],
 // separator: '/',
 onClick: (evt, item) => {
 console.log('get item: ', item)
 },
 }}
 extra={
 <Space>
 <Dropdown
 data={[
 { id: 'add', title: '添加' },
 { id: 'edit', title: '编辑' },
 { id: 'delete', title: '删除' },
 ]}
 width={80}
 >
 <Button appearance="line" icon={<EllipsisOutlined />} />
 </Dropdown>
 <Button type="primary" appearance="line">
 次要操作
 </Button>
 <Button type="primary" icon={<PlusOutlined />}>
 主操作
 </Button>
 </Space>
 }
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
import PageHeader, { PageHeaderSemanticName } from '@hi-ui/page-header' 
export const Semantic = () => {
 const [selected, setSelected] = useState<PageHeaderSemanticName>()

 return (
 <> 
 <div className="page-header-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <PageHeader
 classNames={{
 root: 'my-page-header__root',
 breadcrumb: 'my-page-header__breadcrumb',
 content: 'my-page-header__content',
 titleContainer: 'my-page-header__title-container',
 backButton: 'my-page-header__back-button',
 title: 'my-page-header__title',
 subTitle: 'my-page-header__sub-title',
 extra: 'my-page-header__extra',
 }}
 styles={{
 ...(selected && {
 [selected]: {
 outline: '1px solid #ffbe0a',
 },
 }),
 }}
 title="页面标题"
 subTitle="页面副标题"
 breadcrumb={{
 data: [
 {
 title: '首页',
 href: '/',
 },
 {
 title: '列表',
 href: '/',
 },
 {
 title: '手机详情',
 href: '/',
 },
 ],
 }}
 extra={<span>操作区</span>}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'breadcrumb', description: '面包屑容器' },
 { title: 'content', description: '内容区域' },
 { title: 'titleContainer', description: '标题容器' },
 { title: 'backButton', description: '返回按钮' },
 { title: 'title', description: '标题' },
 { title: 'subTitle', description: '副标题' },
 { title: 'extra', description: '额外内容' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as PageHeaderSemanticName)
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

### PageHeader Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ---------------- | ------------------------------------------------- | ------ | ------ |
| title | 标题 | ReactNode | - | - |
| subTitle | 副标题 | ReactNode | - | - |
| backIcon | 返回图标 | ReactNode | - | true |
| breadcrumb | 面包屑 | BreadcrumbProps | - | - |
| extra | 额外内容 | ReactNode | - | - |
| onBack | 返回按钮点击事件 | ((evt: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| classNames | | PageHeaderSemanticClassNames | - | - |
| styles | | PageHeaderSemanticStyles | - | - |

