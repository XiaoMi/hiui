# Tag 标签

用来标记信息的属性，用以区分信息。

## 使用示例

### 基础用法

标签的信息重要级别高，识别度较高


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Basic = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag type="default">默认色</Tag>
 <Tag type="primary">主题色</Tag>
 <Tag type="success">成功色</Tag>
 <Tag type="warning">警告色</Tag>
 <Tag type="danger">危险色</Tag>
 <Tag type="yellow">黄色</Tag>
 <Tag type="ultramarine">深蓝色</Tag>
 <Tag type="skyblue">天蓝色</Tag>
 <Tag type="purple">紫色</Tag>
 <Tag type="rosered">玫瑰红</Tag>
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性、实心三种


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Appearance = () => {
 return (
 <> 
 <h2>Filled 面性</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag type="default" appearance="filled">
 默认色
 </Tag>
 <Tag type="primary" appearance="filled">
 主题色
 </Tag>
 <Tag type="success" appearance="filled">
 成功色
 </Tag>
 <Tag type="warning" appearance="filled">
 警告色
 </Tag>
 <Tag type="danger" appearance="filled">
 危险色
 </Tag>
 <Tag type="yellow" appearance="filled">
 黄色
 </Tag>
 <Tag type="ultramarine" appearance="filled">
 深蓝色
 </Tag>
 <Tag type="skyblue" appearance="filled">
 天蓝色
 </Tag>
 <Tag type="purple" appearance="filled">
 紫色
 </Tag>
 <Tag type="rosered" appearance="filled">
 玫瑰红
 </Tag>
 </div>
 <h2>line 线性</h2>
 <div style={{ display: 'flex', gap: '8px' }}>
 <Tag type="default" appearance="line">
 默认色
 </Tag>
 <Tag type="primary" appearance="line">
 主题色
 </Tag>
 <Tag type="success" appearance="line">
 成功色
 </Tag>
 <Tag type="warning" appearance="line">
 警告色
 </Tag>
 <Tag type="danger" appearance="line">
 危险色
 </Tag>
 <Tag type="yellow" appearance="line">
 黄色
 </Tag>
 <Tag type="ultramarine" appearance="line">
 深蓝色
 </Tag>
 <Tag type="skyblue" appearance="line">
 天蓝色
 </Tag>
 <Tag type="purple" appearance="line">
 紫色
 </Tag>
 <Tag type="rosered" appearance="line">
 玫瑰红
 </Tag>
 </div>
 <h2>solid 实心</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag type="default" appearance="solid">
 默认色
 </Tag>
 <Tag type="primary" appearance="solid">
 主题色
 </Tag>
 <Tag type="success" appearance="solid">
 成功色
 </Tag>
 <Tag type="warning" appearance="solid">
 警告色
 </Tag>
 <Tag type="danger" appearance="solid">
 危险色
 </Tag>
 <Tag type="yellow" appearance="solid">
 黄色
 </Tag>
 <Tag type="ultramarine" appearance="solid">
 深蓝色
 </Tag>
 <Tag type="skyblue" appearance="solid">
 天蓝色
 </Tag>
 <Tag type="purple" appearance="solid">
 紫色
 </Tag>
 <Tag type="rosered" appearance="solid">
 玫瑰红
 </Tag>
 </div>
 <h2>dot 点状</h2>
 <div style={{ display: 'flex', gap: 12 }}>
 <Tag type="default" appearance="dot">
 默认色
 </Tag>
 <Tag type="primary" appearance="dot">
 主题色
 </Tag>
 <Tag type="success" appearance="dot">
 成功色
 </Tag>
 <Tag type="warning" appearance="dot">
 警告色
 </Tag>
 <Tag type="danger" appearance="dot">
 危险色
 </Tag>
 <Tag type="yellow" appearance="dot">
 黄色
 </Tag>
 <Tag type="ultramarine" appearance="dot">
 深蓝色
 </Tag>
 <Tag type="skyblue" appearance="dot">
 天蓝色
 </Tag>
 <Tag type="purple" appearance="dot">
 紫色
 </Tag>
 <Tag type="rosered" appearance="dot">
 玫瑰红
 </Tag>
 </div>
 </>
 )
}

