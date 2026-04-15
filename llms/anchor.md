# Anchor 锚点

通过锚点可快速找到信息内容在当前页面的位置。

## 使用示例

### 基础用法

通过滚动或点击触发锚点节点的切换，需要注意 href 设置的是元素的 id 属性 `#id`


```tsx
import React from 'react'
import Anchor, { AnchorItem } from '@hi-ui/anchor' 
export const Basic = () => {
 const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

 const scrollAreaNode = (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 height: '400px',
 lineHeight: '400px',
 color: '#1f2733',
 }}
 >
 Scroll Area
 </div>
 )

 return (
 <> 
 <div className="anchor-basic__wrap" style={{ display: 'flex', minWidth: 660 }}>
 <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
 <AnchorItem href="#test-basic-h1-1" title="容器化部署"></AnchorItem>
 <AnchorItem href="#test-basic-h1-2" title="主要优点"></AnchorItem>
 <AnchorItem href="#test-basic-h1-3" title="部署前准备"></AnchorItem>
 <AnchorItem href="#test-basic-h1-4" title="发布模拟"></AnchorItem>
 <AnchorItem href="#test-basic-h1-5" title="其它部署方式"></AnchorItem>
 </Anchor>
 <div
 ref={setContainerElement}
 style={{
 overflow: 'scroll',
 maxHeight: 320,
 border: '1px solid #f5f7fa',
 padding: '0 24px',
 flex: 1,
 }}
 >
 <h2 id="test-basic-h1-1">容器化部署</h2>
 {scrollAreaNode}
 <h2 id="test-basic-h1-2">主要优点</h2>
 {scrollAreaNode}
 <h2 id="test-basic-h1-3">部署前准备</h2>
 {scrollAreaNode}
 <h2 id="test-basic-h1-4">发布模拟</h2>
 {scrollAreaNode}
 <h2 id="test-basic-h1-5">其它部署方式</h2>
 {scrollAreaNode}
 </div>
 </div>
 </>
 )
}

```


### 设置滚动偏移量

通过 `offset` 指定锚点节点触发的滚动偏移量，负值表示提前触发


```tsx
import React from 'react'
import Anchor, { AnchorItem } from '@hi-ui/anchor' 
export const Offset = () => {
 const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

 const scrollAreaNode = (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 height: '400px',
 lineHeight: '400px',
 color: '#1f2733',
 }}
 >
 Scroll Area
 </div>
 )

 return (
 <> 
 <div className="anchor-offset__wrap" style={{ display: 'flex', minWidth: 660 }}>
 <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
 <AnchorItem href="#test-offset-h1-1" title="容器化部署"></AnchorItem>
 <AnchorItem href="#test-offset-h1-2" title="主要优点" offset={-100}></AnchorItem>
 <AnchorItem href="#test-offset-h1-3" title="部署前准备"></AnchorItem>
 <AnchorItem href="#test-offset-h1-4" title="发布模拟"></AnchorItem>
 <AnchorItem href="#test-offset-h1-5" title="其它部署方式"></AnchorItem>
 </Anchor>
 <div
 ref={setContainerElement}
 style={{
 overflow: 'scroll',
 maxHeight: 320,
 border: '1px solid #f5f7fa',
 padding: '0 24px',
 flex: 1,
 }}
 >
 <h2 id="test-offset-h1-1">容器化部署</h2>
 {scrollAreaNode}
 <h2 id="test-offset-h1-2">主要优点</h2>
 {scrollAreaNode}
 <h2 id="test-offset-h1-3">部署前准备</h2>
 {scrollAreaNode}
 <h2 id="test-offset-h1-4">发布模拟</h2>
 {scrollAreaNode}
 <h2 id="test-offset-h1-5">其它部署方式</h2>
 {scrollAreaNode}
 </div>
 </div>
 </>
 )
}

```


### 多级树形锚点

作为 `AnchorItem` 的子节点传入，扩展树形锚点的层级


