# Timeline 时间轴

以时间点为维度展示垂直信息流的一种组件。

## 使用示例

### 基础用法

以时间为第一维度，展示该时间点的事务、日程、任务或记录


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Basic = () => {
 return (
 <> 
 <div className="timeline-basic__wrap">
 <Timeline
 style={{ width: 440 }}
 data={[
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '10:00',
 extraTime: '02-27',
 children: [
 {
 title: 'Sub 1',
 content: 'Here are some descriptions',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: 'Sub 2',
 content: 'Here are some descriptions',
 },
 ],
 },
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '11:00',
 extraTime: '03-10',
 children: [
 {
 title: 'Sub 1',
 content: 'Here are some descriptions',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: 'Sub 2',
 content: 'Here are some descriptions',
 },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 信息流样式

在一段时间范围里，信息流向增长，数量庞大，必要时可收起部分


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Right = () => {
 return (
 <> 
 <div className="timeline-right__wrap">
 <Timeline
 type="right"
 data={[
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-27',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '11:00',
 extraTime: '03-10',
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 左右结构样式

不同样式的时间轴，突出时间走向


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Cross = () => {
 return (
 <> 
 <div className="timeline-cross__wrap">
 <Timeline
 type="cross"
 data={[
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-27',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '11:00',
 extraTime: '03-10',
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 圆圈颜色


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Color = () => {
 return (
 <> 
 <div className="timeline-color__wrap">
 <Timeline
 style={{ width: 440 }}
 data={[
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '10:00',
 extraTime: '02-23',
 dotColor: '#24b237',
 dotType: 'solid',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '10:00',
 extraTime: '02-27',
 dotColor: '#2660ff',
 dotType: 'solid',
 },
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '12:00',
 extraTime: '03-02',
 dotColor: '#fa4646',
 dotType: 'solid',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '11:00',
 extraTime: '03-10',
 dotColor: '#91959e',
 dotType: 'solid',
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 内容分组


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Group = () => {
 return (
 <> 
 <div className="timeline-group__wrap">
 <Timeline
 style={{ width: 440 }}
 data={[
 {
 groupTitle: '上午',
 children: [
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '10:00',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '10:00',
 },
 ],
 },
 {
 groupTitle: '下午',
 children: [
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '12:00',
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '11:00',
 },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 卡片内容


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline'
import Card from '@hi-ui/card' 
export const CardContent = () => {
 return (
 <> 
 <div className="timeline-card__wrap" style={{ backgroundColor: '#F2F4F7', padding: 24 }}>
 <Timeline
 data={[
 {
 title: (
 <Card bordered={false}>
 <div>毕加索会议室 B2层 可提前预定预…</div>
 <div>毕加索会议室 B2层 可提前预定预…</div>
 <div>毕加索会议室 B2层 可提前预定预…</div>
 <div>毕加索会议室 B2层 可提前预定预…</div>
 </Card>
 ),
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: <Card bordered={false}>社招面试-设计师</Card>,
 timestamp: '10:00',
 extraTime: '02-27',
 children: [
 {
 title: <Card bordered={false}>Here are some descriptions 1</Card>,
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: <Card bordered={false}>Here are some descriptions 2</Card>,
 },
 ],
 },
 {
 title: <Card bordered={false}>毕加索会议室 B2层 可提前预定预…</Card>,
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: (
 <Card bordered={false}>
 <div>社招面试-设计师</div>
 <div>社招面试-设计师</div>
 <div>社招面试-设计师</div>
 <div>社招面试-设计师</div>
 <div>社招面试-设计师</div>
 </Card>
 ),
 timestamp: '11:00',
 extraTime: '03-10',
 children: [
 {
 title: <Card bordered={false}>Here are some descriptions 1</Card>,
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: <Card bordered={false}>Here are some descriptions 2</Card>,
 },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 自定义图标

可运用图标加强对时间节点上的信息状态表示


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline'
import { EmptyFilled, SunFilled, CheckCircleFilled } from '@hi-ui/icons' 
export const CustomIcon = () => {
 return (
 <> 
 <div className="timeline-custom-icon__wrap">
 <Timeline
 style={{ width: 440 }}
 data={[
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '10:00',
 extraTime: '02-23',

 icon: <SunFilled style={{ color: '#fab007' }} />,
 },
 {
 title: '社招面试-设计师',
 content: '总参',
 timestamp: '10:00',
 extraTime: '02-27',
 icon: <EmptyFilled style={{ color: '#237ffa' }} />,
 },
 {
 title: '管理层例会',
 content: '毕加索会议室 B2层 可提前预定预…',
 timestamp: '12:00',
 extraTime: '03-02',
 icon: <CheckCircleFilled style={{ color: '#14ca64' }} />,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 左右结构样式

不同样式的时间轴，突出时间走向


```tsx
import React from 'react'
import Timeline from '@hi-ui/timeline' 
export const Placement = () => {
 return (
 <> 
 <div className="timeline-placement__wrap">
 <Timeline
 placement="horizontal"
 data={[
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-27',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '11:00',
 extraTime: '03-10',
 },
 ]}
 />
 <br />
 <br />
 <Timeline
 placement="horizontal"
 itemPlacement="center"
 data={[
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-23',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '10:00',
 extraTime: '02-27',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '12:00',
 extraTime: '03-02',
 },
 {
 title: '信息部全员财务培训需求收集',
 content:
 '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
 timestamp: '11:00',
 extraTime: '03-10',
 },
 ]}
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
import Timeline, { TimelineSemanticName } from '@hi-ui/timeline' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TimelineSemanticName>()

 return (
 <> 
 <div className="timeline-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Timeline
 data={[
 { title: '步骤一', content: '描述信息一', timestamp: '2026-02-01' },
 { title: '步骤二', content: '描述信息二', timestamp: '2026-02-02' },
 { title: '步骤三', content: '描述信息三', timestamp: '2026-02-03' },
 ]}
 classNames={{
 root: 'my-timeline__root',
 item: 'my-timeline__item',
 itemTime: 'my-timeline__item-time',
 itemLine: 'my-timeline__item-line',
 itemDot: 'my-timeline__item-dot',
 itemTitle: 'my-timeline__item-title',
 itemContent: 'my-timeline__item-content',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'item', description: '单个时间节点' },
 { title: 'itemTime', description: '时间文案' },
 { title: 'itemLine', description: '连接线' },
 { title: 'itemDot', description: '圆点/图标' },
 { title: 'itemTitle', description: '标题' },
 { title: 'itemContent', description: '描述内容' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TimelineSemanticName)}
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

### Timeline Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ------------------------------------------------ | -------------------------- | ------------------------------- | ---------- |
| placement | 布局方式 | TimelinePlacementEnum | "horizontal" \| "vertical" | "vertical" |
| data *(required)* | 时间轴数据 | TimelineMergedItem\[] | - | - |
| itemPlacement | 轴元素对齐方式，仅在 placement="vertical" 时有效 | TimelineItemPlacementEnum | "left" \| "center" | - |
| type | 时间轴类型，仅在 placement="vertical" 时有效 | TimelineTypeEnum | "default" \| "right" \| "cross" | - |
| classNames | | TimelineSemanticClassNames | - | - |
| styles | | TimelineSemanticStyles | - | - |


## Type

### TimelineMergedItem

> TimelineDataItem | TimelineGroupDataItem

### TimelineDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | -------------- | --------- | ------ | ------ |
| title | 节点标题 | ReactNode | - | - |
| content | 节点内容信息 | ReactNode | - | - |
| timestamp | 时间点 | string | - | - |
| extraTime | 额外展示时间点 | string | - | - |
| icon | 自定义图标 | ReactNode | - | - |

### TimelineGroupDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ------------------ | ------ | ------ |
| groupTitle | 分组标题 | ReactNode | - | - |
| children | 标题下集合列表 | TimelineDataItem[] | - | - |
