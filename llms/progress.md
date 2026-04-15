# Progress 进度条

用来展示当前任务、事件或操作的进展程度。

## 使用示例

### 基础用法

有足够的空间，突出展示进度状态


```tsx
import React from 'react'
import Progress from '@hi-ui/progress' 
export const Basic = () => {
 return (
 <> 
 <div className="progress-basic__wrap">
 <Progress type="success" content="成功" percent={100} />
 <br />
 <Progress type="warning" content="警示" percent={50} />
 <br />
 <Progress type="error" content="错误" percent={20} />
 <br />
 <Progress type="primary" percent={75} />
 <br />
 </div>
 </>
 )
}

```


### 环形用法

在局限空间里展示加载进度，如图片上传、附件上传


```tsx
import React from 'react'
import { CircleProgress } from '@hi-ui/progress'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons' 
export const Circle = () => {
 return (
 <> 
 <div className="progress-circle__wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
 <CircleProgress percent={75} />

 <CircleProgress
 type="success"
 content={<CheckOutlined style={{ fontSize: '20px' }} />}
 percent={100}
 />

 <CircleProgress
 type="warning"
 content={<ExclamationOutlined style={{ fontSize: '20px' }} />}
 percent={50}
 />

 <CircleProgress
 type="error"
 content={<CloseOutlined style={{ fontSize: '20px' }} />}
 percent={20}
 />
 </div>
 </>
 )
}

```


### 仪表盘用法

设置组件和进度条的配合使用


```tsx
import React from 'react'
import { DashboardProgress } from '@hi-ui/progress'
import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@hi-ui/icons' 
export const Dashboard = () => {
 return (
 <> 
 <div
 className="progress-dashboard__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
 >
 <DashboardProgress content="成功" percent={80} />

 <DashboardProgress
 type="success"
 content={<CheckOutlined style={{ fontSize: '20px' }} />}
 percent={100}
 />

 <DashboardProgress
 type="warning"
 content={<ExclamationOutlined style={{ fontSize: '20px' }} />}
 percent={50}
 />

 <DashboardProgress
 type="error"
 content={<CloseOutlined style={{ fontSize: '20px' }} />}
 percent={20}
 />
 <DashboardProgress percent={75} />
 </div>
 </>
 )
}

```


### 自定义进度

设置组件和进度条的配合使用


```tsx
import React from 'react'
import Progress from '@hi-ui/progress'
import Counter from '@hi-ui/counter' 
export const CustomPercent = () => {
 const [percent, setPercent] = React.useState(0)

 return (
 <> 
 <div
 className="progress-custom-percent__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
 >
 <Progress percent={percent} size="lg" />
 <div>
 <Counter
 value={percent}
 step={10}
 min={0}
 max={100}
 onChange={(percent) => {
 setPercent(percent)
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 等待中进度


```tsx
import React from 'react'
import Progress from '@hi-ui/progress' 
export const Indeterminate = () => {
 return (
 <> 
 <div className="progress-indeterminate__wrap">
 <Progress indeterminate />
 </div>
 </>
 )
}

```


### 文字内显

设置组件和进度条的配合使用


```tsx
import React from 'react'
import Progress from '@hi-ui/progress' 
export const Inside = () => {
 return (
 <> 
 <div className="progress-basic__wrap">
 <Progress percent={0} placement="inside" strokeWidth={20} />
 <Progress percent={2} placement="inside" strokeWidth={20} />
 <Progress content="成功" percent={80} placement="inside" strokeWidth={20} />
 <br />
 <Progress type="success" content="成功" percent={100} placement="inside" strokeWidth={20} />
 <br />
 <Progress type="warning" content="警示" percent={50} placement="inside" strokeWidth={20} />
 <br />
 <Progress type="error" content="错误" percent={20} placement="inside" strokeWidth={20} />
 <Progress percent={75} strokeWidth={20} />
 <br />
 </div>
 </>
 )
}

```


### 环形进度条尺寸


```tsx
import React from 'react'
import { CircleProgress } from '@hi-ui/progress' 
export const CircleSize = () => {
 return (
 <> 
 <div
 className="progress-circle-size__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
 >
 <CircleProgress percent={75} size="sm" />
 <CircleProgress percent={75} />
 <CircleProgress percent={75} size="lg" />
 </div>
 </>
 )
}

```


### 迷你用法


```tsx
import React from 'react'
import { MiniProgress } from '@hi-ui/progress'
import { CloseCircleFilled, CheckCircleFilled } from '@hi-ui/icons' 
export const Mini = () => {
 return (
 <> 
 <div className="progress-circle__wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
 <MiniProgress percent={75} />

 <MiniProgress type="success" percent={100} />

 <MiniProgress
 percent={20}
 icon={<CloseCircleFilled style={{ fontSize: 16, color: '#fa4646' }} />}
 />

 <MiniProgress
 percent={100}
 icon={<CheckCircleFilled style={{ fontSize: 16, color: '#24b237' }} />}
 />
 </div>
 </>
 )
}

