# Filter 筛选

多个维度筛选

## 使用示例

### 基础用法

一般作为筛选场景，作为筛选项


```tsx
import React from 'react'
import Filter from '@hi-ui/filter' 
export const Basic = () => {
 const [dataStore] = React.useState([
 {
 id: 1,
 title: '小米商城',
 },
 {
 id: 2,
 title: '米家有品',
 },
 {
 id: 3,
 title: '京东商城',
 },
 {
 id: 4,
 title: '天猫淘宝',
 },
 {
 id: 5,
 title: '创新渠道',
 },
 {
 id: 6,
 title: '线下KA',
 },
 {
 id: 7,
 title: '线下KA1',
 },
 {
 id: 8,
 title: '线下KA2',
 },
 {
 id: 9,
 title: '线下KA3',
 },
 {
 id: 10,
 title: '线下KA4',
 },
 ])

 const [dataColor] = React.useState([
 {
 id: 1,
 title: '深空',
 },
 {
 id: 2,
 title: '白色',
 },
 {
 id: 3,
 title: '亮黑色',
 },
 {
 id: 4,
 title: '金色',
 },
 ])

 return (
 <> 
 <div className="filter-basic__wrap">
 <Filter
 label={['渠道']}
 defaultValue={[1]}
 data={dataStore}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 <Filter
 label={['颜色']}
 defaultValue={[1]}
 data={dataColor}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 </div>
 </>
 )
}

```


### 级联选择

一般作为筛选场景，作为筛选项组合,每个级别之间有联动


```tsx
import React from 'react'
import Filter from '@hi-ui/filter' 
export const Cascade = () => {
 return (
 <> 
 <div className="filter-cascade__wrap">
 <Filter
 label={['渠道', '分店', '机型']}
 defaultValue={[2, 21]}
 data={[
 {
 id: 1,
 title: '小米商城',
 children: [
 {
 id: 11,
 title: '小米商城',
 },
 {
 id: 12,
 title: '米家优品',
 disabled: true,
 },
 ],
 },
 {
 id: 2,
 title: '米家有品',
 children: [
 {
 id: 21,
 title: '五彩城店',
 children: [
 {
 id: '小米9',
 title: '小米9',
 },
 {
 id: '小米MIXS',
 title: '小米MIXS',
 },
 {
 id: '小米8',
 title: '小米8',
 },
 ],
 },
 {
 id: 22,
 title: '清河店',
 },
 {
 id: 23,
 title: '西三旗店',
 },
 ],
 },

 {
 id: 3,
 title: '京东商城',
 children: [
 {
 id: 31,
 title: '小米直营',
 children: [
 {
 id: '线下KA',
 title: '线下KA',
 },
 ],
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


### 受控


```tsx
import React from 'react'
import Filter from '@hi-ui/filter' 
export const Controlled = () => {
 const [value, setValue] = React.useState<React.ReactText[]>([2, 21])

 const data = [
 {
 id: 1,
 title: '小米商城',
 children: [
 {
 id: 11,
 title: '小米商城',
 },
 {
 id: 12,
 title: '米家优品',
 disabled: true,
 },
 ],
 },
 {
 id: 2,
 title: '米家有品',
 children: [
 {
 id: 21,
 title: '五彩城店',
 children: [
 {
 id: '小米9',
 title: '小米9',
 },
 {
 id: '小米MIXS',
 title: '小米MIXS',
 },
 {
 id: '小米8',
 title: '小米8',
 },
 ],
 },
 {
 id: 22,
 title: '清河店',
 },
 {
 id: 23,
 title: '西三旗店',
 },
 ],
 },

 {
 id: 3,
 title: '京东商城',
 children: [
 {
 id: 31,
 title: '小米直营',
 children: [
 {
 id: '线下KA',
 title: '线下KA',
 },
 ],
 },
 ],
 },
 ]

 return (
 <> 
 <div className="filter-controlled__wrap">
 <Filter
 label={['渠道', '分店', '机型']}
 value={value}
 onChange={(ids, targetItem) => {
 console.log('onChange', ids, targetItem)
 setValue(ids)
 }}
 data={data}
 />
 </div>
 </>
 )
}

