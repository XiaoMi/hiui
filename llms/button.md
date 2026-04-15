# Button 按钮

引导用户去触发操作的区域

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <Button type="primary" style={{ marginBottom: 12, marginLeft: 12 }}>
 Primary Button
 </Button>
 <Button type="secondary" style={{ marginBottom: 12 }}>
 Secondary Button
 </Button>
 <Button style={{ marginBottom: 12 }}>Default Button</Button>
 <Button type="danger" style={{ marginBottom: 12 }}>
 Danger Button
 </Button>
 <Button type="success" style={{ marginBottom: 12 }}>
 Success Button
 </Button>
 </div>
 </>
 )
}

```


### 不同外观


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button' 
export const Appearance = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <Space direction="column" size="lg">
 <div>
 <Button type="primary" appearance="solid">
 Solid
 </Button>
 <Button type="default" appearance="solid">
 Solid
 </Button>
 <Button type="danger" appearance="solid">
 Solid
 </Button>
 <Button type="success" appearance="solid">
 Solid
 </Button>
 </div>
 <div>
 <Button type="primary" appearance="filled">
 Filled
 </Button>
 <Button type="default" appearance="filled">
 Filled
 </Button>
 <Button type="danger" appearance="filled">
 Filled
 </Button>
 <Button type="success" appearance="filled">
 Filled
 </Button>
 </div>
 <div>
 <Button type="primary" appearance="line">
 Line
 </Button>
 <Button type="default" appearance="line">
 Line
 </Button>
 <Button type="danger" appearance="line">
 Line
 </Button>
 <Button type="success" appearance="line">
 Line
 </Button>
 </div>
 <div>
 <Button type="primary" appearance="text">
 Text
 </Button>
 <Button type="default" appearance="text">
 Text
 </Button>
 <Button type="danger" appearance="text">
 Text
 </Button>
 <Button type="success" appearance="text">
 Text
 </Button>
 </div>
 <div style={{ width: '324px' }}>
 <Button type="primary" appearance="link">
 Link
 </Button>
 <Button type="default" appearance="link">
 Link
 </Button>
 <Button type="danger" appearance="link">
 Link
 </Button>
 <Button type="success" appearance="link">
 Link
 </Button>
 </div>
 </Space>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { PlusOutlined } from '@hi-ui/icons' 
export const Size = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
 <Button type="primary" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" size="sm">
 小号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="sm" />
 <Button type="primary">正常按钮</Button>
 <Button type="primary" icon={<PlusOutlined />} />
 <Button type="primary" size="lg">
 大号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="lg" />
 </div>

 <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
 <Button type="primary" appearance="filled" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" appearance="filled" size="sm">
 小号按钮
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} size="sm" />
 <Button type="primary" appearance="filled">
 正常按钮
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} />
 <Button type="primary" appearance="filled" size="lg">
 大号按钮
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} size="lg" />
 </div>

 <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
 <Button type="primary" appearance="line" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" appearance="line" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" appearance="line" size="sm">
 小号按钮
 </Button>
 <Button type="primary" appearance="line" icon={<PlusOutlined />} size="sm" />
 <Button type="primary" appearance="line">
 正常按钮
 </Button>
 <Button type="primary" appearance="line" icon={<PlusOutlined />} />
 <Button type="primary" appearance="line" size="lg">
 大号按钮
 </Button>
 <Button type="primary" appearance="line" icon={<PlusOutlined />} size="lg" />
 </div>

 <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
 <Button type="primary" appearance="text" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" appearance="text" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" appearance="text" size="sm">
 小号按钮
 </Button>
 <Button type="primary" appearance="text" icon={<PlusOutlined />} size="sm" />
 <Button type="primary" appearance="text">
 正常按钮
 </Button>
 <Button type="primary" appearance="text" icon={<PlusOutlined />} />
 <Button type="primary" appearance="text" size="lg">
 大号按钮
 </Button>
 <Button type="primary" appearance="text" icon={<PlusOutlined />} size="lg" />
 </div>

 <div style={{ display: 'flex', alignItems: 'center' }}>
 <Button type="primary" appearance="link" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" appearance="link" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" appearance="link" size="sm">
 小号按钮
 </Button>
 <Button type="primary" appearance="link" icon={<PlusOutlined />} size="sm" />
 <Button type="primary" appearance="link">
 正常按钮
 </Button>
 <Button type="primary" appearance="link" icon={<PlusOutlined />} />
 <Button type="primary" appearance="link" size="lg">
 大号按钮
 </Button>
 <Button type="primary" appearance="link" icon={<PlusOutlined />} size="lg" />
 </div>
 </div>
 </>
 )
}

```


