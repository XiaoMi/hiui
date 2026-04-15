# Drawer 抽屉

模态对话框一般会中断当前任务流，在相对无信息干扰的环境下完成微型任务

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="drawer-basic__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer
 title="抽屉标题"
 visible={visible}
 onClose={() => setVisible(false)}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => setVisible(false)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => setVisible(false)}>
 确认
 </Button>
 </div>
 }
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
 </div>
 </>
 )
}

```


### 尺寸


```tsx
import React from 'react'
import Drawer, { DrawerProps } from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Size = () => {
 const [visible, setVisible] = React.useState(false)
 const [size, setSize] = React.useState<DrawerProps['size']>('sm')

 return (
 <> 
 <div className="drawer-size__wrap">
 <h2>sm</h2>
 <Button
 onClick={() => {
 setSize('sm')
 setVisible(!visible)
 }}
 >
 open
 </Button>
 <h2>md</h2>
 <Button
 onClick={() => {
 setSize('md')
 setVisible(!visible)
 }}
 >
 open
 </Button>
 <Drawer
 title="抽屉标题"
 size={size}
 visible={visible}
 onClose={() => setVisible(false)}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => setVisible(false)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => setVisible(false)}>
 确认
 </Button>
 </div>
 }
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
 </div>
 </>
 )
}

```


### 无头抽屉

title 不设置任何内容开启无头模式


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Header = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="drawer-header__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer closeable={false} visible={visible} onClose={() => setVisible(false)}>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
 </div>
 </>
 )
}

```


### 标签页头部


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button'
import { TabList } from '@hi-ui/tabs' 
export const TabsHeader = () => {
 const [visible, setVisible] = React.useState(false)
 const [activeId, setActiveId] = React.useState<React.ReactText>('1')

 const Content1 = () => {
 return <div>内容1</div>
 }

 const Content2 = () => {
 return <div>内容2</div>
 }

 const Content3 = () => {
 return <div>内容3</div>
 }

 return (
 <> 
 <div className="drawer-tabs-header__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer
 styles={{
 header: {
 padding: '0 16px',
 fontWeight: 400,
 },
 }}
 title={
 <TabList
 size="md"
 activeId={activeId}
 onChange={setActiveId}
 data={[
 { tabId: '1', tabTitle: '标签1' },
 { tabId: '2', tabTitle: '标签2' },
 { tabId: '3', tabTitle: '标签3' },
 ]}
 />
 }
 visible={visible}
 onClose={() => setVisible(false)}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => setVisible(false)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => setVisible(false)}>
 确认
 </Button>
 </div>
 }
 >
 {(() => {
 if (activeId === '1') {
 return <Content1 />
 }

 if (activeId === '2') {
 return <Content2 />
 }

 if (activeId === '3') {
 return <Content3 />
 }

 return null
 })()}
 </Drawer>
 </div>
 </>
 )
}

```


### 无蒙层


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Mask = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="drawer-mask__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer
 title="抽屉标题"
 visible={visible}
 showMask={false}
 onClose={() => setVisible(false)}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => setVisible(false)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => setVisible(false)}>
 确认
 </Button>
 </div>
 }
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
 </div>
 </>
 )
}

```


### 点击外部事件处理

常用于无蒙层模式下，切换列表项详情内容


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button'
import Tree, { TreeDataItem } from '@hi-ui/tree' 
export const OutsideClick = () => {
 const [visible, setVisible] = React.useState(false)
 const [data] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ])
 const [currentData, setCurrentData] = React.useState<TreeDataItem>()
 const wrapperRef = React.useRef<HTMLDivElement | null>(null)

 return (
 <> 
 <div className="drawer-outside-click__wrap">
 <div className="list-wrapper" ref={wrapperRef}>
 <Tree
 data={data}
 onSelect={(id, node) => {
 // console.log('node', node)

 if (id) {
 setVisible(true)
 setCurrentData(node?.raw)
 } else {
 setVisible(false)
 }
 }}
 />
 </div>
 <Drawer
 title={currentData?.title}
 visible={visible}
 showMask={false}
 onClose={() => setVisible(false)}
 // 点击列表外部内容时关闭抽屉
 onOutsideClick={(e) => {
 // console.log('target', e.target)

 console.log('dom', wrapperRef.current?.contains(e.target as Element))
 if (!wrapperRef.current?.contains(e.target as Element)) {
 setVisible(false)
 }
 }}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => setVisible(false)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => setVisible(false)}>
 确认
 </Button>
 </div>
 }
 >
 {currentData?.title}
 </Drawer>
 </div>
 </>
 )
}

