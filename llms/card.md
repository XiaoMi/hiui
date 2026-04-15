# Card 卡片

用来展示不同类型信息或信息组的轻量容器

## 使用示例

### 基础用法

用卡片封装独立的信息实体，如模块、功能、项目、应用等，或还原实际生活中的卡片应用


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const Basic = () => {
 return (
 <> 
 <div className="card-basic__wrap">
 <Card title="标题" size="sm">
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 <br />
 <br />
 <Card title="标题" showHeaderDivider>
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 不同尺寸

为卡片定义了 2 种尺寸，根据页面的实际空间选用紧凑程度


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import Card from '@hi-ui/card' 
export const Size = () => {
 return (
 <> 
 <div className="card-size__wrap">
 <h2>紧凑</h2>
 <Card
 title="标题"
 size="sm"
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 <h2>常规</h2>
 <Card
 title="标题"
 size="md"
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 <br />
 <h2>大尺寸</h2>
 <Card
 title="标题"
 size="lg"
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>

 <h2>不同尺寸嵌套</h2>
 <Card title="大尺寸" size="lg">
 <Card title="常规">
 <Card title="紧凑" size="sm">
 <div
 style={{
 height: 80,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </Card>
 </Card>
 </div>
 </>
 )
}

```


### 带操作用法

可对卡片进行编辑、删除等操作


```tsx
import React from 'react'
import Card from '@hi-ui/card'
import Button from '@hi-ui/button' 
export const Extra = () => {
 return (
 <> 
 <div className="card-extra__wrap">
 <Card
 title="标题"
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 <br />
 <br />
 <Card
 title="标题"
 showHeaderDivider
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 带副标题


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import Card from '@hi-ui/card' 
export const Subtitle = () => {
 return (
 <> 
 <div className="card-subtitle__wrap">
 <Card
 title="标题"
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 subtitle="这是一句简要的卡片副标题"
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 <br />
 <br />
 <Card
 title="标题"
 showHeaderDivider
 extra={
 <Button type="primary" appearance="link">
 链接
 </Button>
 }
 subtitle="这是一句简要的卡片副标题"
 >
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 无标题卡片


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const NoHeader = () => {
 return (
 <> 
 <div className="card-no-header__wrap">
 <Card>
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 文本卡片


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const TextCard = () => {
 return (
 <> 
 <div
 className="card-no-header__wrap"
 style={{ padding: 32, backgroundColor: 'rgb(243, 244, 247)' }}
 >
 <Card>
 <div style={{ lineHeight: '24px', fontSize: 16, color: '#1A1D26', fontWeight: 500 }}>
 标题
 </div>
 <div style={{ lineHeight: '20px', fontSize: 12, color: '#606366' }}>这里是辅助描述</div>
 <div style={{ lineHeight: '22px', fontSize: 14, color: '#606366', marginTop: 12 }}>
 这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 带头图

卡片中加入图片，增强识别性，常用于描述应用、项目等


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const Img = () => {
 const [list] = React.useState(() => {
 return new Array(6).fill({
 image: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png',
 title: '此处展示商品名称',
 content: '此处展示商品相关描述信息',
 })
 })
 return (
 <> 
 <div className="card-img__wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
 {list.map((item, index) => {
 return (
 <Card
 key={index}
 style={{
 width: 256,
 // height: 398,
 }}
 title={item.title}
 coverUrl={item.image}
 >
 <span style={{ fontSize: 12, color: '#60636b' }}>{item.content}</span>
 </Card>
 )
 })}
 </div>
 </>
 )
}

```


### 无边框


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const NoBordered = () => {
 return (
 <> 
 <div
 className="card-no-header__wrap"
 style={{ padding: 32, backgroundColor: 'rgb(243, 244, 247)' }}
 >
 <Card bordered={false} title="我是标题">
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### hover 效果


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const Hoverable = () => {
 return (
 <> 
 <div className="card-hoverable__wrap">
 <Card hoverable>
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 >
 此处展示卡片内容
 </div>
 </Card>
 </div>
 </>
 )
}

```


### 加载中状态


```tsx
import React from 'react'
import Card from '@hi-ui/card' 
export const Loading = () => {
 return (
 <> 
 <div className="card-loading__wrap">
 <Card title="标题" loading>
 <div
 style={{
 height: 174,
 backgroundColor: '#F5F8FC',
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 }}
 ></div>
 </Card>
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
import Card from '@hi-ui/card'
import Button from '@hi-ui/button' 
export const Semantic = () => {
 const [selected, setSelected] = useState<
 'root' | 'cover' | 'header' | 'head' | 'title' | 'extra' | 'subhead' | 'body'
 >()

 return (
 <> 
 <div className="card-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <h2>普通用法</h2>
 <Card
 title="卡片标题"
 subtitle="卡片副标题"
 extra={<Button type="primary">操作</Button>}
 style={{ width: '80%', overflow: 'unset' }}
 classNames={{
 root: 'my-card__root',
 cover: 'my-card__cover',
 header: 'my-card__header',
 head: 'my-card__head',
 title: 'my-card__title',
 extra: 'my-card__extra',
 subhead: 'my-card__subhead',
 body: 'my-card__body',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 coverUrl="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png"
 >
 <div>卡片内容</div>
 </Card>
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
 title: 'cover',
 description: '封面元素',
 },
 {
 title: 'header',
 description: '头部区域',
 },
 {
 title: 'head',
 description: '头部标题和额外内容区域',
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
 title: 'subhead',
 description: '副标题元素',
 },
 {
 title: 'body',
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

 <h2>函数用法</h2>
 <Card
 title="卡片标题"
 extra={<Button type="primary">操作</Button>}
 classNames={(info) => {
 if (info.props.hoverable) {
 return {
 root: 'my-card__root--hoverable',
 header: 'my-card__header--hoverable',
 }
 }
 return {}
 }}
 styles={(info) => {
 if (info.props.hoverable) {
 return {
 root: {
 borderRadius: 4,
 },
 }
 }
 return {}
 }}
 hoverable
 >
 <div>卡片内容</div>
 </Card>
 </div>
 </>
 )
}

```


## Props

### Card Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | -------------------------------- | ---------------------- | --------------------------- | ------ |
| title | 卡片标题 | ReactNode | - | - |
| bordered | 是否展示边框 | boolean | true \| false | true |
| loading | 是否展示加载状态 | boolean | true \| false | - |
| hoverable | 鼠标移入卡片时是否显示阴影 | boolean | true \| false | false |
| extra | 标题右侧的拓展区域 | ReactNode | - | - |
| cover | 卡片的封面 | ReactNode | - | - |
| coverUrl | 卡片的封面的图片链接 | string | - | - |
| size | 卡片的尺寸 | CardSizeEnum | Omit\<HiBaseSizeEnum, "xs"> | - |
| showHeaderDivider | 是否展示卡片头部和内容区域分割线 | boolean | true \| false | - |
| children | 内容区域 | ReactNode | - | - |
| classNames | | CardSemanticClassNames | - | - |
| styles | | CardSemanticStyles | - | - |

