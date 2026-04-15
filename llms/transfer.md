# Transfer 穿梭框

在一定展示空间里对选项进行单个或批量移动从而完成挑选的数据容器。

## 使用示例

### 基础用法

源集合中的数据可全部展示


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Basic = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-basic__wrap">
 <Transfer
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 />
 </div>
 </>
 )
}

```


### 带标题


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Title = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-title__wrap">
 <Transfer
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 title={['源数据', '目标数据']}
 />
 </div>
 </>
 )
}

```


### 数量上限


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Limit = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-limit__wrap">
 <Transfer
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 />
 </div>
 </>
 )
}

```


### 批量选中


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Multiple = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-multiple__wrap">
 <Transfer
 data={data}
 type="multiple"
 targetLimit={8}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 />
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Disabled = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-disabled__wrap">
 <Transfer
 data={data}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 title={['title']}
 disabled
 type="multiple"
 />
 </div>
 </>
 )
}

```


### 可全选

快速完成源集合的全部选择，避开冗余操作


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const AllCheck = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-all-check__wrap">
 <Transfer
 type="multiple"
 data={data}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 showCheckAll
 title={['源数据', '目标数据']}
 />
 </div>
 </>
 )
}

```


### 可搜索

源集合庞大，需借助搜索工具完成


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Searchable = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-searchable__wrap">
 <Transfer
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 searchable
 onSearch={(direction, keyword) => console.log('onSearch', direction, keyword)}
 />
 </div>
 </>
 )
}

```


### 分页


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Pagination = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 // disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-pagination__wrap">
 <Transfer
 type="multiple"
 data={data}
 // targetLimit={8}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 searchable
 pagination={{ pageSize: 10 }}
 draggable
 showCheckAll
 />
 </div>
 </>
 )
}

```


### 拖拽排序

可通过拖拽的形式对目标区域内进行排序


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer' 
export const Draggable = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-all-check__wrap">
 <Transfer
 type="multiple"
 data={data}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 showCheckAll
 draggable
 title={['源数据', '目标数据']}
 />
 </div>
 </>
 )
}

```


### 自定义渲染


