# Descriptions 描述列表

展示只读性字段，一般用于详情页的信息展示。

## 使用示例

### 基础用法

Descriptions 结合 Descriptions.Item 完成描述列表的动态配置


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const Basic = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions>
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 通过Data 数组配置

Descriptions 通过 data api 描述 Item 信息


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const Config = () => {
 const data = [
 {
 label: '满江红',
 value: '怒发冲冠',
 },
 {
 label: '靖康耻，犹未雪',
 value: '臣子恨，何时灭',
 },
 {
 label: '驾长车',
 value: '踏破贺兰山缺',
 },
 {
 label: '壮志饥餐胡虏肉',
 value: '笑谈渴饮匈奴血',
 },
 {
 label: '待从头',
 value: '收拾旧山河',
 },
 {
 label: '朝天阙',
 value: '结束',
 },
 ]

 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions data={data} />
 </div>
 </>
 )
}

```


### 超出展示省略号

Descriptions 配合 EllipsisTooltip 组件，形成超出展示省略号功能


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const Ellipsis = () => {
 const data = [
 {
 // 超出宽度限制才会展示，没有超出不展示
 label: <EllipsisTooltip>满江红</EllipsisTooltip>,
 value: '怒发冲冠',
 },
 {
 label: <EllipsisTooltip>靖康耻，犹未雪。</EllipsisTooltip>,
 labelWidth: 100,
 value: '臣子恨，何时灭。臣子恨，何时灭。',
 },
 {
 label: '驾长车',
 value: '踏破贺兰山缺',
 },
 {
 label: '壮志饥餐胡虏肉',
 value: '笑谈渴饮匈奴血',
 },
 {
 label: '待从头',
 labelWidth: 100,
 value: <EllipsisTooltip>收拾旧山河，收拾旧山河，收拾旧山河，收拾旧山河</EllipsisTooltip>,
 },
 {
 label: '朝天阙',
 value: '结束',
 },
 ]

 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions data={data} />
 </div>
 </>
 )
}

```


### 带边框的

设置 `appearance` 控制描述列表组件的展现形态


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const Bordered = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions appearance="table">
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2" colSpan={2}>
 100000022220
 </Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### label对齐方式

通过设置 `labelPlacement` 控制 label 的对齐方式


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const LabelPlacement = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <h2>默认外形：右对齐</h2>
 <Descriptions labelPlacement="right">
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2" colSpan={2}>
 100000022220
 </Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>

 <h2>表格外形：右对齐</h2>
 <Descriptions appearance="table" labelPlacement="right">
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 设置标签和内容对齐方式


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions'
import Preview from '@hi-ui/preview'
import { JpgColorful } from '@hi-ui/icons'
import Button from '@hi-ui/button' 
export const ContentPosition = () => {
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 ])
 const [visible, setVisible] = React.useState(false)
 const [current, setCurrent] = React.useState(0)

 return (
 <> 
 <div className="descriptions-content-position__wrap">
 <h2>md</h2>
 <Descriptions contentPosition="center" columnGap={24}>
 <Descriptions.Item label="机构类型" labelWidth={84}>
 第三方网点
 </Descriptions.Item>
 <Descriptions.Item label="主子站类型" labelWidth={84}>
 主站
 </Descriptions.Item>
 <Descriptions.Item label="机构状态" labelWidth={84}>
 有效
 </Descriptions.Item>
 <Descriptions.Item label="机构名称" labelWidth={84}>
 某某有限公司
 </Descriptions.Item>
 <Descriptions.Item label="是否自营" labelWidth={84}>
 是
 </Descriptions.Item>
 <Descriptions.Item label="实体门店招牌" labelWidth={84}>
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <Button type="primary" appearance="link" icon={<JpgColorful />}>
 主站.jpg
 </Button>
 </div>
 </Descriptions.Item>
 <Descriptions.Item label="备注信息" labelWidth={84}>
 备注内容可能会非常长备注内容可能会非常长备注内容可能会非常长
 </Descriptions.Item>
 <Descriptions.Item label="维度名称常规" labelWidth={84}>
 <img
 src={images[0]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(0)
 setVisible(true)
 }}
 />
 <img
 src={images[1]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(1)
 setVisible(true)
 }}
 />
 <img
 src={images[2]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer' }}
 onClick={() => {
 setCurrent(2)
 setVisible(true)
 }}
 />
 </Descriptions.Item>
 </Descriptions>

 <Preview
 title={`${current + 1}/${images.length}`}
 src={images}
 current={current}
 onPreviewChange={setCurrent}
 visible={visible}
 onClose={() => {
 setVisible(false)
 }}
 />
 </div>
 </>
 )
}