### 带图标

图标能够明确表达按钮的动作含义，成组使用，与文字搭配，突出按钮的重要性


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { PlusOutlined, MinusOutlined } from '@hi-ui/icons' 
export const Icon = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <div style={{ marginBottom: 24 }}>
 <Button type="primary" icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}>
 Solid
 </Button>
 <Button type="primary" icon={<PlusOutlined />} />
 <Button icon={[null, <MinusOutlined key="2" />]}>Solid</Button>
 <Button icon={<PlusOutlined />} />
 <Button type="danger" icon={<PlusOutlined />}>
 Solid
 </Button>
 <Button type="danger" icon={<PlusOutlined />} />
 <Button type="success" icon={<PlusOutlined />}>
 Solid
 </Button>
 <Button type="success" icon={<PlusOutlined />} />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button
 type="primary"
 appearance="filled"
 icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
 >
 Filled
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} />
 <Button appearance="filled" icon={[null, <MinusOutlined key="2" />]}>
 Solid
 </Button>
 <Button appearance="filled" icon={<PlusOutlined />} />
 <Button type="danger" appearance="filled" icon={<PlusOutlined />}>
 Filled
 </Button>
 <Button type="danger" appearance="filled" icon={<PlusOutlined />} />
 <Button type="success" appearance="filled" icon={<PlusOutlined />}>
 Filled
 </Button>
 <Button type="success" appearance="filled" icon={<PlusOutlined />} />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button
 type="primary"
 icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
 appearance="line"
 >
 Line
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="line" />
 <Button icon={[null, <MinusOutlined key="2" />]} appearance="line">
 Line
 </Button>
 <Button icon={<PlusOutlined />} appearance="line" />
 <Button type="danger" icon={<PlusOutlined />} appearance="line">
 Line
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="line" />
 <Button type="success" icon={<PlusOutlined />} appearance="line">
 Line
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="line" />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button
 type="primary"
 icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
 appearance="text"
 >
 Text
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="text" />
 <Button icon={[null, <MinusOutlined key="2" />]} appearance="text">
 Text
 </Button>
 <Button icon={<PlusOutlined />} appearance="text" />
 <Button type="danger" icon={<PlusOutlined />} appearance="text">
 Text
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="text" />
 <Button type="success" icon={<PlusOutlined />} appearance="text">
 Text
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="text" />
 </div>

 <div>
 <Button
 type="primary"
 icon={[<PlusOutlined key="1" />, <MinusOutlined key="2" />]}
 appearance="link"
 >
 Link
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="link" />
 <Button icon={[null, <MinusOutlined key="2" />]} appearance="link">
 Link
 </Button>
 <Button icon={<PlusOutlined />} appearance="link" />
 <Button type="danger" icon={<PlusOutlined />} appearance="link">
 Link
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="link" />
 <Button type="success" icon={<PlusOutlined />} appearance="link">
 Link
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="link" />
 </div>
 </div>
 </>
 )
}