```


### 局部容器抽屉

\`container` 自定义渲染抽屉的容器


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Container = () => {
 const [visible, setVisible] = React.useState(false)
 const [container, setContainer] = React.useState<any>(null)
 return (
 <> 
 <div
 ref={setContainer}
 className="drawer-container__wrap"
 style={{
 width: '100%',
 minWidth: 660,
 height: 420,
 background: '#f5f7fa',
 boxShadow: '1px 2px 8px #ddd',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',

 // Need add for it
 position: 'relative',
 overflow: 'hidden',
 zIndex: 0,
 }}
 >
 <Button type="primary" onClick={() => setVisible(!visible)}>
 open
 </Button>
 <Drawer
 title="抽屉标题"
 style={{ position: 'absolute' }}
 container={container}
 visible={visible}
 closeable={false}
 onClose={() => setVisible(false)}
 >
 我是一段文字，也可以是表单、表格、步骤条等等
 </Drawer>
 </div>
 </>
 )
}

```


### 嵌套抽屉


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Drawer from '@hi-ui/drawer' 
export const Nested = () => {
 const [visible, setVisible] = React.useState(false)
 const [nestVisible, setNestVisible] = React.useState(false)

 return (
 <> 
 <div className="Drawer-nested__wrap">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer
 title="抽屉标题"
 width={754}
 visible={visible}
 closeable={false}
 onClose={() => setVisible(false)}
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <Button style={{ marginTop: 20 }} onClick={() => setNestVisible(!nestVisible)}>
 Nested
 </Button>
 <Drawer
 title="抽屉标题"
 visible={nestVisible}
 closeable={false}
 onClose={() => setNestVisible(false)}
 >
 Nest我是一段文字，也可以是表单、表格、步骤条等等
 </Drawer>
 </Drawer>
 </div>
 </>
 )
}

```


### 顶部额外操作


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button'
import { EditOutlined } from '@hi-ui/icons' 
export const Extra = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div className="drawer-extra">
 <Button onClick={() => setVisible(!visible)}>open</Button>
 <Drawer
 title={
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>我是大标题</div>
 <Button
 style={{ marginRight: 20, flexShrink: 0, fontSize: 16 }}
 icon={<EditOutlined />}
 appearance="text"
 size="xs"
 />
 </div>
 }
 visible={visible}
 onClose={() => setVisible(false)}
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
 </div>
 </>
 )
}

