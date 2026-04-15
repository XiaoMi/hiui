# Tabs 标签页

又叫“选项卡”，一般用于同一页面区域展示多组并列信息，且标签之间为并列关系。

## 使用示例

### 基础用法

基础标签页


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const [activeTab, setActiveTab] = React.useState<React.ReactText>('1')
 const [showDivider, setShowDivider] = React.useState<boolean>(true)

 return (
 <> 
 <div className="tabs-basic__wrap">
 <Button onClick={() => setActiveTab('2')}>更新面板</Button>
 <Button onClick={() => setShowDivider(!showDivider)}>
 {showDivider ? '隐藏下划线' : '显示下划线'}
 </Button>
 <Tabs
 style={{ marginTop: 16 }}
 activeId={activeTab}
 onChange={setActiveTab}
 showDivider={showDivider}
 >
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 垂直布局


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Vertical = () => {
 return (
 <> 
 <div className="tabs-vertical__wrap" style={{ marginBottom: 16 }}>
 <Tabs placement="vertical" style={{ height: 400 }}>
 {Array(48)
 .fill(undefined)
 .map((_, index) => {
 return (
 <TabPane key={index} tabId={index} tabTitle={`Tab ${index}`}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 {`Content of Tab Panel ${index}`}
 </div>
 </TabPane>
 )
 })}
 </Tabs>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs'
import Button from '@hi-ui/button' 
export const Disabled = () => {
 const [activeTab, setActiveTab] = React.useState<React.ReactText>('1')

 return (
 <> 
 <div className="tabs-disabled__wrap">
 <Button onClick={() => setActiveTab('2')}>更新面板</Button>
 <Tabs style={{ marginTop: 16 }} activeId={activeTab} onChange={setActiveTab}>
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2" disabled>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 可编辑

支持标签的增加、删除和修改


```tsx
import React from 'react'
import Popover from '@hi-ui/popover'
import Message from '@hi-ui/message'
import Button from '@hi-ui/button'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Editable = () => {
 const [tabContents, setTabContents] = React.useState<
 {
 tabId: string
 tabTitle: string
 content: string
 }[]
 >([
 {
 tabId: '1',
 tabTitle: 'Tab 1',
 content: 'Content of Tab Panel 1',
 },
 {
 tabId: '2',
 tabTitle: 'Tab 2',
 content: 'Content of Tab Panel 2',
 },

 {
 tabId: '3',
 tabTitle: 'Tab 3',
 content: 'Content of Tab Panel 3',
 },
 ])

 return (
 <> 
 <div className="tabs-editable__wrap">
 <Tabs
 editable
 showDivider
 maxTabTitleWidth={100}
 onAdded={(newTab) => {
 console.log('ADDED', newTab)
 const { tabId, tabTitle } = newTab
 const newTabId = tabId as string
 const newTabTitle = tabTitle as string

 if (newTabTitle.length > 10) {
 Message.open({
 type: 'error',
 title: '标题长度不能超过 10 个字符',
 })
 return false
 }

 return new Promise<boolean>((resolve) => {
 setTabContents([
 ...tabContents,
 {
 tabId: newTabId,
 tabTitle: newTabTitle,
 content: `Content of Tab Panel ${newTabTitle}`,
 },
 ])
 resolve(true)
 })
 }}
 onDelete={(deletedNode, evt) => {
 console.log('DELETE', deletedNode)
 return new Promise<boolean>((resolve) => {
 Popover.open(evt.currentTarget as HTMLElement, {
 key: 'delete-popover',
 content: (
 <div>
 <div>删除后，该标签下的项目也会删除</div>
 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
 <Button
 appearance="line"
 size="sm"
 onClick={() => Popover.close('delete-popover')}
 >
 取消
 </Button>
 <Button
 type="danger"
 size="sm"
 onClick={() => {
 Popover.close('delete-popover')
 setTabContents(
 tabContents.filter((item) => item.tabId !== deletedNode.tabId)
 )
 resolve(true)
 }}
 >
 确定
 </Button>
 </div>
 </div>
 ),
 onOutsideClick() {
 Popover.close('delete-popover')
 },
 })
 })
 }}
 onEdit={(value, updatedItem) => {
 console.log('EDIT', value, updatedItem)
 if (value.length > 10) {
 Message.open({
 type: 'error',
 title: '标题长度不能超过 10 个字符',
 })
 return false
 }

 return new Promise<boolean>((resolve) => {
 setTabContents(
 tabContents.map((item) => {
 if (item.tabId === updatedItem.tabId) {
 return { ...item, tabTitle: value }
 }
 return item
 })
 )
 resolve(true)
 })
 }}
 >
 {tabContents.map((item) => (
 <TabPane key={item.tabId} tabId={item.tabId} tabTitle={item.tabTitle}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 {item.content}
 </div>
 </TabPane>
 ))}
 </Tabs>
 </div>
 </>
 )
}

```


### 可编辑

支持标签的增加、删除和修改


```tsx
import React from 'react'
import Message from '@hi-ui/message'
import Button from '@hi-ui/button'
import Dropdown from '@hi-ui/dropdown'
import { EllipsisVerticalOutlined } from '@hi-ui/icons'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const EditRender = () => {
 const [tabContents, setTabContents] = React.useState<
 {
 tabId: string
 tabTitle: string
 content: React.ReactNode
 }[]
 >([
 {
 tabId: '1',
 tabTitle: 'Tab 1',
 content: <Button type="primary">Button</Button>,
 },
 {
 tabId: '2',
 tabTitle: 'Tab 2',
 content: <div>Content of Tab Panel 2</div>,
 },

 {
 tabId: '3',
 tabTitle: 'Tab 3',
 content: <div>Content of Tab Panel 3</div>,
 },
 ])

 return (
 <> 
 <div className="tabs-edit-render__wrap">
 <Tabs
 editable
 showDivider
 maxTabTitleWidth={100}
 editRender={(item, index, actions) => {
 console.log('editRender', item, index, actions)
 return (
 <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
 <Dropdown
 trigger="click"
 data={[
 {
 id: 'copy',
 title: '复制',
 },
 {
 id: 'edit',
 title: '重命名',
 },
 ...(tabContents.length > 1
 ? [
 {
 id: 'divider',
 title: '分割线',
 split: true,
 },
 {
 id: 'delete',
 title: '删除',
 },
 ]
 : []),
 ]}
 onClick={(id) => {
 if (id === 'copy') {
 actions.copy()
 // or 指定插入位置
 // actions.copy(index + 1)
 return
 }
 if (id === 'edit') {
 actions.edit()
 return
 }
 if (id === 'delete') {
 actions.delete()
 }
 }}
 >
 <Button
 type="primary"
 size="xs"
 appearance="link"
 icon={<EllipsisVerticalOutlined />}
 />
 </Dropdown>
 </div>
 )
 }}
 onAdded={(newTab) => {
 console.log('ADDED', newTab)

 const { tabId, tabTitle } = newTab
 const newTabId = tabId as string
 const newTabTitle = tabTitle as string

 if (newTabTitle.length > 10) {
 Message.open({
 type: 'error',
 title: '标题长度不能超过 10 个字符',
 })
 return false
 }

 setTabContents([
 ...tabContents,
 {
 tabId: newTabId,
 tabTitle: newTabTitle,
 content: `Content of Tab Panel ${newTabTitle}`,
 },
 ])
 }}
 onDelete={(deletedNode, evt) => {
 console.log('DELETE', deletedNode)

 setTabContents(tabContents.filter((item) => item.tabId !== deletedNode.tabId))
 }}
 onEdit={(value, updatedItem) => {
 console.log('EDIT', value, updatedItem)

 if (value.length > 10) {
 Message.open({
 type: 'error',
 title: '标题长度不能超过 10 个字符',
 })
 return false
 }

 setTabContents(
 tabContents.map((item) => {
 if (item.tabId === updatedItem.tabId) {
 return { ...item, tabTitle: value }
 }
 return item
 })
 )
 }}
 onCopy={(sourceItem, copiedItem, newItems) => {
 console.log('COPY', sourceItem, copiedItem, newItems)

 setTabContents([
 ...newItems.map((item) => ({
 tabId: item.tabId as string,
 tabTitle: item.tabTitle as string,
 content:
 tabContents.find((tab) => tab.tabId === item.tabId)?.content ??
 tabContents.find((tab) => tab.tabId === sourceItem.tabId)?.content,
 })),
 ])
 }}
 >
 {tabContents.map((item) => (
 <TabPane key={item.tabId} tabId={item.tabId} tabTitle={item.tabTitle}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 {item.content}
 </div>
 </TabPane>
 ))}
 </Tabs>
 </div>
 </>
 )
}

```


### 超出滚动

标签数量增多展示滚动条


```tsx
import React from 'react'
import Tabs from '@hi-ui/tabs' 
export const Scroll = () => {
 const [data] = React.useState(() => {
 return Array(48)
 .fill(null)
 .map((_, index) => {
 const num = index + 1
 return {
 id: num,
 title: `Tab ${num}`,
 content: (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 {`Content of Tab Panel ${num}`}
 </div>
 ),
 }
 })
 })

 return (
 <> 
 <div className="tabs-scroll__wrap" style={{ maxWidth: 1000 }}>
 <Tabs>
 {data.map((v) => {
 return (
 <Tabs.Pane key={v.id} tabId={v.id} tabTitle={v.title}>
 {v.content}
 </Tabs.Pane>
 )
 })}
 </Tabs>
 </div>
 </>
 )
}

```


### 拖拽排序

Tabs 排序功能


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Draggable = () => {
 const [activeId, setActiveId] = React.useState<React.ReactText>('1')

 const [tabContents, setTabContents] = React.useState<
 {
 tabId: string
 tabTitle: string
 content: React.ReactNode
 }[]
 >([
 {
 tabId: '1',
 tabTitle: 'Tab 1',
 content: <Button type="primary">Button</Button>,
 },
 {
 tabId: '2',
 tabTitle: 'Tab 2',
 content: <div>Content of Tab Panel 2</div>,
 },

 {
 tabId: '3',
 tabTitle: 'Tab 3',
 content: <div>Content of Tab Panel 3</div>,
 },
 ])

 return (
 <> 
 <div className="tabs-draggable__wrap">
 <Tabs
 draggable
 activeId={activeId}
 onChange={setActiveId}
 onDrop={(e, { dragNode, targetNode, direction }) => {
 console.log('DRAG DROP', e, dragNode, targetNode, direction)

 // 注意：dragNode 是接收拖拽的目标节点，targetNode 是被拖拽的节点
 const draggedNodeIndex = tabContents.findIndex(
 (item) => item.tabId === targetNode.tabId
 )
 const dropTargetIndex = tabContents.findIndex((item) => item.tabId === dragNode.tabId)

 if (draggedNodeIndex === dropTargetIndex) return

 const newTabContents = [...tabContents]
 // 从原位置移除被拖拽的节点
 const [draggedItem] = newTabContents.splice(draggedNodeIndex, 1)

 // 计算插入位置
 let insertIndex = dropTargetIndex
 // 如果被拖拽节点在目标节点前面，移除后目标索引需要减1
 if (draggedNodeIndex < dropTargetIndex) {
 insertIndex = dropTargetIndex - 1
 }

 // 根据方向调整插入位置
 if (direction === 'next') {
 insertIndex = insertIndex + 1
 }

 // 将被拖拽的节点插入到新位置
 newTabContents.splice(insertIndex, 0, draggedItem)

 setTabContents(newTabContents)
 }}
 >
 {tabContents.map((item) => (
 <TabPane key={item.tabId} tabId={item.tabId} tabTitle={item.tabTitle}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 {item.content}
 </div>
 </TabPane>
 ))}
 </Tabs>
 </div>
 </>
 )
}

```


### 卡片样式

常用于面板、卡片等局部空间


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Card = () => {
 return (
 <> 
 <div className="tabs-card__wrap" style={{ padding: 20, background: '#f8fafc' }}>
 <Tabs type="card" placement="vertical" style={{ marginBottom: 40 }}>
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#fff',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#fff',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#fff',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 <Tabs type="card" placement="horizontal">
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 胶囊样式

可用于页面的按钮式布局样式


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Button = () => {
 return (
 <> 
 <div className="tabs-basic__wrap">
 <Tabs type="button" placement="vertical" style={{ marginBottom: 40 }} draggable>
 <TabPane tabId="1" tabTitle={<div style={{ padding: '0 10px' }}>Tab1</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle={<div style={{ padding: '0 10px' }}>Tab2</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle={<div style={{ padding: '0 10px' }}>Tab3</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 <Tabs type="button" placement="horizontal" draggable>
 <TabPane tabId="1" tabTitle={<div style={{ padding: '0 10px' }}>Tab1</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle={<div style={{ padding: '0 10px' }}>Tab2</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle={<div style={{ padding: '0 10px' }}>Tab3</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 <TabPane tabId="4" tabTitle={<div style={{ padding: '0 10px' }}>Tab4</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 4
 </div>
 </TabPane>
 <TabPane tabId="5" tabTitle={<div style={{ padding: '0 10px' }}>Tab5</div>}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 5
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 带描述


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Desc = () => {
 return (
 <> 
 <div className="tabs-basic__wrap">
 <Tabs type="desc" placement="vertical" style={{ marginBottom: 40 }}>
 <TabPane tabId="1" tabTitle="Tab 1" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 <Tabs type="desc" placement="horizontal">
 <TabPane tabId="1" tabTitle="Tab 1" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3" tabDesc="关于标签的描述信息">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 大小

标签页大小


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Size = () => {
 return (
 <> 
 <div className="tabs-size__wrap">
 <h2>sm</h2>
 <Tabs style={{ marginTop: 16 }} size="sm">
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 <h2>md</h2>
 <Tabs style={{ marginTop: 16 }} size="md">
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 <h2>lg</h2>
 <Tabs style={{ marginTop: 16 }} size="lg">
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 单独使用 TabList


```tsx
import React from 'react'
import { TabList } from '@hi-ui/tabs' 
export const TabsList = () => {
 return (
 <> 
 <div className="tabs-basic__wrap">
 <TabList
 data={[
 { tabId: '0', tabTitle: '角色' },
 { tabId: '1', tabTitle: '数据' },
 ]}
 />
 </div>
 </>
 )
}

```


### 额外元素


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs'
import Button from '@hi-ui/button' 
export const Extra = () => {
 return (
 <> 
 <div className="tabs-extra__wrap">
 <Tabs extra={<Button>申请</Button>}>
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 带图标


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs'
import { MailSendOutlined, FireOutlined, StarOutlined } from '@hi-ui/icons' 
export const WithIcon = () => {
 return (
 <> 
 <div className="tabs-basic__wrap">
 <Tabs>
 <TabPane
 tabId="1"
 tabTitle={
 <span>
 <MailSendOutlined style={{ marginRight: 4 }} />
 目标
 </span>
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
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane
 tabId="2"
 tabTitle={
 <span>
 <FireOutlined style={{ marginRight: 4 }} />
 结果
 </span>
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
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane
 tabId="3"
 tabTitle={
 <span>
 <StarOutlined style={{ marginRight: 4 }} />
 复盘
 </span>
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
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 嵌套 Tabs


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const Nested = () => {
 return (
 <> 
 <div className="tabs-nested__wrap">
 <Tabs type="button" defaultActiveId={'3'} placement="vertical">
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <Tabs>
 <TabPane tabId="1" tabTitle="Sub Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Sub Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Sub Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </TabPane>
 </Tabs>
 <br />
 <br />
 <Tabs type="button" defaultActiveId={'3'}>
 <TabPane tabId="1" tabTitle="Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <Tabs placement="vertical">
 <TabPane tabId="1" tabTitle="Sub Tab 1">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Sub Tab 2">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Sub Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
 </TabPane>
 </Tabs>
 </div>
 </>
 )
}

```


### 不活跃时卸载

标签内容不活跃时默认会卸载，可以通过 `unmountOnInactive` 属性来控制是否卸载


```tsx
import React from 'react'
import { Tabs, TabPane } from '@hi-ui/tabs' 
export const UnmountOnInactive = () => {
 const [activeTab, setActiveTab] = React.useState<React.ReactText>('1')

 return (
 <> 
 <div className="tabs-unmount-on-inactive__wrap">
 <Tabs style={{ marginTop: 16 }} activeId={activeTab} onChange={setActiveTab}>
 <TabPane tabId="1" tabTitle="Tab 1" unmountOnInactive={false}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 1
 </div>
 </TabPane>
 <TabPane tabId="2" tabTitle="Tab 2" unmountOnInactive={false}>
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 2
 </div>
 </TabPane>
 <TabPane tabId="3" tabTitle="Tab 3">
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 padding: 32,
 color: '#1f2733',
 }}
 >
 Content of Tab Panel 3
 </div>
 </TabPane>
 </Tabs>
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
import Tabs, { TabsSemanticName } from '@hi-ui/tabs' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TabsSemanticName>()

 return (
 <> 
 <div className="tabs-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Tabs
 defaultActiveId="1"
 classNames={{
 root: 'my-tabs__root',
 list: 'my-tabs__list',
 content: 'my-tabs__content',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 >
 <Tabs.Pane tabId="1" tabTitle="标签一">
 内容一
 </Tabs.Pane>
 <Tabs.Pane tabId="2" tabTitle="标签二">
 内容二
 </Tabs.Pane>
 </Tabs>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'list', description: '标签列表' },
 { title: 'content', description: '内容区' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TabsSemanticName)}
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

### Tabs Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| draggable | 是否可拖拽 | boolean | true \| false | false |
| editable | 是否可编辑 | boolean | true \| false | - |
| children | 内容 | ReactElement\<any, string \| JSXElementConstructor\<any>>\[] | ReactElement\<any, string \| JSXElementConstructor\<any>>\[] | - |
| defaultActiveId | 默认高亮id | ReactText | - | - |
| activeId | 高亮id | ReactText | - | - |
| placement | 布局方向 | "horizontal" \| "vertical" | "horizontal" \| "vertical" | "horizontal" |
| type | 布局类型 | "button" \| "desc" \| "line" \| "card" | "button" \| "desc" \| "line" \| "card" | "line" |
| size | 大小 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | "md" |
| showDivider | 是否显示下划线 | boolean | true \| false | - |
| maxTabTitleWidth | 标签最大宽度 | number | - | - |
| onChange | \`activeId\` 改变的回调 | ((tabId: ReactText) => void) | - | - |
| onTabClick | 标签点击触发回调 | ((tabId: ReactText) => void) | - | - |
| extra | 右侧的拓展区域 | ReactNode | - | - |
| editRender | 标签编辑渲染 | ((item: TabPaneProps, index: number, actions: EditActions) => ReactNode) | - | - |
| onEdit | 节点编辑时触发 | ((value: string, item: TabPaneProps) => boolean \| void \| Promise\<boolean>) | (value: string, item: TabPaneProps) => boolean \| void \| Promise\<boolean> | - |
| onCopy | 节点复制时触发 | ((sourceItem: TabPaneProps, copiedItem: TabPaneProps, newItems: TabPaneProps\[]) => void) | - | - |
| onAdd | 节点增加时触发 | (() => void) | - | - |
| onAdded | 节点增加完成时触发 | ((newTab: TabPaneProps) => boolean \| void \| Promise\<boolean>) | (newTab: TabPaneProps) => boolean \| void \| Promise\<boolean> | - |
| onDelete | 节点删除时时触发 | ((deletedNode: TabPaneProps, evt: MouseEvent\<Element, MouseEvent>) => boolean \| void \| Promise\<boolean>) | (deletedNode: TabPaneProps, evt: MouseEvent\<Element, MouseEvent>) => boolean \| void \| Promise\<boolean> | - |
| onDragStart | 节点开始拖拽时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps; }) => void) | - | - |
| onDragOver | 节点拖拽移动时触发 | ((e: DragEvent\<HTMLDivElement>, { targetNode }: { targetNode: TabPaneProps; }) => void) | - | - |
| onDrop | 节点拖拽放下时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode, targetNode, direction, }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: "prev" \| "next" \| null; }) => void) | (e: DragEvent\<HTMLDivElement>, { dragNode, targetNode, direction, }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: "prev" \| "next" \| null; }) => void | - |
| onDragEnd | 节点拖拽成功时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps; }) => void) | - | - |
| classNames | | TabsSemanticClassNames | - | - |
| styles | | TabsSemanticStyles | - | - |


### TabPane Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------------- | -------------------------------------------- | --------- | ------------- | ------ |
| disabled | 标签是否禁用 | boolean | true \| false | - |
| tabId *(required)* | 每个标签的唯一标识 | ReactText | - | - |
| tabTitle *(required)* | 选项卡头显示文字 | ReactNode | - | - |
| tabDesc | 选项卡头描述文字，仅对 type='desc'时生效 | ReactNode | - | - |
| closeable | 标签是否可以关闭，仅对 type='editable'时生效 | boolean | true \| false | - |
| active | 标签是否激活 | boolean | true \| false | - |
| unmountOnInactive | 标签内容不活跃时是否卸载 | boolean | true \| false | true |


### TabList Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| data *(required)* | tabs 面板数据 | TabPaneProps\[] | - | - |
| placement | 展示布局方向 | "horizontal" \| "vertical" | "horizontal" \| "vertical" | "horizontal" |
| onChange | \`activeId\` 改变的回调 | ((tabId: ReactText) => void) | - | - |
| onTabClick | 标签点击触发回调 | ((tabId: ReactText, event: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| defaultActiveId | 默认高亮id | ReactText | - | - |
| activeId | 高亮id | ReactText | - | - |
| editable | 是否可编辑 | boolean | true \| false | - |
| draggable | 是否可拖拽 | boolean | true \| false | - |
| type | 布局类型 | "button" \| "desc" \| "line" \| "card" | "button" \| "desc" \| "line" \| "card" | "line" |
| size | 大小 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | - |
| showDivider | 是否显示下划线 | boolean | true \| false | - |
| maxTabTitleWidth | 标签最大宽度 | number | - | - |
| extra | 右侧的拓展区域 | ReactNode | - | - |
| editRender | 标签编辑渲染 | ((item: TabPaneProps, index: number, actions: EditActions) => ReactNode) | - | - |
| onAdd | 节点增加时触发 | (() => void) | - | - |
| onAdded | 节点增加完成时触发 | ((newTab: TabPaneProps) => boolean \| void \| Promise\<boolean>) | (newTab: TabPaneProps) => boolean \| void \| Promise\<boolean> | - |
| onDelete | 节点删除时时触发 | ((deletedNode: TabPaneProps, evt: MouseEvent\<Element, MouseEvent>) => boolean \| void \| Promise\<boolean>) | (deletedNode: TabPaneProps, evt: MouseEvent\<Element, MouseEvent>) => boolean \| void \| Promise\<boolean> | - |
| onEdit | 节点编辑时触发 | ((value: string, item: TabPaneProps) => boolean \| void \| Promise\<boolean>) | (value: string, item: TabPaneProps) => boolean \| void \| Promise\<boolean> | - |
| onCopy | 节点复制时触发 | ((sourceItem: TabPaneProps, copiedItem: TabPaneProps, newItems: TabPaneProps\[]) => void) | - | - |
| onDragStart | 节点开始拖拽时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps; }) => void) | - | - |
| onDragOver | 节点拖拽移动时触发 | ((e: DragEvent\<HTMLDivElement>, { targetNode }: { targetNode: TabPaneProps; }) => void) | - | - |
| onDrop | 节点拖拽放下时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode, targetNode, direction, }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: "prev" \| "next" \| null; }) => void) | (e: DragEvent\<HTMLDivElement>, { dragNode, targetNode, direction, }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: "prev" \| "next" \| null; }) => void | - |
| onDragEnd | 节点拖拽成功时触发 | ((e: DragEvent\<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps; }) => void) | - | - |
| classNames | | TabListSemanticClassNames | - | - |
| styles | | TabListSemanticStyles | - | - |