```


### 加载中状态

请求服务器发生延迟时或缓冲状态，使用加载中进行状态说明


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { PlusOutlined } from '@hi-ui/icons' 
export const Loading = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <div style={{ marginBottom: 24 }}>
 <Button type="primary" icon={<PlusOutlined />} loading>
 Solid
 </Button>
 <Button type="primary" icon={<PlusOutlined />} loading />
 <Button icon={<PlusOutlined />} loading>
 Solid
 </Button>
 <Button icon={<PlusOutlined />} loading />
 <Button type="danger" icon={<PlusOutlined />} loading>
 Solid
 </Button>
 <Button type="danger" icon={<PlusOutlined />} loading />
 <Button type="success" icon={<PlusOutlined />} loading>
 Solid
 </Button>
 <Button type="success" icon={<PlusOutlined />} loading />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} loading>
 Filled
 </Button>
 <Button type="primary" appearance="filled" icon={<PlusOutlined />} loading />
 <Button appearance="filled" icon={<PlusOutlined />} loading>
 Filled
 </Button>
 <Button appearance="filled" icon={<PlusOutlined />} loading />
 <Button type="danger" appearance="filled" icon={<PlusOutlined />} loading>
 Filled
 </Button>
 <Button type="danger" appearance="filled" icon={<PlusOutlined />} loading />
 <Button type="success" appearance="filled" icon={<PlusOutlined />} loading>
 Filled
 </Button>
 <Button type="success" appearance="filled" icon={<PlusOutlined />} loading />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button type="primary" icon={<PlusOutlined />} appearance="line" loading>
 Line
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="line" loading />
 <Button icon={<PlusOutlined />} appearance="line" loading>
 Line
 </Button>
 <Button icon={<PlusOutlined />} appearance="line" loading />
 <Button type="danger" icon={<PlusOutlined />} appearance="line" loading>
 Line
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="line" loading />
 <Button type="success" icon={<PlusOutlined />} appearance="line" loading>
 Line
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="line" loading />
 </div>

 <div style={{ marginBottom: 24 }}>
 <Button type="primary" icon={<PlusOutlined />} appearance="text" loading>
 Text
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="text" loading />
 <Button icon={<PlusOutlined />} appearance="text" loading>
 Text
 </Button>
 <Button icon={<PlusOutlined />} appearance="text" loading />
 <Button type="danger" icon={<PlusOutlined />} appearance="text" loading>
 Text
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="text" loading />
 <Button type="success" icon={<PlusOutlined />} appearance="text" loading>
 Text
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="text" loading />
 </div>

 <div>
 <Button type="primary" icon={<PlusOutlined />} appearance="link" loading>
 Link
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="link" loading />
 <Button icon={<PlusOutlined />} appearance="link" loading>
 Link
 </Button>
 <Button icon={<PlusOutlined />} appearance="link" loading />
 <Button type="danger" icon={<PlusOutlined />} appearance="link" loading>
 Link
 </Button>
 <Button type="danger" icon={<PlusOutlined />} appearance="link" loading />
 <Button type="success" icon={<PlusOutlined />} appearance="link" loading>
 Link
 </Button>
 <Button type="success" icon={<PlusOutlined />} appearance="link" loading />
 </div>
 </div>
 </>
 )
}

```


### 禁用状态

暂不可操作的状态


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { PlusOutlined } from '@hi-ui/icons' 
export const Disabled = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <Button type="primary" icon={<PlusOutlined />} disabled>
 Solid
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="filled" disabled>
 Filled
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="line" disabled>
 Line
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="text" disabled>
 Text
 </Button>
 <Button type="primary" icon={<PlusOutlined />} appearance="link" disabled>
 Link
 </Button>
 </div>
 </>
 )
}

```


### 按钮组

用于将有并列关系的一组动作，以组的形式展示


```tsx
import React from 'react'
import { ButtonGroup, Button } from '@hi-ui/button'
import { EditOutlined } from '@hi-ui/icons' 
export const Group = () => {
 return (
 <> 
 <div className="button-basic__wrap" style={{ marginBottom: 20 }}>
 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button type="primary">按钮 1</Button>
 <Button type="primary">按钮 2</Button>
 <Button type="primary">按钮 3</Button>
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button type="danger">按钮 1</Button>
 <Button type="danger">按钮 2</Button>
 <Button type="danger">按钮 3</Button>
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button type="success">按钮 1</Button>
 <Button type="success">按钮 2</Button>
 <Button type="success">按钮 3</Button>
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button appearance="solid">按钮 1</Button>
 <Button appearance="solid">按钮 2</Button>
 <Button appearance="solid">按钮 3</Button>
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button>按钮 1</Button>
 <Button>按钮 2</Button>
 <Button>按钮 3</Button>
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button type="primary" icon={<EditOutlined />} />
 <Button type="primary" icon={<EditOutlined />} />
 <Button type="primary" icon={<EditOutlined />} />
 </ButtonGroup>
 </div>

 <div style={{ marginBottom: 24 }}>
 <ButtonGroup>
 <Button type="primary">按钮</Button>
 <Button type="primary" icon={<EditOutlined />} />
 </ButtonGroup>
 </div>
 </div>
 </>
 )
}