```


### 不同形状


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Shape = () => {
 return (
 <> 
 <div>
 <h2>square 方型</h2>

 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="square" type="warning" appearance="filled">
 待审批
 </Tag>
 <Tag shape="square" type="primary" appearance="filled">
 审批中
 </Tag>
 <Tag shape="square" type="success" appearance="filled">
 已通过
 </Tag>
 <Tag shape="square" type="danger" appearance="filled">
 已驳回
 </Tag>
 <Tag shape="square" type="default" appearance="filled">
 待审批
 </Tag>
 </div>
 <br />
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="square" type="warning" appearance={'line'}>
 待审批
 </Tag>
 <Tag shape="square" type="primary" appearance={'line'}>
 审批中
 </Tag>
 <Tag shape="square" type="success" appearance={'line'}>
 已通过
 </Tag>
 <Tag shape="square" type="danger" appearance={'line'}>
 已驳回
 </Tag>
 <Tag shape="square" type="default" appearance={'line'}>
 待审批
 </Tag>
 </div>
 <br />
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="square" type="warning" appearance="solid">
 待审批
 </Tag>
 <Tag shape="square" type="primary" appearance="solid">
 审批中
 </Tag>
 <Tag shape="square" type="success" appearance="solid">
 已通过
 </Tag>
 <Tag shape="square" type="danger" appearance="solid">
 已驳回
 </Tag>
 <Tag shape="square" type="default" appearance="solid">
 待审批
 </Tag>
 </div>
 <h2>round 圆润型</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="round" type="warning" appearance="filled">
 待审批
 </Tag>
 <Tag shape="round" type="primary" appearance="filled">
 审批中
 </Tag>
 <Tag shape="round" type="success" appearance="filled">
 已通过
 </Tag>
 <Tag shape="round" type="danger" appearance="filled">
 已驳回
 </Tag>
 <Tag shape="round" type="default" appearance="filled">
 待审批
 </Tag>
 </div>
 <br />
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="round" type="warning" appearance={'line'}>
 待审批
 </Tag>
 <Tag shape="round" type="primary" appearance={'line'}>
 审批中
 </Tag>
 <Tag shape="round" type="success" appearance={'line'}>
 已通过
 </Tag>
 <Tag shape="round" type="danger" appearance={'line'}>
 已驳回
 </Tag>
 <Tag shape="round" type="default" appearance={'line'}>
 待审批
 </Tag>
 </div>
 <br />
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag shape="round" type="warning" appearance="solid">
 待审批
 </Tag>
 <Tag shape="round" type="primary" appearance="solid">
 审批中
 </Tag>
 <Tag shape="round" type="success" appearance="solid">
 已通过
 </Tag>
 <Tag shape="round" type="danger" appearance="solid">
 已驳回
 </Tag>
 <Tag shape="round" type="default" appearance="solid">
 待审批
 </Tag>
 </div>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Size = () => {
 return (
 <> 
 <div>
 <h2>sm</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag size="sm" type="warning" appearance="filled">
 待审批
 </Tag>
 <Tag size="sm" type="primary" appearance="filled">
 审批中
 </Tag>
 <Tag size="sm" type="success" appearance="filled">
 已通过
 </Tag>
 <Tag size="sm" type="danger" appearance="filled">
 已驳回
 </Tag>
 <Tag size="sm" type="default" appearance="filled">
 待审批
 </Tag>
 </div>
 <h2>md</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag size="md" type="warning" appearance="filled">
 待审批
 </Tag>
 <Tag size="md" type="primary" appearance="filled">
 审批中
 </Tag>
 <Tag size="md" type="success" appearance="filled">
 已通过
 </Tag>
 <Tag size="md" type="danger" appearance="filled">
 已驳回
 </Tag>
 <Tag size="md" type="default" appearance="filled">
 待审批
 </Tag>
 </div>
 <h2>lg</h2>
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag size="lg" type="warning" appearance="filled">
 待审批
 </Tag>
 <Tag size="lg" type="primary" appearance="filled">
 审批中
 </Tag>
 <Tag size="lg" type="success" appearance="filled">
 已通过
 </Tag>
 <Tag size="lg" type="danger" appearance="filled">
 已驳回
 </Tag>
 <Tag size="lg" type="default" appearance="filled">
 待审批
 </Tag>
 </div>
 </div>
 </>
 )
}

```


### 可关闭的


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Closeable = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <Tag appearance="filled" type="primary" closeable onDelete={() => console.log('click')}>
 Closeable default
 </Tag>
 <Tag appearance="filled" closeable>
 Closeable default
 </Tag>
 <Tag appearance="solid" type="primary" closeable>
 Closeable solid
 </Tag>
 <Tag appearance="solid" closeable>
 Closeable solid
 </Tag>
 </div>
 </>
 )
}