```


### 自定义列数

支持一栏至四栏平均分布


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const Col = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions column={2}>
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 上下布局

支持 label 和 content 上下布局形式进行展示


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const Vertical = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions placement="vertical">
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 垂直带边框


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const VerticalBorder = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions placement="vertical" appearance="table">
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 固定label宽度

根据实际情况配置label宽度，一个页面中label宽度应该保持一致


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions' 
export const LabelWidth = () => {
 return (
 <> 
 <div className="descriptions-basic__wrap">
 <Descriptions labelPlacement="right">
 <Descriptions.Item label="名字" labelWidth="100px">
 张三
 </Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2" colSpan={2}>
 100000022220
 </Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 <Descriptions labelPlacement="right">
 <Descriptions.Item label="label名称很长很长" labelWidth="100px" labelPlacement="left">
 张三
 </Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2" colSpan={2}>
 100000022220
 </Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
 </Descriptions>
 </div>
 </>
 )
}

```


### 设置大小


```tsx
import React from 'react'
import Descriptions from '@hi-ui/descriptions'
import Preview from '@hi-ui/preview'
import { JpgColorful } from '@hi-ui/icons' 
export const Size = () => {
 const [images] = React.useState([
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
 ])
 const [visible, setVisible] = React.useState(false)
 const [current, setCurrent] = React.useState(0)

 return (
 <> 
 <div className="descriptions-size__wrap">
 <h2>md</h2>
 <Descriptions size="md">
 <Descriptions.Item label="机构类型" labelWidth={84}>
 第三方网点
 </Descriptions.Item>
 <Descriptions.Item label="主子站类型" labelWidth={84}>
 主站
 </Descriptions.Item>
 <Descriptions.Item label="机构状态" labelWidth={84}>
 有效
 </Descriptions.Item>
 <Descriptions.Item label="机构名称" labelWidth={84}>
 某某有限公司
 </Descriptions.Item>
 <Descriptions.Item label="是否自营" labelWidth={84}>
 是
 </Descriptions.Item>
 <Descriptions.Item label="实体门店招牌" labelWidth={84}>
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <JpgColorful style={{ fontSize: 16 }} />
 <a href="#" style={{ textDecoration: 'none', color: '#4a9eff' }}>
 主站.jpg
 </a>
 </div>
 </Descriptions.Item>
 <Descriptions.Item label="备注信息" labelWidth={84} colSpan={2}>
 备注内容可能会非常长备注内容可能会非常长备注内容可能会非常长
 </Descriptions.Item>
 <Descriptions.Item label="维度名称常规" labelWidth={84}>
 <img
 src={images[0]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(0)
 setVisible(true)
 }}
 />
 <img
 src={images[1]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(1)
 setVisible(true)
 }}
 />
 <img
 src={images[2]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer' }}
 onClick={() => {
 setCurrent(2)
 setVisible(true)
 }}
 />
 </Descriptions.Item>
 </Descriptions>
 <h2>sm</h2>
 <Descriptions size="sm">
 <Descriptions.Item label="机构类型" labelWidth={84}>
 第三方网点
 </Descriptions.Item>
 <Descriptions.Item label="主子站类型" labelWidth={84}>
 主站
 </Descriptions.Item>
 <Descriptions.Item label="机构状态" labelWidth={84}>
 有效
 </Descriptions.Item>
 <Descriptions.Item label="机构名称" labelWidth={84}>
 某某有限公司
 </Descriptions.Item>
 <Descriptions.Item label="是否自营" labelWidth={84}>
 是
 </Descriptions.Item>
 <Descriptions.Item label="实体门店招牌" labelWidth={84}>
 <div style={{ display: 'flex', alignItems: 'center' }}>
 <JpgColorful style={{ fontSize: 16 }} />
 <a href="#" style={{ textDecoration: 'none', color: '#4a9eff' }}>
 主站.jpg
 </a>
 </div>
 </Descriptions.Item>
 <Descriptions.Item label="备注信息" labelWidth={84} colSpan={2}>
 备注内容可能会非常长备注内容可能会非常长备注内容可能会非常长
 </Descriptions.Item>
 <Descriptions.Item label="维度名称常规" labelWidth={84}>
 <img
 src={images[0]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(0)
 setVisible(true)
 }}
 />
 <img
 src={images[1]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
 onClick={() => {
 setCurrent(1)
 setVisible(true)
 }}
 />
 <img
 src={images[2]}
 style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer' }}
 onClick={() => {
 setCurrent(2)
 setVisible(true)
 }}
 />
 </Descriptions.Item>
 </Descriptions>

 <Preview
 title={`${current + 1}/${images.length}`}
 src={images}
 current={current}
 onPreviewChange={setCurrent}
 visible={visible}
 onClose={() => {
 setVisible(false)
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
import Descriptions, { DescriptionsSemanticName } from '@hi-ui/descriptions' 
export const Semantic = () => {
 const [selected, setSelected] = useState<DescriptionsSemanticName>()

 return (
 <> 
 <div className="descriptions-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Descriptions
 classNames={{
 root: 'my-descriptions__root',
 table: 'my-descriptions__table',
 tbody: 'my-descriptions__tbody',
 cell: 'my-descriptions__cell',
 label: 'my-descriptions__label',
 content: 'my-descriptions__content',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <Descriptions.Item label="名字">张三</Descriptions.Item>
 <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
 <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
 <Descriptions.Item label="Money1">100000000</Descriptions.Item>
 <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
 <Descriptions.Item label="Money3">
 <div>test</div>
 </Descriptions.Item>
 </Descriptions>
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
 title: 'table',
 description: '表格元素',
 },
 {
 title: 'tbody',
 description: '表格体元素',
 },
 {
 title: 'cell',
 description: '单元格元素',
 },
 {
 title: 'label',
 description: '标签元素',
 },
 {
 title: 'content',
 description: '内容元素',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as DescriptionsSemanticName)
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

### Descriptions Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | --------------------------------------------------------------- | ------------------------------ | -------------------------- | ------------ |
| placement | 对齐方式，默认'horizontal' | DescriptionsPlacementEnum | "horizontal" \| "vertical" | "horizontal" |
| appearance | 描述样式，分为table样式和unset | DescriptionsAppearanceEnum | "table" \| "unset" | "unset" |
| column | 列数，表示一行包含DescriptionItems的数量 | number | - | 3 |
| data | 提供JS配置化的方式渲染单元模块 | DescriptionsItemProps\[] | - | - |
| fieldNames | 设置 data 中label, value, labelWidth, labelPlacement 对应的 key | HiBaseFieldNames | - | - |
| labelPlacement | label对齐方式 | DescriptionsLabelPlacementEnum | "left" \| "right" | "left" |
| labelWidth | label宽度 | ReactText | - | - |
| columnGap | 单元格列间距&#xA;注：在无边框场景下生效 | ReactText | - | - |
| size | 设置大小 | "md" \| "sm" | "md" \| "sm" | - |
| contentPosition | 在 horizontal 放置时，标签相对内容垂直对齐的方式 | ContentPosition | - | "top" |
| classNames | | DescriptionsSemanticClassNames | - | - |
| styles | | DescriptionsSemanticStyles | - | - |


### DescriptionsItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ------------------------------- | ------------------------------ | ----------------- | ------ |
| colSpan | 包含列的数量 | number | - | - |
| span | @deprecated 请使用 colSpan 替代 | number | - | - |
| label | 内容标题 | ReactNode | - | - |
| labelWidth | label宽度 | ReactText | - | - |
| labelPlacement | label 对齐方式 | DescriptionsLabelPlacementEnum | "left" \| "right" | - |
| value | 每一项的内容 | ReactNode | - | - |