```tsx
import React from 'react'
import Anchor, { AnchorItem } from '@hi-ui/anchor' 
export const Children = () => {
 const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

 const scrollAreaNode = (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 height: '400px',
 lineHeight: '400px',
 color: '#1f2733',
 }}
 >
 Scroll Area
 </div>
 )

 return (
 <> 
 <div className="anchor-children__wrap" style={{ display: 'flex', minWidth: 660 }}>
 <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
 <AnchorItem href="#test-children-h1-1" title="容器化部署"></AnchorItem>
 <AnchorItem href="#test-children-h1-2" title="主要优点"></AnchorItem>
 <AnchorItem href="#test-children-h1-3" title="部署前准备">
 <AnchorItem href="#test-children-h1-4" title="申请部署空间"></AnchorItem>
 <AnchorItem href="#test-children-h1-5" title="CI变量配置"></AnchorItem>
 </AnchorItem>
 <AnchorItem href="#test-children-h1-6" title="发布模拟"></AnchorItem>
 </Anchor>
 <div
 ref={setContainerElement}
 style={{
 overflow: 'scroll',
 maxHeight: 320,
 border: '1px solid #f5f7fa',
 padding: '0 24px',
 flex: 1,
 }}
 >
 <h2 id="test-children-h1-1">容器化部署</h2>
 {scrollAreaNode}
 <h2 id="test-children-h1-2">主要优点</h2>
 {scrollAreaNode}
 <h2 id="test-children-h1-3">部署前准备</h2>
 {scrollAreaNode}
 <h3 id="test-children-h1-4">申请部署空间</h3>
 {scrollAreaNode}
 <h3 id="test-children-h1-5">CI变量配置</h3>
 <div style={{ height: 300 }}></div>
 <h2 id="test-children-h1-6">发布模拟</h2>
 {scrollAreaNode}
 </div>
 </div>
 </>
 )
}

```


### 文本溢出

锚点文字不建议太长，超出会溢出展示


