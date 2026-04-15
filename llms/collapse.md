# Collapse 折叠面板

将信息以折叠的形式收入面板，以节省空间，减少信息干扰，应用时打开

## 使用示例

### 基础用法

可以同时展开多个面板，对垂直空间没有特别限制


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse' 
export const Basic = () => {
 return (
 <> 
 <div className="collapse-basic__wrap">
 <Collapse defaultActiveId={['2', '3']} arrowPlacement="left">
 <Collapse.Panel title="小米手机" id="1" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米笔记本" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米笔记本的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米 AI" id="4">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米 AI 的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 手风琴模式

一次仅展开一个面板，有效减少垂直空间的占用


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse'
import { IconButton } from '@hi-ui/icon-button'
import { EditOutlined } from '@hi-ui/icons' 
export const Accordion = () => {
 return (
 <> 
 <div className="collapse-accordion__wrap">
 <Collapse defaultActiveId={['2']} arrowPlacement="left" accordion>
 <Collapse.Panel title="小米手机" id="1" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel
 title="红米手机"
 id="2"
 extra={
 <IconButton
 style={{ marginInlineEnd: 12 }}
 icon={<EditOutlined />}
 onClick={(evt) => evt.stopPropagation()}
 effect
 />
 }
 >
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米笔记本" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米笔记本的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米 AI" id="4">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米 AI 的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 箭头位置

指定箭头放置方式


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse'
import { PlusOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button' 
export const ArrowPlacement = () => {
 return (
 <> 
 <div className="collapse-arrow-placement__wrap">
 <Collapse defaultActiveId={['2']} arrowPlacement="right">
 <Collapse.Panel title="小米手机" id="1" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米笔记本" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米笔记本的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel
 title="小米 AI"
 id="4"
 extra={
 <IconButton
 style={{ marginInlineEnd: 12 }}
 effect
 icon={<PlusOutlined />}
 onClick={(evt) => evt.stopPropagation()}
 />
 }
 >
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米 AI 的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 带边框


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse' 
export const bordered = () => {
 return (
 <> 
 <div
 className="collapse-bordered__wrap"
 style={{
 backgroundColor: '#F5F7FA',
 padding: 24,
 }}
 >
 <Collapse defaultActiveId={['2']} arrowPlacement="left" bordered={false}>
 <Collapse.Panel title="小米手机" id="1" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米笔记本" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米笔记本的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米 AI" id="4">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米 AI 的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 自定义箭头


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse'
import { FolderFilled, FolderOpenFilled } from '@hi-ui/icons' 
export const ArrowRender = () => {
 const [activeId, setActiveId] = React.useState<React.ReactText[]>(['2'])

 return (
 <> 
 <div className="collapse-arrow-render__wrap">
 <Collapse
 arrowPlacement="left"
 activeId={activeId}
 onChange={setActiveId}
 arrowRender={(expanded) => {
 return (
 <span style={{ marginRight: 8, color: '#fab007', fontSize: 16 }}>
 {expanded ? <FolderFilled /> : <FolderOpenFilled />}
 </span>
 )
 }}
 >
 <Collapse.Panel title="小米手机" id="1" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米笔记本" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米笔记本的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="小米 AI" id="4">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是小米 AI 的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 设置标题内容


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse'
import { TabList } from '@hi-ui/tabs' 
export const Title = () => {
 const [xiaomiTabList] = React.useState([
 { tabId: '0', tabTitle: '小米10' },
 { tabId: '1', tabTitle: '小米11' },
 { tabId: '2', tabTitle: '小米12' },
 ])

 const [xiaomiActiveId, setXiaomiActiveId] = React.useState<React.ReactText>('0')

 return (
 <> 
 <div className="collapse-title__wrap">
 <Collapse defaultActiveId={['1']}>
 <Collapse.Panel
 title={
 <TabList
 style={{ margin: '-12px 0' }}
 size="md"
 data={xiaomiTabList}
 onClick={(evt) => {
 evt.stopPropagation()
 }}
 activeId={xiaomiActiveId}
 onChange={setXiaomiActiveId}
 />
 }
 id="1"
 >
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是{xiaomiTabList.find((item) => item.tabId === xiaomiActiveId)?.tabTitle}
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 </div>
 </>
 )
}

```


### 设置头部大小


```tsx
import React from 'react'
import Collapse from '@hi-ui/collapse' 
export const Size = () => {
 return (
 <> 
 <div className="collapse-size__wrap">
 <h2>小尺寸</h2>
 <Collapse size="sm">
 <Collapse.Panel title="小米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 <h2>常规</h2>
 <Collapse size="md">
 <Collapse.Panel title="小米手机" id="1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 </Collapse>
 <h2>大尺寸</h2>
 <Collapse size="lg">
 <Collapse.Panel title="小米手机" id="2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 <Collapse.Panel title="红米手机" id="3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 我是红米手机的内容
 </div>
 </Collapse.Panel>
 </Collapse>
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
import Collapse from '@hi-ui/collapse' 
export const Semantic = () => {
 const [selected, setSelected] = useState<
 'root' | 'head' | 'icon' | 'titleContainer' | 'title' | 'extra' | 'contentWrapper' | 'content'
 >()

 return (
 <> 
 <div className="collapse-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Collapse defaultActiveId={['1']} arrowPlacement="left">
 <Collapse.Panel
 id="1"
 title="面板标题"
 extra={<span>额外内容</span>}
 style={{ overflow: 'unset' }}
 classNames={{
 root: 'my-collapse-panel__root',
 head: 'my-collapse-panel__head',
 icon: 'my-collapse-panel__icon',
 titleContainer: 'my-collapse-panel__title-container',
 title: 'my-collapse-panel__title',
 extra: 'my-collapse-panel__extra',
 contentWrapper: 'my-collapse-panel__content-wrapper',
 content: 'my-collapse-panel__content',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 ...(selected === 'content'
 ? {
 contentWrapper: {
 overflow: 'unset',
 },
 }
 : {}),
 }}
 >
 <div>这是面板内容</div>
 </Collapse.Panel>
 </Collapse>
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
 title: 'head',
 description: '头部区域',
 },
 {
 title: 'icon',
 description: '图标元素',
 },
 {
 title: 'titleContainer',
 description: '标题容器',
 },
 {
 title: 'title',
 description: '标题元素',
 },
 {
 title: 'extra',
 description: '额外内容元素',
 },
 {
 title: 'contentWrapper',
 description: '内容包装器',
 },
 {
 title: 'content',
 description: '内容区域',
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

### Collapse Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ----------------- | -------------------------------- | --------------------------- | ------------------ |
| accordion | 开启手风琴模式 | boolean | true \| false | false |
| defaultActiveId | 默认展开的面板 id | ReactText\[] | - | "\[] as string\[]" |
| activeId | 展开的面板 id | ReactText\[] | - | - |
| arrowPlacement | 箭头所在位置 | CollapseArrowPlacementEnum | "left" \| "right" | "right" |
| showArrow | 是否显示展开箭头 | boolean | true \| false | true |
| onChange | 切换时的回调 | ((ids: ReactText\[]) => void) | - | - |
| children | 折叠面板 | ReactNode | - | - |
| bordered | 是否开启带边框 | boolean | true \| false | true |
| arrowRender | 箭头渲染 | ((active: boolean) => ReactNode) | - | - |
| size | 设置头部大小 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |


### CollapsePanel Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ------------ | ------------------------------- | ------------- | ------ |
| id *(required)* | 面板唯一标识 | string | - | - |
| title *(required)* | 面板的标题 | ReactNode | - | - |
| extra | 额外元素 | ReactNode | - | - |
| disabled | 是否禁用面板 | boolean | true \| false | false |
| children | 面板的内容 | ReactNode | - | - |
| classNames | | CollapsePanelSemanticClassNames | - | - |
| styles | | CollapsePanelSemanticStyles | - | - |