```


### 可编辑的


```tsx
import { SunFilled } from '@hi-ui/icons'
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Editable = () => {
 const [testValue1, setTestValue1] = React.useState('test-value')
 const [testValue2, setTestValue2] = React.useState('test-value')

 return (
 <> 
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <Tag editable onEdit={setTestValue1} type={'primary'}>
 {testValue1}
 </Tag>
 <Tag appearance={'solid'} editable onEdit={setTestValue2} type={'primary'}>
 {testValue2}
 </Tag>

 <Tag
 type={'primary'}
 render={(children) => (
 <span>
 <SunFilled style={{ marginRight: '2px' }} />
 {children}
 </span>
 )}
 maxWidth={240}
 editable
 >
 Test Content Max Length Placeholder Max Length Placeholder
 </Tag>
 </div>
 </>
 )
}

```


### 不同颜色


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const Colors = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag type="warning">待审批</Tag>
 <Tag type="primary">审批中</Tag>
 <Tag type="success">已通过</Tag>
 <Tag type="danger">已驳回</Tag>
 <Tag type="default">待审批</Tag>
 </div>
 </>
 )
}

```


### 自定义颜色

标签的信息重要级别高，识别度较高


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const CustomColor = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag color="#48D4CF">color #48D4CF</Tag>
 <Tag background="#48D4CF" appearance="solid">
 background #48D4CF
 </Tag>
 </div>
 </>
 )
}

```


### 文本溢出隐藏


```tsx
import React from 'react'
import Tag from '@hi-ui/tag' 
export const MaxWidth = () => {
 const [maxEditableValue, setMaxEditableValue] = React.useState(
 'max 180px editable (placeholder1 placeholder2 placeholder3 placeholder4)'
 )

 return (
 <> 
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <Tag maxWidth={240}>max 240px (placeholder1 placeholder2 placeholder3 placeholder4)</Tag>
 {/* Tooltip 禁用 portal */}
 <Tag maxWidth={240} closeable tooltipProps={{ disabledPortal: true }}>
 max 240px (placeholder1 placeholder2 placeholder3 placeholder4)
 </Tag>
 <Tag maxWidth={180} editable onEdit={setMaxEditableValue}>
 {maxEditableValue}
 </Tag>
 </div>
 </>
 )
}

```


### 标签组用法

以标签为信息实体进行编辑操作，如品类、频道等管理


```tsx
import React, { useState } from 'react'
import Tag, { TagGroupDataItem } from '@hi-ui/tag' 
export const TagGroup = () => {
 const [baseData, setBaseData] = useState<TagGroupDataItem[]>([
 {
 children: 'Test',
 id: '0',
 },
 ])

 return (
 <> 
 <Tag.Group
 data={baseData}
 onEdit={(newString, node, index) => {
 setBaseData((pre) => {
 const result = [...pre]
 result[index].children = newString
 return result
 })
 }}
 onDelete={(e, index) => {
 setBaseData((pre) => {
 const result = [...pre]
 result.splice(index, 1)
 return result
 })
 }}
 onAdd={(e) => {
 if (e) {
 setBaseData((pre) => {
 const result = [...pre]
 result.push({
 children: e,
 id: Math.random(),
 })
 return result
 })
 }
 }}
 />
 </>
 )
}

```


### 自定义编辑器渲染


```tsx
import React, { useState } from 'react'
import Tag, { TagGroupDataItem } from '@hi-ui/tag'
import Select from '@hi-ui/select' 
export const EditorRender = () => {
 const [baseData, setBaseData] = useState<TagGroupDataItem[]>([
 {
 children: 'Test',
 id: 1,
 },
 ])
 const [tagsData] = useState([
 { id: 1, title: 'Test' },
 { id: 2, title: 'Test2' },
 { id: 3, title: 'Test3' },
 { id: 4, title: 'Test4' },
 { id: 5, title: 'Test5' },
 ])

 const selectData = React.useMemo(() => {
 return tagsData.filter((item) => !baseData.find((d) => d.id === item.id))
 }, [baseData, tagsData])

 return (
 <> 
 <Tag.Group
 data={baseData}
 // editable={false}
 editorRender={(updated) => {
 return (
 <Select
 style={{ display: 'inline-flex', width: 120, margin: '8px 0 0 0' }}
 size={'xs'}
 data={selectData}
 onClose={() => updated()}
 onChange={(id, item) => {
 if (id !== undefined) {
 setBaseData((pre) => {
 const result = [...pre]
 result.push({
 children: item.title,
 id,
 })
 return result
 })

 updated()
 }
 }}
 />
 )
 }}
 onDelete={(e, index) => {
 setBaseData((pre) => {
 const result = [...pre]
 result.splice(index, 1)
 return result
 })
 }}
 />
 </>
 )
}