```tsx
import React from 'react'
import Transfer from '@hi-ui/transfer'
import { Avatar } from '@hi-ui/avatar' 
export const Render = () => {
 const [data] = React.useState([
 { avatarColor: '#237ffa', initials: 'R', id: '荣莎', title: '荣莎', dept: '信息技术部' },
 { avatarColor: '#9772fb', initials: 'N', id: '尼坚', title: '尼坚', dept: '手机部' },
 { avatarColor: '#0daeff', initials: 'L', id: '伦颖璧', title: '伦颖璧', dept: '信息技术部' },
 { avatarColor: '#38d677', initials: 'X', id: '幸婉娥', title: '幸婉娥', dept: '汽车部' },
 { avatarColor: '#fab007', initials: 'B', id: '柏胜', title: '柏胜', dept: '信息技术部' },
 { avatarColor: '#fe7940', initials: 'Q', id: '曲强', title: '曲强', dept: '信息技术部' },
 { avatarColor: '#237ffa', initials: 'P', id: '皮莎仪', title: '皮莎仪', dept: '信息技术部' },
 { avatarColor: '#9772fb', initials: 'Z', id: '仲希', title: '仲希', dept: '信息技术部' },
 ])
 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

 return (
 <> 
 <div className="transfer-render__wrap">
 <Transfer
 type="multiple"
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 emptyContent={['暂无数据']}
 render={(item: any) => {
 return (
 <div style={{ lineHeight: '20px', display: 'inline-flex', alignItems: 'center' }}>
 <Avatar
 shape="square"
 initials={item.initials}
 size="sm"
 style={{ backgroundColor: item.avatarColor }}
 />
 <div style={{ marginLeft: 8 }}>
 <div style={{ marginTop: 4 }}>{item.title}</div>
 <div style={{ color: '#929AA6', marginBottom: 4 }}>{item.dept}</div>
 </div>
 </div>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 快速穿梭框

选择源数据后，即刻展示到目标数据中


```tsx
import React from 'react'
import { Avatar } from '@hi-ui/avatar'
import { FastTransfer } from '@hi-ui/transfer' 
export const FastTransferStories = () => {
 const [data] = React.useState(() => {
 const generateData = () => {
 const arr = []
 for (let i = 1; i < 100; i++) {
 arr.push({
 id: i,
 title: '选项' + i,
 disabled: i % 6 === 0,
 })
 }
 return arr
 }

 const data = generateData()
 return data
 })

 const [groupData] = React.useState(() => {
 return [
 {
 id: 'group1',
 groupTitle: '分组1',
 children: data.slice(0, 10),
 },
 {
 id: 'group2',
 groupTitle: '分组2',
 children: data.slice(10, 20),
 },
 {
 id: 'group3',
 groupTitle: '分组3',
 children: data.slice(20, 30),
 },
 ]
 })

 const [treeData] = React.useState(() => {
 return [
 {
 id: 'tree1',
 title: '树形1',
 children: data.slice(0, 10),
 },
 {
 id: 'tree2',
 title: '树形2',
 children: data.slice(10, 20),
 },
 ]
 })

 const [customData] = React.useState([
 { avatarColor: '#237ffa', initials: 'R', id: '荣莎', title: '荣莎', dept: '信息技术部' },
 { avatarColor: '#9772fb', initials: 'N', id: '尼坚', title: '尼坚', dept: '手机部' },
 { avatarColor: '#0daeff', initials: 'L', id: '伦颖璧', title: '伦颖璧', dept: '信息技术部' },
 { avatarColor: '#38d677', initials: 'X', id: '幸婉娥', title: '幸婉娥', dept: '汽车部' },
 { avatarColor: '#fab007', initials: 'B', id: '柏胜', title: '柏胜', dept: '信息技术部' },
 { avatarColor: '#fe7940', initials: 'Q', id: '曲强', title: '曲强', dept: '信息技术部' },
 { avatarColor: '#237ffa', initials: 'P', id: '皮莎仪', title: '皮莎仪', dept: '信息技术部' },
 { avatarColor: '#9772fb', initials: 'Z', id: '仲希', title: '仲希', dept: '信息技术部' },
 ])

 const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])
 const [targetIds2, setTargetIds2] = React.useState<React.ReactText[]>([2, 3])
 const [targetIds3, setTargetIds3] = React.useState<React.ReactText[]>([2, 3])
 const [targetIds4, setTargetIds4] = React.useState<React.ReactText[]>(['荣莎', '尼坚'])

 return (
 <> 
 <div className="fast-transfer__wrap">
 <h2>基础用法</h2>
 <FastTransfer
 data={data}
 targetLimit={6}
 targetIds={targetIds}
 onChange={(ids) => setTargetIds(ids)}
 searchable={{
 left: true,
 }}
 />
 <h2>分组穿梭框</h2>
 <FastTransfer
 data={groupData}
 draggable={true}
 targetLimit={6}
 targetIds={targetIds2}
 onChange={(ids) => setTargetIds2(ids)}
 searchable={{
 left: true,
 right: true,
 }}
 />
 <h2>树形穿梭框</h2>
 <FastTransfer
 data={treeData}
 draggable={true}
 targetLimit={6}
 targetIds={targetIds3}
 onChange={(ids) => setTargetIds3(ids)}
 searchable={{
 left: true,
 right: true,
 }}
 />
 <h2>自定义渲染</h2>
 <FastTransfer
 data={customData}
 targetIds={targetIds4}
 onChange={(ids) => setTargetIds4(ids)}
 render={(item) => {
 return (
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <Avatar
 initials={item.raw?.initials}
 size="sm"
 style={{ backgroundColor: item.raw?.avatarColor }}
 />
 <div>
 <div>{item.title}</div>
 <div style={{ fontSize: 12, color: '#91959e' }}>{item.raw?.dept}</div>
 </div>
 </div>
 )
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
import Transfer, { TransferSemanticName } from '@hi-ui/transfer'

const data = [
 { id: '1', title: '选项一' },
 { id: '2', title: '选项二' },
 { id: '3', title: '选项三' },
 { id: '4', title: '选项四' },
] 
export const Semantic = () => {
 const [selected, setSelected] = useState<TransferSemanticName>()

 return (
 <> 
 <div className="transfer-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Transfer
 data={data}
 targetIds={['2']}
 title={['源', '目标']}
 classNames={{
 root: 'my-transfer__root',
 sourcePanel: 'my-transfer__source',
 operations: 'my-transfer__operations',
 targetPanel: 'my-transfer__target',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'sourcePanel', description: '源面板' },
 { title: 'operations', description: '操作区' },
 { title: 'targetPanel', description: '目标面板' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TransferSemanticName)}
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

### Transfer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| type | 穿梭框类型 | "single" \| "multiple" | "single" \| "multiple" | "single" |
| showCheckAll | 是否展示全选按钮 | boolean | true \| false | false |
| searchable | 是否可筛选 | boolean | true \| false | false |
| keyword | 搜索关键词 | { left?: string; right?: string \| undefined; } \| undefined | { left?: string \| undefined; right?: string \| undefined; } | - |
| onSearch | 搜索回调 | ((keyword: string, direction: "left" \| "right") => void) | (keyword: string, direction: "left" \| "right") => void | - |
| draggable | 是否开启拖拽 | boolean | true \| false | false |
| disabled | 是否禁用 | boolean | true \| false | false |
| title | 头部标题（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题） | ReactNode\[] | - | - |
| placeholder | 搜索输入框占位内容（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题） | string\[] | - | - |
| emptyContent | 数据为空时的显示内容 | ReactNode\[] | - | - |
| data | 穿梭框数据源 | TransferDataItem\[] | - | \[] |
| fieldNames | 设置data中各项值对应的key | HiBaseFieldNames | - | - |
| targetLimit | 最大可穿梭上限 | number | - | - |
| defaultTargetIds | 默认的目标框内的元素 id 集合 | ReactText\[] | - | \[] |
| targetIds *(required)* | 目标框内的元素 id 集合 | ReactText\[] | - | - |
| targetSortType | 目标框内的排序方式 | "default" \| "queue" | "default" \| "queue" | "default" |
| onChange | 选中元素被移动到目标框内后的回调 | ((targetKey: ReactText\[], direction: "left" \| "right", targetItems: TransferDataItem\[]) => void) | (targetKey: ReactText\[], direction: "left" \| "right", targetItems: TransferDataItem\[]) => void | - |
| render | 自定义每项标题渲染 | ((item: TransferDataItem) => ReactNode) | - | - |
| onDragStart | 拖拽开始时的回调函数 | ((evt: DragEvent\<Element>, option: { dragNode: TransferDataItem; }) => Boolean) | - | - |
| onDrop | 放开拖拽元素时的回调函数，返回 false 将阻止拖拽到对应位置 | ((evt: DragEvent\<Element>, option: { dropNode: TransferDataItem; dragNode: TransferDataItem; dataStatus: { before: ReactText\[]; after: ReactText\[]; }; }) => boolean \| void) | (evt: DragEvent\<Element>, option: { dropNode: TransferDataItem; dragNode: TransferDataItem; dataStatus: { before: ReactText\[]; after: ReactText\[]; }; }) => boolean \| void | - |
| pagination | 开启分页 | boolean \| { pageSize?: number; } \| undefined | false \| true \| { pageSize?: number \| undefined; } | false |
| classNames | | TransferSemanticClassNames | - | - |
| styles | | TransferSemanticStyles | - | - |


### FastTransfer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| searchable | 是否可筛选 | { left?: boolean; right?: boolean \| undefined; } \| undefined | { left?: boolean \| undefined; right?: boolean \| undefined; } | "{&#xA; left: false,&#xA; right: false,&#xA; }" |
| keyword | 搜索关键词 | { left?: string; right?: string \| undefined; } \| undefined | { left?: string \| undefined; right?: string \| undefined; } | - |
| onSearch | 搜索回调 | ((keyword: string, direction: "left" \| "right") => void) | (keyword: string, direction: "left" \| "right") => void | - |
| draggable | 是否开启拖拽 | boolean | true \| false | false |
| disabled | 是否禁用 | boolean | true \| false | false |
| title | 头部标题（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题） | ReactNode\[] | - | - |
| placeholder | 搜索输入框占位内容（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题） | string\[] | - | - |
| emptyContent | 数据为空时的显示内容 | ReactNode\[] | - | - |
| data | 穿梭框数据源 | TransferDataItem\[] | - | \[] |
| fieldNames | 设置data中各项值对应的key | HiBaseFieldNames | - | - |
| targetLimit | 最大可穿梭上限 | number | - | - |
| defaultTargetIds | 默认的目标框内的元素 id 集合 | ReactText\[] | - | \[] |
| targetIds *(required)* | 目标框内的元素 id 集合 | ReactText\[] | - | - |
| targetSortType | 目标框内的排序方式 | "default" \| "queue" | "default" \| "queue" | "default" |
| onChange | 选中元素被移动到目标框内后的回调 | ((targetKey: ReactText\[], direction: "left" \| "right", targetItems: TransferDataItem\[]) => void) | (targetKey: ReactText\[], direction: "left" \| "right", targetItems: TransferDataItem\[]) => void | - |
| render | 自定义每项标题渲染 | ((item: TransferDataItem) => ReactNode) | - | - |
| onDragStart | 拖拽开始时的回调函数 | ((evt: DragEvent\<Element>, option: { dragNode: TransferDataItem; }) => Boolean) | - | - |
| onDrop | 放开拖拽元素时的回调函数，返回 false 将阻止拖拽到对应位置 | ((evt: DragEvent\<Element>, option: { dropNode: TransferDataItem; dragNode: TransferDataItem; dataStatus: { before: ReactText\[]; after: ReactText\[]; }; }) => boolean \| void) | (evt: DragEvent\<Element>, option: { dropNode: TransferDataItem; dragNode: TransferDataItem; dataStatus: { before: ReactText\[]; after: ReactText\[]; }; }) => boolean \| void | - |
| pagination | 开启分页 | boolean \| { pageSize?: number; } \| undefined | false \| true \| { pageSize?: number \| undefined; } | false |


## Type

### TransferDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------- | --------- | ------------- | ------ |
| id | 选项值，唯一 id | ReactText | - | - |
| title | 选项显示内容 | ReactNode | - | - |
| disabled | 是否禁用该选项 | boolean | true \| false | false |