```


### 不同形状


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import { PlusOutlined } from '@hi-ui/icons' 
export const Shape = () => {
 const btnRef = React.useRef(null)
 React.useEffect(() => {
 console.log(btnRef)
 }, [])
 return (
 <> 
 <div className="button-basic__wrap">
 <h2>square</h2>
 <Button type="primary" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" size="sm">
 小号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="sm" />
 <Button type="primary">正常按钮</Button>
 <Button type="primary" icon={<PlusOutlined />} />
 <Button type="primary" size="lg">
 大号按钮
 </Button>
 <Button type="primary" icon={<PlusOutlined />} size="lg" />

 <h2>round</h2>
 <Button type="primary" shape="round" size="xs">
 超小号按钮
 </Button>
 <Button type="primary" shape="round" icon={<PlusOutlined />} size="xs" />
 <Button type="primary" shape="round" size="sm">
 小号按钮
 </Button>
 <Button type="primary" shape="round" icon={<PlusOutlined />} size="sm" />
 <Button type="primary" shape="round">
 正常按钮
 </Button>
 <Button type="primary" shape="round" icon={<PlusOutlined />} />
 <Button type="primary" shape="round" size="lg">
 大号按钮
 </Button>
 <Button type="primary" shape="round" icon={<PlusOutlined />} size="lg" />
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
import Button from '@hi-ui/button'
import { PlusOutlined, MinusOutlined } from '@hi-ui/icons' 
export const Semantic = () => {
 const [selected, setSelected] = useState<'root' | 'prefixIcon' | 'suffixIcon'>()

 return (
 <> 
 <div className="button-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <h2>普通用法</h2>
 <Button
 type="primary"
 icon={[<PlusOutlined key="prefix" />, <MinusOutlined key="suffix" />]}
 classNames={{
 root: 'my-button__root',
 prefixIcon: 'my-button__prefix-icon',
 suffixIcon: 'my-button__suffix-icon',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 按钮
 </Button>
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
 title: 'prefixIcon',
 description: '前缀图标元素',
 },
 {
 title: 'suffixIcon',
 description: '后缀图标元素',
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
 <Button
 type="primary"
 icon={<PlusOutlined />}
 classNames={(info) => {
 if (info.props.type === 'primary') {
 return {
 root: 'my-button__root--primary',
 prefixIcon: 'my-button__prefix-icon--primary',
 }
 }
 return {}
 }}
 styles={(info) => {
 if (info.props.type === 'primary') {
 return {
 root: {
 borderRadius: 8,
 },
 prefixIcon: {
 fontSize: 18,
 },
 }
 }
 return {}
 }}
 >
 按钮
 </Button>
 </div>
 </>
 )
}

```


## Props

### Button Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| type | 设置按钮类型 | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "default" |
| size | 设置按钮尺寸 | "xs" \| "sm" \| "md" \| "lg" | "xs" \| "sm" \| "md" \| "lg" | - |
| appearance | 设置按钮外观 | "link" \| "line" \| "text" \| "solid" \| "filled" | "link" \| "line" \| "text" \| "solid" \| "filled" | - |
| disabled | 设置按钮是否禁用 | boolean | true \| false | false |
| loading | 是否显示 loading | boolean | true \| false | false |
| href | 设置按钮链接，设置后将用 a 标签渲染按钮 | string | - | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | - |
| icon | 设置按钮图标 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | null |
| shape | 设置按钮形状 | "square" \| "round" | "square" \| "round" | "square" |
| onClick | 点击按钮时的回调 | ((evt: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| classNames | | ButtonSemanticClassNames | - | - |
| styles | | ButtonSemanticStyles | - | - |


### ButtonGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------------ | --------- | ------ | ------ |
| children | 孩子节点，传入单个或多个 Button 组件 | ReactNode | - | - |