```


### 触发编辑

可在自定义渲染中，去定义如何触发组件的编辑状态


```tsx
import React from 'react'
import Tag from '@hi-ui/tag'
import Button from '@hi-ui/button'
import { EditFilled } from '@hi-ui/icons' 
export const TriggerEdit = () => {
 const [testValue, setTestValue] = React.useState('test-value66')

 return (
 <> 
 <div style={{ display: 'flex', gap: 8 }}>
 <Tag
 editable
 onEdit={setTestValue}
 render={(children, triggerEdit) => {
 return (
 <div style={{ display: 'flex', alignItems: 'center' }}>
 {children}
 <Button
 appearance="link"
 icon={<EditFilled style={{ color: '#1a1d26' }} />}
 style={{ marginLeft: 4 }}
 onClick={triggerEdit}
 />
 </div>
 )
 }}
 >
 {testValue}
 </Tag>
 </div>
 </>
 )
}

```


## Props

### Tag Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| type | 类型状态 | "primary" \| "success" \| "warning" \| "danger" \| "default" \| "yellow" \| "ultramarine" \| "skyblue" \| "purple" \| "rosered" | "primary" \| "success" \| "warning" \| "danger" \| "default" \| "yellow" \| "ultramarine" \| "skyblue" \| "purple" \| "rosered" | "default" |
| appearance | 外观 | "line" \| "solid" \| "filled" \| "dot" | "line" \| "solid" \| "filled" \| "dot" | "filled" |
| shape | 形状 | "square" \| "round" | "square" \| "round" | "square" |
| size | 标签尺寸 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | "'md'" |
| color | 标签文字颜色 | string | - | - |
| background | 标签背景色 | string | - | - |
| render | 内容渲染器&#xA;@param children 子代对象&#xA;@param triggerEdit 触发编辑函数 | ((children?: ReactText, triggerEdit?: (() => void) \| undefined) => ReactNode) \| undefined | (children?: ReactText \| undefined, triggerEdit?: (() => void) \| undefined) => ReactNode | (e?: React.ReactText) => e |
| closeable | 是否展示可关闭按钮 | boolean | true \| false | false |
| editable | 是否可编辑，若启用需要确保 children 传入类型为 \`string\` | boolean | true \| false | false |
| autoEditable | 是否一开始自动可编辑 | boolean | true \| false | false |
| onEdit | tag 修改操作&#xA;@param content tag 修改后内容 | ((content: string) => void) | - | - |
| onDelete | tag 删除操作 | (() => void) | - | - |
| maxWidth | 最大宽度，如超出，则截断末尾添加省略号，鼠标悬浮气泡展示（当使用此功能时，请保证children为纯文本类型） | number | - | "0 代表不限制宽度" |


### TagGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------ |
| data | 展示数据 | TagGroupDataItem\[] | - | \[] |
| editable | 标签组是否可以修改、新增、删除，优先级低于 node 自定义 | boolean | true \| false | true |
| maxWidth | 最大宽度（优先级低于 node 自行定义） | number | - | "0 代表不限制宽度" |
| onDelete | 标签删除后触发&#xA;@param deleteNode&#xA;@param index | ((disposeNode: TagGroupDataItem, index: number) => void) | - | - |
| onEdit | 标签修改后触发&#xA;@param editNode&#xA;@param index | ((newStringValue: string, disposeNode: TagGroupDataItem, index: number) => void) | - | - |
| onAdd | 标签新增后触发 | ((newStringValue: string, index: number) => void) | - | - |
| render | 内容渲染器&#xA;@param children 子代对象 | ((children?: ReactText) => ReactNode) \| undefined | (children?: ReactText \| undefined) => ReactNode | "e => e" |
| editorRender | 自定义编辑器渲染 | ((updated: () => void) => ReactNode) | - | - |


## Type

### TagGroupDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | -------------------------------------- | --------- | ------------- | ------ |
| id | 标签唯一 id | ReactText | - | - |
| title | 标题 | ReactNode | - | - |
| closable | 标签是否可以关闭 | boolean | true \| false | false |
| editable | 标签是否可以修改 | boolean | true \| false | false |
| maxWidth | 最大宽度，如超出，则截断末尾添加省略号 | number | - | - |