```


### 仪表盘不同尺寸


```tsx
import React from 'react'
import { DashboardProgress } from '@hi-ui/progress' 
export const DashboardSize = () => {
 return (
 <> 
 <div
 className="progress-dashboard-size__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}
 >
 <DashboardProgress percent={75} size="sm" />
 <DashboardProgress percent={75} />
 <DashboardProgress percent={75} size="lg" />
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
import Progress, { ProgressSemanticName } from '@hi-ui/progress' 
export const Semantic = () => {
 const [selected, setSelected] = useState<ProgressSemanticName>()

 return (
 <> 
 <div className="progress-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Progress
 percent={60}
 bufferPercent={80}
 classNames={{
 root: 'my-progress__root',
 inner: 'my-progress__inner',
 buffer: 'my-progress__buffer',
 value: 'my-progress__value',
 content: 'my-progress__content',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'inner', description: '进度条轨道容器' },
 { title: 'buffer', description: '缓冲区条' },
 { title: 'value', description: '进度条填充' },
 { title: 'content', description: '进度文案' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as ProgressSemanticName)
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

### Progress Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | -------------------------------------------- | -------------------------- | ---------------------------------------------- | --------- |
| size | 进度条大小 | ProgressSizeEnum | "sm" \| "md" \| "lg" | - |
| active | 激活的动画效果（仅支持条形用法） | boolean | true \| false | false |
| content | 显示文本，默认是当前进度百分比 | ReactNode | - | - |
| showInfo | 是否显示文本 | boolean | true \| false | - |
| type | 进度条类型 | ProgressTypeEnum | "primary" \| "warning" \| "error" \| "success" | "primary" |
| radius | 环形进度条半径 | number | - | - |
| placement | 文字在进度条内显示，需配合 height 使用 | ProgressPlacementEnum | "inside" \| "outside" | "outside" |
| width | 进度条宽度度，仅在 appearance = 'bar' 时有效 | number | - | - |
| height | 进度条高度，仅在 appearance = 'bar' 时有效 | number | - | - |
| percent | 进度条百分比值 | number | - | 0 |
| color | 进度条颜色 | string | - | - |
| indeterminate | 开启进度条加载 | boolean | true \| false | false |
| strokeWidth | 进度条线性宽度 | number | - | - |
| bufferPercent | 进度条缓冲区百分比值 | number | - | 0 |
| classNames | | ProgressSemanticClassNames | - | - |
| styles | | ProgressSemanticStyles | - | - |


### CircleProgress Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | -------------------------------------------- | -------------------------- | ---------------------------------------------- | --------- |
| size | 进度条大小 | ProgressSizeEnum | "sm" \| "md" \| "lg" | "md" |
| active | 激活的动画效果（仅支持条形用法） | boolean | true \| false | - |
| content | 显示文本，默认是当前进度百分比 | ReactNode | - | - |
| showInfo | 是否显示文本 | boolean | true \| false | true |
| type | 进度条类型 | ProgressTypeEnum | "primary" \| "warning" \| "error" \| "success" | "primary" |
| radius | 环形进度条半径 | number | - | - |
| placement | 文字在进度条内显示，需配合 height 使用 | ProgressPlacementEnum | "inside" \| "outside" | - |
| width | 进度条宽度度，仅在 appearance = 'bar' 时有效 | number | - | - |
| height | 进度条高度，仅在 appearance = 'bar' 时有效 | number | - | - |
| percent | 进度条百分比值 | number | - | - |
| indeterminate | 开启进度条加载 | boolean | true \| false | - |
| strokeWidth | 进度条线性宽度 | number | - | - |
| bufferPercent | 进度条缓冲区百分比值 | number | - | - |
| classNames | | ProgressSemanticClassNames | - | - |
| styles | | ProgressSemanticStyles | - | - |


### DashboardProgress Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | -------------------------------------------- | -------------------------- | ---------------------------------------------- | --------- |
| size | 进度条大小 | ProgressSizeEnum | "sm" \| "md" \| "lg" | "md" |
| active | 激活的动画效果（仅支持条形用法） | boolean | true \| false | - |
| content | 显示文本，默认是当前进度百分比 | ReactNode | - | - |
| showInfo | 是否显示文本 | boolean | true \| false | true |
| type | 进度条类型 | ProgressTypeEnum | "primary" \| "warning" \| "error" \| "success" | "primary" |
| radius | 环形进度条半径 | number | - | - |
| placement | 文字在进度条内显示，需配合 height 使用 | ProgressPlacementEnum | "inside" \| "outside" | - |
| width | 进度条宽度度，仅在 appearance = 'bar' 时有效 | number | - | - |
| height | 进度条高度，仅在 appearance = 'bar' 时有效 | number | - | - |
| percent | 进度条百分比值 | number | - | - |
| indeterminate | 开启进度条加载 | boolean | true \| false | - |
| strokeWidth | 进度条线性宽度 | number | - | - |
| bufferPercent | 进度条缓冲区百分比值 | number | - | - |
| classNames | | ProgressSemanticClassNames | - | - |
| styles | | ProgressSemanticStyles | - | - |


### MiniProgress Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | -------------------------------------------- | -------------------------- | ---------------------------------------------- | --------- |
| icon | | ReactNode | - | - |
| size | 进度条大小 | ProgressSizeEnum | "sm" \| "md" \| "lg" | - |
| active | 激活的动画效果（仅支持条形用法） | boolean | true \| false | - |
| content | 显示文本，默认是当前进度百分比 | ReactNode | - | - |
| showInfo | 是否显示文本 | boolean | true \| false | true |
| type | 进度条类型 | ProgressTypeEnum | "primary" \| "warning" \| "error" \| "success" | "primary" |
| radius | 环形进度条半径 | number | - | - |
| placement | 文字在进度条内显示，需配合 height 使用 | ProgressPlacementEnum | "inside" \| "outside" | - |
| width | 进度条宽度度，仅在 appearance = 'bar' 时有效 | number | - | - |
| height | 进度条高度，仅在 appearance = 'bar' 时有效 | number | - | - |
| percent | 进度条百分比值 | number | - | - |
| indeterminate | 开启进度条加载 | boolean | true \| false | - |
| strokeWidth | 进度条线性宽度 | number | - | - |
| bufferPercent | 进度条缓冲区百分比值 | number | - | - |
| classNames | | ProgressSemanticClassNames | - | - |
| styles | | ProgressSemanticStyles | - | - |