```


### 下划线


```tsx
import React from 'react'
import Filter from '@hi-ui/filter' 
export const Underlined = () => {
 return (
 <> 
 <div className="filter-underline__wrap">
 <Filter
 showUnderline
 label={['渠道', '分店', '机型']}
 defaultValue={[2, 21]}
 data={[
 {
 id: 1,
 title: '小米商城',
 children: [
 {
 id: 11,
 title: '小米商城',
 },
 {
 id: 12,
 title: '米家优品',
 disabled: true,
 },
 ],
 },
 {
 id: 2,
 title: '米家有品',
 children: [
 {
 id: 21,
 title: '五彩城店',
 children: [
 {
 id: '小米9',
 title: '小米9',
 },
 {
 id: '小米MIXS',
 title: '小米MIXS',
 },
 {
 id: '小米8',
 title: '小米8',
 },
 ],
 },
 {
 id: 22,
 title: '清河店',
 },
 {
 id: 23,
 title: '西三旗店',
 },
 ],
 },

 {
 id: 3,
 title: '京东商城',
 children: [
 {
 id: 31,
 title: '小米直营',
 children: [
 {
 id: '线下KA',
 title: '线下KA',
 },
 ],
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


### 设置选中时的形状


```tsx
import React from 'react'
import Filter from '@hi-ui/filter' 
export const Appearance = () => {
 const [dataStore] = React.useState([
 {
 id: 1,
 title: '小米商城',
 },
 {
 id: 2,
 title: '米家有品',
 },
 {
 id: 3,
 title: '京东商城',
 },
 {
 id: 4,
 title: '天猫淘宝',
 },
 {
 id: 5,
 title: '创新渠道',
 },
 {
 id: 6,
 title: '线下KA',
 },
 {
 id: 7,
 title: '线下KA1',
 },
 {
 id: 8,
 title: '线下KA2',
 },
 {
 id: 9,
 title: '线下KA3',
 },
 {
 id: 10,
 title: '线下KA4',
 },
 ])

 const [dataColor] = React.useState([
 {
 id: 1,
 title: '深空',
 },
 {
 id: 2,
 title: '白色',
 },
 {
 id: 3,
 title: '亮黑色',
 },
 {
 id: 4,
 title: '金色',
 },
 ])

 return (
 <> 
 <div className="filter-appearance__wrap">
 <h2>link</h2>
 <Filter
 label={['渠道']}
 appearance="link"
 defaultValue={[1]}
 data={dataStore}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 <Filter
 label={['颜色']}
 appearance="link"
 defaultValue={[1]}
 data={dataColor}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 <h2>filled</h2>
 <Filter
 label={['渠道']}
 appearance="filled"
 defaultValue={[1]}
 data={dataStore}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 <Filter
 label={['颜色']}
 appearance="filled"
 defaultValue={[1]}
 data={dataColor}
 onChange={(value) => {
 console.log('value', value)
 }}
 />
 </div>
 </>
 )
}

```


## Props

### Filter Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------- | ------------------ | ------ |
| appearance | 筛选表头选择时形状 | "link" \| "filled" | "link" \| "filled" | "link" |
| showUnderline | 是否显示下划线 | boolean | true \| false | false |
| labelWidth | 筛选标题宽度 | number | - | - |
| label | 筛选标题列表 | ReactText\[] | - | - |
| data | 筛选选项数据 | FilterDataItem\[] | - | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | HiBaseFieldNames | - | - |
| defaultValue | 默认选中项的值 | ReactText\[] | - | - |
| value | 被选中项的值 | ReactText\[] | - | - |
| onChange | 选择时的回调函数，	value 表示选中项的 ID 集合 | ((value: ReactText\[], targetItem: FilterDataItem) => void) | - | - |


## Type

### FilterDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------------- | ---------------- | ------------- | ------ |
| title | 选项的展示内容 | string | - | - |
| id | 选项对应的值，唯一 id | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| children | 级联筛选项列表 | FilterDataItem[] | - | - |
