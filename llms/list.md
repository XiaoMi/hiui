# List 列表

通用列表。

## 使用示例

### 基础用法

常用在数据管理、信息展示等领域


```tsx
import React from 'react'
import List from '@hi-ui/list' 
export const Basic = () => {
 return (
 <> 
 <div className="list-basic__wrap">
 <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
 <List
 data={[
 {
 title: '1、当前这里是标题信息',
 },
 {
 title: '2、当前这里是标题信息',
 },
 {
 title: '3、当前这里是标题信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 <br />
 <List
 data={[
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 不带分割线


```tsx
import React from 'react'
import List from '@hi-ui/list' 
export const NoSplit = () => {
 return (
 <> 
 <div className="list-basic__wrap">
 <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
 <List
 split={false}
 data={[
 {
 title: '1、当前这里是标题信息',
 },
 {
 title: '2、当前这里是标题信息',
 },
 {
 title: '3、当前这里是标题信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 <br />
 <List
 split={false}
 data={[
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 列表头部


```tsx
import React from 'react'
import List from '@hi-ui/list' 
export const Header = () => {
 return (
 <> 
 <div className="list-header__wrap">
 <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
 <List
 header={<div>列表头部</div>}
 data={[
 {
 title: '1、当前这里是标题信息',
 },
 {
 title: '2、当前这里是标题信息',
 },
 {
 title: '3、当前这里是标题信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 <br />
 <List
 split={false}
 header={<div>列表头部</div>}
 data={[
 {
 title: '1、当前这里是标题信息',
 },
 {
 title: '2、当前这里是标题信息',
 },
 {
 title: '3、当前这里是标题信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 带操作

可通过 actionPlacement 配置操作项的垂直对齐位置


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import List from '@hi-ui/list' 
export const Action = () => {
 return (
 <> 
 <div className="list-basic__wrap">
 <List
 data={[
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} actionPlacement="top" />
 }}
 />
 </div>
 </>
 )
}

```


### 带分页


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import List from '@hi-ui/list' 
export const Pagination = () => {
 return (
 <> 
 <div className="list-basic__wrap">
 <List
 data={[
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'https://xiaomi.github.io/hiui/logo.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 ]}
 pagination={{
 total: 200,
 pageSize: 10,
 placement: 'right',
 }}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 />
 </div>
 </>
 )
}

```


### 数据为空


```tsx
import React from 'react'
import List from '@hi-ui/list'
import EmptyState from '@hi-ui/empty-state' 
export const Empty = () => {
 return (
 <> 
 <div className="list-basic__wrap">
 <List
 data={[]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 emptyContent={() => <EmptyState />}
 />
 </div>
 </>
 )
}

```


### 自定义头像


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import List from '@hi-ui/list'
import Avatar from '@hi-ui/avatar' 
export const CustomAvatar = () => {
 return (
 <> 
 <div className="list-custom-avatar__wrap">
 <List
 data={[
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 {
 title: '当前这里是标题信息',
 description:
 '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
 avatar: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 action: (
 <Button type="primary" appearance="link">
 操作
 </Button>
 ),
 },
 ]}
 render={(dataItem) => (
 <List.Item
 {...dataItem}
 avatar={
 <img style={{ maxHeight: 84, borderRadius: 8 }} src={dataItem.avatar as string} />
 }
 extra={
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 marginInlineEnd: 8,
 paddingInlineEnd: 8,
 borderRight: '1px solid #e6e8eb',
 }}
 >
 <Avatar size={20} />
 李小米
 </div>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 marginInlineEnd: 8,
 paddingInlineEnd: 8,
 borderRight: '1px solid #e6e8eb',
 }}
 >
 2025年10月28日
 </div>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 paddingInlineEnd: 8,
 }}
 >
 <Avatar.Group>
 <Avatar size={22} />
 <Avatar size={22} />
 <Avatar size={22} />
 </Avatar.Group>
 21 人点赞
 </div>
 </div>
 }
 />
 )}
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
import List, { ListSemanticName } from '@hi-ui/list' 
export const Semantic = () => {
 const [selected, setSelected] = useState<ListSemanticName>()

 return (
 <> 
 <div className="list-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <List
 header="列表标题"
 data={[
 {
 title: '列表项 1',
 description: '这是列表项 1 的描述信息',
 },
 {
 title: '列表项 2',
 description: '这是列表项 2 的描述信息',
 },
 {
 title: '列表项 3',
 description: '这是列表项 3 的描述信息',
 },
 ]}
 render={(dataItem) => {
 return <List.Item {...dataItem} />
 }}
 classNames={{
 root: 'my-list__root',
 header: 'my-list__header',
 wrapper: 'my-list__wrapper',
 item: 'my-list__item',
 pagination: 'my-list__pagination',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 pagination={{
 total: 200,
 pageSize: 10,
 placement: 'right',
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
 title: 'header',
 description: '列表头部',
 },
 {
 title: 'wrapper',
 description: '列表容器',
 },
 {
 title: 'item',
 description: '列表项',
 },
 {
 title: 'pagination',
 description: '分页容器',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as ListSemanticName)
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

### List Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| data *(required)* | 列表展示的数据 | ListDataItem\[] | - | - |
| fieldNames | 设置data中的每一项对应的key | HiBaseFieldNames | - | - |
| render | 自定义渲染列表项 | ((item: ListDataItem) => ReactNode) | - | - |
| split | 是否展示分割线 | boolean | true \| false | true |
| pagination | 对应的 pagination 配置, 设置 undefined 不显示 | (PaginationProps & { placement: ListPaginationPlacementEnum; }) | PaginationProps & { placement: ListPaginationPlacementEnum; } | - |
| bordered | 是否展示边框 | boolean | true \| false | - |
| emptyContent | 数据为空时的展示内容 | ReactNode \| (() => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| () => ReactNode | - |
| header | 列表头部 | ReactNode | - | - |
| classNames | | ListSemanticClassNames | - | - |
| styles | | ListSemanticStyles | - | - |


### ListItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ---------------------- | ----------------------- | ----------------------------- | ------ |
| title | 列表元素的标题 | ReactNode | - | - |
| description | 列表元素的描述内容 | ReactNode | - | - |
| extra | 额外内容 | ReactNode | - | - |
| avatar | 左侧图片 | ReactNode | - | - |
| action | 右侧操作项 | ReactNode | - | - |
| actionPlacement | 右侧操作项垂直对齐位置 | ListActionPlacementEnum | "top" \| "center" \| "bottom" | "top" |


## Type

### ListDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ---------------------- | ----------------------- | ----------------------------- | -------- |
| title | 列表元素的标题 | ReactNode | - | - |
| description | 列表元素的描述内容 | ReactNode | - | - |
| extra | 额外内容 | ReactNode | - | - |
| avatar | 左侧图片资源地址 | string | - | - |
| action | 右侧操作项 | ReactNode | - | - |
| actionPlacement | 右侧操作项垂直对齐位置 | ListActionPlacementEnum | "top" \| "center" \| "bottom" | "center" |

### PaginationProps

> 继承 Pagination 组件的 Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | ------------------ | --------------------------- | ---------------------------- | ------- |
| placement | 指定分页显示的位置 | ListPaginationPlacementEnum | 'left' \| 'middle' \|'right' | 'right' |