```tsx
import React from 'react'
import Anchor, { AnchorItem } from '@hi-ui/anchor' 
export const Overflow = () => {
 const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

 const scrollAreaNode = (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 height: '400px',
 lineHeight: '400px',
 color: '#1f2733',
 }}
 >
 Scroll Area
 </div>
 )

 return (
 <> 
 <div className="anchor-overflow__wrap" style={{ display: 'flex', minWidth: 660 }}>
 <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
 <AnchorItem href="#test-overflow-h1-1" title="一级目录1号"></AnchorItem>
 <AnchorItem href="#test-overflow-h1-2" title="一级目录2号"></AnchorItem>
 <AnchorItem href="#test-overflow-h1-3" title="一级目录3号"></AnchorItem>
 <AnchorItem href="#test-overflow-h1-4" title="一级目录4号字数较多字数较多"></AnchorItem>
 <AnchorItem href="#test-overflow-h1-5" title="一级目录5号"></AnchorItem>
 </Anchor>
 <div
 ref={setContainerElement}
 style={{
 overflow: 'scroll',
 maxHeight: 320,
 border: '1px solid #f5f7fa',
 padding: '0 24px',
 flex: 1,
 }}
 >
 <h2 id="test-overflow-h1-1">一级目录1号</h2>
 {scrollAreaNode}
 <h2 id="test-overflow-h1-2">一级目录2号</h2>
 {scrollAreaNode}
 <h2 id="test-overflow-h1-3">一级目录3号</h2>
 {scrollAreaNode}
 <h2 id="test-overflow-h1-4">一级目录4号字数较多字数较多</h2>
 {scrollAreaNode}
 <h2 id="test-overflow-h1-5">一级目录5号</h2>
 {scrollAreaNode}
 </div>
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
import Anchor, { AnchorItem } from '@hi-ui/anchor' 
export const Semantic = () => {
 const [selectedAnchor, setSelectedAnchor] = useState<'root' | 'list' | 'ink' | 'link'>()
 const [selectedAnchorItem, setSelectedAnchorItem] = useState<'root' | 'link'>()
 const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

 const scrollAreaNode = (
 <div
 style={{
 backgroundColor: '#f5f7fa',
 textAlign: 'center',
 height: '500px',
 lineHeight: '400px',
 color: '#1f2733',
 }}
 >
 Scroll Area
 </div>
 )

 return (
 <> 
 <div className="anchor-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <div style={{ display: 'flex', gap: 12 }}>
 <Anchor
 classNames={{
 root: 'my-anchor__root',
 list: 'my-anchor__list',
 ink: 'my-anchor__ink',
 }}
 styles={{
 [selectedAnchor as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 container={containerElement}
 offset={-20}
 >
 <AnchorItem
 styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
 href="#test-semantic-h1-1"
 title="容器化部署"
 ></AnchorItem>
 <AnchorItem
 styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
 href="#test-semantic-h1-2"
 title="主要优点"
 ></AnchorItem>
 <AnchorItem
 styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
 href="#test-semantic-h1-3"
 title="部署前准备"
 ></AnchorItem>
 <AnchorItem
 styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
 href="#test-semantic-h1-4"
 title="发布模拟"
 ></AnchorItem>
 <AnchorItem
 styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
 href="#test-semantic-h1-5"
 title="其它部署方式"
 ></AnchorItem>
 </Anchor>
 <div
 ref={setContainerElement}
 style={{
 overflow: 'scroll',
 maxHeight: 520,
 border: '1px solid #f5f7fa',
 padding: '0 12px',
 flex: 1,
 }}
 >
 <h2 id="test-semantic-h1-1">容器化部署</h2>
 {scrollAreaNode}
 <h2 id="test-semantic-h1-2">主要优点</h2>
 {scrollAreaNode}
 <h2 id="test-semantic-h1-3">部署前准备</h2>
 {scrollAreaNode}
 <h2 id="test-semantic-h1-4">发布模拟</h2>
 {scrollAreaNode}
 <h2 id="test-semantic-h1-5">其它部署方式</h2>
 {scrollAreaNode}
 </div>
 </div>
 </Col>
 <Col span={6}>
 <h2>Anchor</h2>
 <List
 split={false}
 data={[
 {
 title: 'root',
 description: '根元素',
 },
 {
 title: 'list',
 description: '列表区域',
 },
 {
 title: 'ink',
 description: '指示器',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelectedAnchor(dataItem.title as any)
 }}
 onMouseLeave={() => {
 setSelectedAnchor(undefined)
 }}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 <h2>AnchorItem</h2>
 <List
 split={false}
 data={[
 {
 title: 'root',
 description: '根元素',
 },
 {
 title: 'link',
 description: '链接区域',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelectedAnchorItem(dataItem.title as any)
 }}
 onMouseLeave={() => {
 setSelectedAnchorItem(undefined)
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

### Anchor Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ | ------ |
| container | 指定触发滚动的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| offset | 滚动至距离目标锚点位置指定的偏移量 \`offset\` 时触发 | number | - | - |
| onChange | 锚点切换时触发 | ((href: string) => void) | - | - |
| classNames | | AnchorSemanticClassNames | - | - |
| styles | | AnchorSemanticStyles | - | - |


### AnchorItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ----------------------------------------------------------------------------------------- | ---------------------------- | ------ | ------ |
| title | 锚点项标题内容 | ReactNode | - | - |
| children | 下一级锚点节点列表，可传入 \`AnchorItem\` | ReactNode | - | - |
| href | 设置锚点的跳转链接 | string | - | - |
| offset | 滚动至距离目标锚点位置指定的偏移量 \`offset\` 时触发，优先级高于 \`AnchorProps\` 中的设置 | number | - | - |
| classNames | | AnchorItemSemanticClassNames | - | - |
| styles | | AnchorItemSemanticStyles | - | - |