```


### 出现方位

设置抽屉拉出的方向


```tsx
import React from 'react'
import Drawer from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Placement = () => {
 const [visible, setVisible] = React.useState(false)
 const [placement, setPlacement] = React.useState<any>('tpp')

 return (
 <> 
 <div className="drawer-placement__wrap">
 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td></td>
 <td>
 <Button
 style={{ width: 100 }}
 onClick={() => {
 setPlacement('top')
 setVisible(true)
 }}
 >
 top
 </Button>
 </td>
 <td></td>
 <td></td>
 </tr>
 <tr>
 <td></td>
 <td></td>
 <td></td>
 <td></td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Button
 style={{ width: 100 }}
 onClick={() => {
 setPlacement('left')
 setVisible(true)
 }}
 >
 left
 </Button>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Button
 style={{ width: 100 }}
 onClick={() => {
 setPlacement('right')
 setVisible(true)
 }}
 >
 right
 </Button>
 </td>
 </tr>
 <tr>
 <td></td>
 <td></td>
 <td></td>
 <td></td>
 <td></td>
 </tr>
 <tr>
 <td></td>
 <td></td>
 <td>
 <Button
 style={{ width: 100 }}
 onClick={() => {
 setPlacement('bottom')
 setVisible(true)
 }}
 >
 bottom
 </Button>
 </td>
 <td></td>
 <td></td>
 </tr>
 </tbody>
 </table>

 <Drawer
 title="抽屉标题"
 visible={visible}
 placement={placement}
 onClose={() => setVisible(false)}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line" key={1} onClick={() => console.log(2)}>
 取消
 </Button>
 <Button type="primary" key={0} onClick={() => console.log(1)}>
 确认
 </Button>
 </div>
 }
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
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
import Drawer, { DrawerSemanticName } from '@hi-ui/drawer'
import Button from '@hi-ui/button' 
export const Semantic = () => {
 const [selected, setSelected] = useState<DrawerSemanticName>()
 const [container, setContainer] = useState<HTMLDivElement | null>(null)

 return (
 <> 
 <div className="drawer-semantic__wrap">
 <Row gutter={12}>
 <Col span={18} ref={setContainer} style={{ position: 'relative', zIndex: 0 }}>
 <Drawer
 title="抽屉标题"
 visible
 placement="left"
 container={container}
 style={{
 position: 'absolute',
 overflow: 'unset',
 left: 1,
 top: 1,
 right: 1,
 bottom: 10,
 }}
 footer={
 <div style={{ textAlign: 'right' }}>
 <Button type="default" appearance="line">
 取消
 </Button>
 <Button type="primary">确认</Button>
 </div>
 }
 classNames={{
 root: 'my-drawer__root',
 overlay: 'my-drawer__overlay',
 wrapper: 'my-drawer__wrapper',
 header: 'my-drawer__header',
 title: 'my-drawer__title',
 close: 'my-drawer__close',
 body: 'my-drawer__body',
 footer: 'my-drawer__footer',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 overflow: 'unset',
 },
 }}
 >
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
 </Drawer>
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
 title: 'overlay',
 description: '蒙层元素',
 },
 {
 title: 'wrapper',
 description: '抽屉包装器',
 },
 {
 title: 'header',
 description: '头部元素',
 },
 {
 title: 'title',
 description: '标题元素',
 },
 {
 title: 'close',
 description: '关闭按钮',
 },
 {
 title: 'body',
 description: '主体内容',
 },
 {
 title: 'footer',
 description: '底部元素',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as DrawerSemanticName)
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


### 命令式 API

通过 Drawer.open / Drawer.close 以命令方式打开和关闭抽屉；支持 confirm/cancel；若需在抽屉内容中访问 React Context，请使用 Drawer.useDrawer


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Drawer from '@hi-ui/drawer' 
export const WithAPI = () => {
 return (
 <> 
 <div className="drawer-with-api__wrap" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 <Button
 type="secondary"
 onClick={() => {
 Drawer.open({
 title: '抽屉标题',
 content: '这是通过 Drawer.open 打开的抽屉内容',
 placement: 'right',
 })
 }}
 >
 打开抽屉
 </Button>

 <Button
 type="secondary"
 onClick={() =>
 Drawer.open({
 title: '带确定/取消',
 content: '执行该操作后将无法撤销，是否确定继续？',
 placement: 'right',
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 带确定/取消
 </Button>

 <Button
 type="secondary"
 onClick={() =>
 Drawer.open({
 title: '异步确认关闭',
 content: '点击确定后将延迟 1 秒再关闭',
 placement: 'right',
 cancelText: '取消',
 confirmText: '确定',
 onConfirm: async () => {
 return new Promise((resolve) => setTimeout(resolve, 1000))
 },
 closeable: false,
 })
 }
 >
 异步确认关闭
 </Button>
 </div>
 </>
 )
}

```


### Context 访问

可通过 Drawer.useDrawer 在使用 api 式调用时，访问外层 Context


```tsx
import React, { useContext, useState } from 'react'
import Button from '@hi-ui/button'
import Drawer from '@hi-ui/drawer' 
export const Context = () => {
 const [ThemeContext] = useState(() => React.createContext<string>('light'))
 const ThemeConsumer = () => {
 const theme = useContext(ThemeContext)
 return <span>当前主题: {theme}</span>
 }

 const [drawer, contextHolder] = Drawer.useDrawer()

 return (
 <ThemeContext.Provider value="dark">
 <div> 
 <p>将 contextHolder 放在 ThemeContext.Provider 内，抽屉内容区域可正常获取外部 Context</p>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
 <Button
 type="primary"
 onClick={() =>
 drawer.open({
 title: 'useDrawer 可访问 Context',
 content: (
 <div>
 <ThemeConsumer />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
 将显示默认值「当前主题: dark」
 </p>
 </div>
 ),
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 使用 useDrawer
 </Button>
 <Button
 type="secondary"
 appearance="line"
 onClick={() =>
 Drawer.open({
 title: '静态 API 无法访问 Context',
 content: (
 <div>
 <ThemeConsumer />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
 将显示默认值，因为创建了新 React 根
 </p>
 </div>
 ),
 cancelText: '取消',
 confirmText: '确定',
 closeable: false,
 })
 }
 >
 使用 Drawer.open
 </Button>
 </div>
 {contextHolder}
 </div>
 </ThemeContext.Provider>
 )
}

```


## Props

### Drawer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ----------------------------------------------------------- | ------------------------ | -------------------------------------- | ------ |
| title | 模态框标题 | ReactNode | - | - |
| footer | 自定义抽屉底部 | ReactNode | - | - |
| showMask | 是否显示蒙层 | boolean | true \| false | - |
| width | 自定义抽屉宽度，仅在 placement="left" \| "right" 有效 | string \| number | string \| number | - |
| height | 自定义抽屉高度，仅在 placement="bottom" \| "top" 有效 | string \| number | string \| number | - |
| size | 头部大小 | "sm" \| "md" | "sm" \| "md" | - |
| zIndex | 自定义css展示层级 | number | - | - |
| preload | 开启预加载渲染，用于性能优化，优先级小于 \`unmountOnClose\` | boolean | true \| false | - |
| unmountOnClose | 开启关闭时销毁，用于性能优化，优先级大于 \`preload\` | boolean | true \| false | - |
| onClose | 关闭事件触发时的回调 | (() => void) | - | - |
| container | 指定 portal 的容器 | HTMLElement \| null | null \| HTMLElement | - |
| placement | 设置唤起的方向 | DrawerPlacementEnum | "left" \| "right" \| "top" \| "bottom" | - |
| closeable | 是否展示右上角关闭按钮 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: Event) => void) | - | - |
| closeIcon | 自定义关闭按钮 | ReactNode | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| visible | 是否弹出显示 | boolean | true \| false | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| maskClosable | 开启点击蒙层时关闭 | boolean | true \| false | - |
| classNames | | DrawerSemanticClassNames | - | - |
| styles | | DrawerSemanticStyles | - | - |

