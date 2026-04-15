# CheckCascader 多项级联选择器

通过采用多级分类的方式将选项进行分隔，便于用户完成多项选择，在不同类型之间切换。

## 使用示例

### 基础用法

展示从多个收起的备选项中选出的多个选项


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Basic = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-basic__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 展现形式

设置展现形式


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Appearance = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-appearance__wrap">
 <h2>Filled</h2>
 <CheckCascader
 style={{ width: 240 }}
 appearance="filled"
 searchable={false}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>Line</h2>
 <CheckCascader
 style={{ width: 240 }}
 appearance="line"
 searchable={false}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>Unset</h2>
 <CheckCascader
 style={{ width: 240 }}
 appearance="unset"
 searchable={false}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>Borderless</h2>
 <CheckCascader
 style={{ width: 240 }}
 appearance="borderless"
 searchable={false}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>Contained</h2>
 <CheckCascader
 style={{ width: 'auto' }}
 appearance="contained"
 searchable={false}
 label="选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 展示全部已选项

设置后，选中内容超出宽度时会换行展示


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const TagInputWrap = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-tag-input-wrap__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 tagInputProps={{
 wrap: true,
 }}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Size = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-size__wrap">
 <h2>xs</h2>
 <CheckCascader
 style={{ width: 240 }}
 size="xs"
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>sm</h2>
 <CheckCascader
 style={{ width: 240 }}
 size="sm"
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>md</h2>
 <CheckCascader
 style={{ width: 240 }}
 size="md"
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 <h2>lg</h2>
 <CheckCascader
 style={{ width: 240 }}
 size="lg"
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 回显模式

不同模式下，选中项的内容不一样，默认是 `ALL` 模式，无论父子节点，选中后就会展示。


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const CheckedMode = () => {
 const [data] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '小米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 return (
 <> 
 <div className="cascader-checked-mode__wrap">
 <h2>ALL（默认）</h2>
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 changeOnSelect
 data={data}
 onChange={console.log}
 ></CheckCascader>

 <h2>PARENT</h2>
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 changeOnSelect
 checkedMode="PARENT"
 data={data}
 onChange={console.log}
 ></CheckCascader>

 <h2>CHILD</h2>
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 changeOnSelect
 checkedMode="CHILD"
 data={data}
 onChange={console.log}
 ></CheckCascader>

 <h2>SEPARATE</h2>
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 changeOnSelect
 checkedMode="SEPARATE"
 data={data}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Disabled = () => {
 const [data] = React.useState(() => {
 const data = [
 {
 id: '0',
 title: '0',
 children: [
 {
 id: '0-0',
 title: '0-0',
 children: [
 {
 id: '0-0-0',
 title: '0-0-0',
 },
 {
 id: '0-0-1',
 title: '0-0-1',
 },
 {
 id: '0-0-2',
 title: '0-0-2',
 },
 ],
 },
 {
 id: '0-1',
 title: '0-1',
 checkable: true,
 children: [
 {
 id: '0-1-0',
 title: '0-1-0',
 },
 {
 id: '0-1-1',
 title: '0-1-1',
 },
 ],
 },
 {
 id: '0-2',
 title: '0-2',
 checkable: true,
 disabled: true,
 children: [
 {
 id: '0-2-0',
 title: '0-2-0',
 },
 {
 id: '0-2-1',
 title: '0-2-1',
 },
 ],
 },
 {
 id: '0-3',
 title: '0-3',
 children: [
 {
 id: '0-3-0',
 title: '0-3-0',
 },
 {
 id: '0-3-1',
 title: '0-3-1',
 },
 {
 id: '0-3-2',
 title: '0-3-2',
 },
 ],
 },
 {
 id: '0-4',
 title: '0-4',
 checkable: true,
 disabledCheckbox: true,
 children: [
 {
 id: '0-4-0',
 title: '0-4-0',
 },
 {
 id: '0-4-1',
 title: '0-4-1',
 },
 ],
 },
 {
 id: '0-5',
 title: '0-5',
 checkable: true,
 children: [
 {
 id: '0-5-0',
 title: '0-5-0',
 },
 {
 id: '0-5-1',
 title: '0-5-1',
 },
 ],
 },
 ],
 },
 {
 id: '1',
 title: '1',
 children: [
 {
 id: '1-0',
 title: '1-0',
 disabledCheckbox: true,
 children: [
 {
 id: '1-0-0',
 title: '1-0-0',
 checkable: false,
 },
 {
 id: '1-0-1',
 title: '1-0-1',
 children: [
 {
 id: '1-0-1-0',
 title: '1-0-1-0',
 },
 {
 id: '1-0-1-1',
 title: '1-0-1-1',
 },
 ],
 },
 {
 id: '1-0-2',
 title: '1-0-2',
 },
 ],
 },
 {
 id: '1-1',
 title: '1-1',
 checkable: false,
 },
 {
 id: '1-2',
 title: '1-2',
 },
 {
 id: '1-3',
 title: '1-3',
 },
 ],
 },
 ]

 return data
 })

 return (
 <>
 <h2>整体禁用</h2>
 <div className="cascader-disabled__wrap">
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 disabled
 searchPlaceholder="请输入搜索内容"
 data={data}
 defaultValue={[['0', '0-2']]}
 />
 </div>

 <h2>禁用某个选项</h2>
 <div className="cascader-disabled__wrap">
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={data}
 defaultValue={[['0', '0-2']]}
 />
 </div>
 </>
 )
}

```


### 禁用 checkbox 级联

禁用后只能用于展示勾选状态，无法进行操作


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const DisabledCheckboxCascaded = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 disabledCheckboxCascaded: true,
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 disabled: true,
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = true
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-disabled-checkbox-cascaded__wrap">
 <CheckCascader
 style={{ width: 240 }}
 changeOnSelect={false}
 checkedMode="CHILD"
 defaultValue={[['小米电视4A']]}
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 带搜索

选项数量较大，不熟悉数据的结构关系情况下，用搜索关键词的方式快速定位


```tsx
import React from 'react'
import CheckCascader, { CheckCascaderDataItem } from '@hi-ui/check-cascader' 
export const Search = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: 'up-1',
 title: 'up',
 children: [
 {
 id: 'up-1-0',
 title: '小米',
 children: [
 {
 id: 'up-1-0-0',
 title: 'leaf',
 },
 ],
 },
 {
 id: 'up-1-1',
 title: '1-1',
 },
 ],
 },
 {
 id: '0',
 title: '0',
 children: [
 {
 id: '0-0',
 title: '0-0',
 children: [
 {
 id: '0-0-0',
 title: '0-0-0',
 },
 {
 id: '0-0-1',
 title: '0-0-1',
 },
 {
 id: '0-0-2',
 title: '0-0-2',
 },
 ],
 },
 {
 id: '0-1',
 title: '0-1',
 checkable: true,
 children: [
 {
 id: '0-1-0',
 title: '0-1-0',
 },
 {
 id: '0-1-1',
 title: '0-1-1',
 },
 ],
 },
 {
 id: '0-2',
 title: '0-2',
 checkable: true,
 children: [
 {
 id: '0-2-0',
 title: '0-2-0',
 },
 {
 id: '0-2-1',
 title: '0-2-1',
 },
 ],
 },
 {
 id: '0-3',
 title: '0-3',
 children: [
 {
 id: '0-3-0',
 title: '0-3-0',
 },
 {
 id: '0-3-1',
 title: '0-3-1',
 },
 {
 id: '0-3-2',
 title: '0-3-2',
 },
 ],
 },
 {
 id: '0-4',
 title: '0-4',
 checkable: true,
 children: [
 {
 id: '0-4-0',
 title: '0-4-0',
 },
 {
 id: '0-4-1',
 title: '0-4-1',
 },
 ],
 },
 {
 id: '0-5',
 title: '0-5',
 checkable: true,
 children: [
 {
 id: '0-5-0',
 title: '0-5-0',
 },
 {
 id: '0-5-1',
 title: '0-5-1',
 },
 ],
 },
 {
 id: '0-6',
 title: '0-6',
 children: [
 {
 id: '0-6-0',
 title: '0-6-0',
 },
 {
 id: '0-6-1',
 title: '0-6-1',
 },
 {
 id: '0-6-2',
 title: '0-6-2',
 },
 ],
 },
 {
 id: '0-7',
 title: '0-7',
 checkable: true,
 children: [
 {
 id: '0-7-0',
 title: '0-7-0',
 },
 {
 id: '0-7-1',
 title: '0-7-1',
 },
 ],
 },
 {
 id: '0-8',
 title: '0-8',
 checkable: true,
 children: [
 {
 id: '0-8-0',
 title: '0-8-0',
 },
 {
 id: '0-8-1',
 title: '0-8-1',
 },
 ],
 },
 ],
 },
 {
 id: '1',
 title: '1',
 children: [
 {
 id: '1-0',
 title: '1-0',
 },
 {
 id: '1-1',
 title: '1-1',
 },
 ],
 },
 {
 id: '2',
 title: '2',
 children: [
 {
 id: '2-0',
 title: '2-0',
 },
 {
 id: '2-1',
 title: '2-1',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: CheckCascaderDataItem[]) => {
 return data.map((item: CheckCascaderDataItem) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 } else {
 item.checkable = true
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 console.log(dataOnlyLeafCheckable)

 return (
 <> 
 <div className="cascader-search__wrap">
 <h2>展示搜索结果：拍平模式（默认）</h2>
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={dataOnlyLeafCheckable}
 searchable
 />
 <h2>展示搜索结果：级联模式</h2>
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={dataOnlyLeafCheckable}
 searchable
 flattedSearchResult={false}
 />
 </div>
 </>
 )
}

```


### 查看已选

只展示选中的选项


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const OnlyChecked = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-only-checked__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 showOnlyShowChecked
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 选择即改变

选中选项即可完成勾选，配合 hover 展开使用


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const SelectChange = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '0',
 title: '0',
 children: [
 {
 id: '0-0',
 title: '0-0',
 children: [
 {
 id: '0-0-0',
 title: '0-0-0',
 },
 {
 id: '0-0-1',
 title: '0-0-1',
 },
 {
 id: '0-0-2',
 title: '0-0-2',
 },
 ],
 },
 {
 id: '0-1',
 title: '0-1',
 checkable: true,
 children: [
 {
 id: '0-1-0',
 title: '0-1-0',
 },
 {
 id: '0-1-1',
 title: '0-1-1',
 },
 ],
 },
 {
 id: '0-2',
 title: '0-2',
 checkable: true,
 disabled: false,
 children: [
 {
 id: '0-2-0',
 title: '0-2-0',
 },
 {
 id: '0-2-1',
 title: '0-2-1',
 },
 ],
 },
 {
 id: '0-3',
 title: '0-3',
 children: [
 {
 id: '0-3-0',
 title: '0-3-0',
 },
 {
 id: '0-3-1',
 title: '0-3-1',
 },
 {
 id: '0-3-2',
 title: '0-3-2',
 },
 ],
 },
 {
 id: '0-4',
 title: '0-4',
 checkable: true,
 disabledCheckbox: true,
 children: [
 {
 id: '0-4-0',
 title: '0-4-0',
 },
 {
 id: '0-4-1',
 title: '0-4-1',
 },
 ],
 },
 {
 id: '0-5',
 title: '0-5',
 checkable: true,
 children: [
 {
 id: '0-5-0',
 title: '0-5-0',
 },
 {
 id: '0-5-1',
 title: '0-5-1',
 },
 ],
 },
 ],
 },
 {
 id: '1',
 title: '1',
 children: [
 {
 id: '1-0',
 title: '1-0',
 disabledCheckbox: true,
 },
 {
 id: '1-1',
 title: '1-1',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 } else {
 item.checkable = true
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-select-change__wrap">
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 changeOnSelect
 expandTrigger="hover"
 searchPlaceholder="请输入搜索内容"
 data={dataOnlyLeafCheckable}
 />
 </div>
 </>
 )
}

```


### 异步加载数据


```tsx
import Alert from '@hi-ui/alert'
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Dynamic = () => {
 const [treeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '小米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 // 加载节点
 const loadChildren = async (node) => {
 return fetch(`https://my-json-server.typicode.com/hiui-group/db/conditiondata?id=${node.id}`)
 .then((res) => res.json())
 .then((data) => {
 if (data[0]) {
 data[0].id = Math.random()
 }

 // setTreeData((prev) => {
 // const nextData = cloneTree(prev)
 // const loadNode = findNode(node.id, nextData)
 // loadNode.children = data
 // console.log(loadNode, nextData)
 // return nextData
 // })

 return data
 })
 }

 return (
 <> 
 <div className="check-cascader-dynamic__wrap">
 <Alert
 type="danger"
 closeable={false}
 showIcon={false}
 title={
 '注意：对于异步加载子节点，可以配合 `node.isLeaf: true` 来表明是否为叶子结点。以此来告诉组件是否有下一级子面板'
 }
 ></Alert>
 <br />
 <CheckCascader
 style={{ width: 240 }}
 data={treeData}
 onLoadChildren={loadChildren}
 defaultValue={[[1]]}
 checkedMode="PARENT"
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 自定义回显展示


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const DisplayRender = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 console.log(dataOnlyLeafCheckable)

 return (
 <> 
 <div className="cascader-display-render__wrap">
 <CheckCascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 data={dataOnlyLeafCheckable}
 displayRender={(option) => {
 const titleArr = []
 while (option.parent) {
 titleArr.push(option.title)
 option = option.parent
 }
 return titleArr.reverse().join(' | ')
 }}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 吸底内容条


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Footer = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-footer__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 renderExtraFooter={() => <div>custom footer</div>}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 自定义下拉菜单内容


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const DropdownColumnRender = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 {
 id: '1',
 title: '小米1',
 },
 {
 id: '2',
 title: '小米2',
 },
 {
 id: '3',
 title: '小米3',
 },
 {
 id: '4',
 title: '小米4',
 },
 {
 id: '5',
 title: '小米5',
 },
 {
 id: '6',
 title: '小米6',
 },
 {
 id: '7',
 title: '小米7',
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-dropdown-column-render__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 // 如果有样式不满足需求，可以给弹出层设置独有的 className 来进行样式覆写
 overlay={{ className: 'my-overlay' }}
 dropdownColumnRender={(menu, level) => {
 return level < 5 ? (
 <div
 className="custom-menu"
 style={{ overflow: 'hidden', borderRight: '1px solid #e6e8eb' }}
 >
 <header
 style={{
 padding: 8,
 borderBottom: '1px solid #e6e8eb',
 }}
 >
 header
 </header>
 {React.cloneElement(menu, { style: { height: 180 } })}
 <footer
 style={{
 padding: 8,
 borderTop: '1px solid #e6e8eb',
 }}
 >
 footer(level {level})
 </footer>
 </div>
 ) : (
 menu
 )
 }}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 前后内置元素

将选择框与内置的其他元素组合使用


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-basic__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 // clearable
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 tagInputProps={{ wrap: true }}
 prefix={<AppStoreOutlined style={{ color: '#333' }} />}
 suffix={<InfoCircleOutlined style={{ color: '#333' }} />}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader'
import Input from '@hi-ui/input' 
export const CusotmRender = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="check-cascader-custom-render__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 changeOnSelect
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 customRender={(data) => {
 let value = ''
 if (data) {
 value = data?.map((item) => item?.title).join(',')
 }
 return <Input value={!value ? '' : value} placeholder="请选择" />
 }}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 大数据

支持大数据下的虚拟滚动


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const Virtual = () => {
 const [dataOnlyLeafCheckable] = React.useState(() => {
 const data = [
 // 随机生成 10 * 10 * 1000 条的级联数据
 ...Array.from({ length: 100 }, (_, index) => ({
 id: `item-${index}`,
 title: `item-${index}`,
 children: Array.from({ length: 10 }, (_, index2) => ({
 id: `item-${index}-${index2}`,
 title: `item-${index}-${index2}`,
 children: Array.from({ length: 1000 }, (_, index3) => ({
 id: `item-${index}-${index2}-${index3}`,
 title: `item-${index}-${index2}-${index3}`,
 })),
 })),
 })),
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="cascader-virtual__wrap">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 virtual
 data={dataOnlyLeafCheckable}
 onChange={console.log}
 ></CheckCascader>
 </div>
 </>
 )
}

```


### 全选


```tsx
import React from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const CheckAll = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 children: [
 {
 id: '0-0-1',
 title: 'Redmi K30',
 },
 {
 id: '0-0-2',
 title: 'Redmi K30 Pro',
 },
 {
 id: '0-0-3',
 title: 'Redmi 10X 5G',
 },
 {
 id: '0-0-4',
 title: 'Redmi Note 8',
 },
 {
 id: '0-0-5',
 title: 'Redmi 9',
 },
 {
 id: '0-0-6',
 title: 'Redmi 9A',
 },
 ],
 },
 {
 title: '小米手机',
 id: '0-1',
 children: [
 {
 id: '0-1-1',
 title: '小米10 Pro',
 },
 {
 id: '0-1-2',
 title: '小米10',
 },
 {
 id: '0-1-3',
 title: '小米10 青春版 5G',
 },
 {
 id: '0-1-4',
 title: '小米MIX Alpha',
 },
 ],
 },
 ],
 },
 {
 title: '电视',
 id: '1',
 children: [
 {
 title: '小米电视 大师 65英寸OLED',
 id: '1-0',
 },
 {
 title: 'Redmi 智能电视 MAX 98',
 id: '1-1',
 },
 {
 title: '小米电视4A 60英寸',
 id: '1-2',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="check-cascader-check-all__wrap">
 <CheckCascader
 style={{ width: 240 }}
 data={data}
 showCheckAll
 checkedMode="PARENT"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 自定义头尾


```tsx
import React, { useState } from 'react'
import CheckCascader from '@hi-ui/check-cascader' 
export const ExtraRender = () => {
 const [dataOnlyLeafCheckable] = useState(() => {
 const data = [
 {
 id: '手机',
 title: '手机t',
 children: [
 {
 id: '小米',
 title: '小米t',
 children: [
 {
 id: '小米3',
 title: '小米3t',
 },
 {
 id: '小米4',
 title: '小米4t',
 },
 ],
 },
 {
 id: '红米',
 title: '红米t',
 children: [
 {
 id: '红米3',
 title: '红米3t',
 },
 {
 id: '红米4',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视t',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4At',
 },
 {
 id: '小米电视4C',
 title: '小米电视4Ct',
 },
 ],
 },
 ]

 const getDataOnlyLeafCheckable = (data: any) => {
 return data.map((item: any) => {
 if (item.children) {
 item.checkable = item.checkable ?? false
 item.children = getDataOnlyLeafCheckable(item.children)
 }

 return item
 })
 }

 const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

 return dataOnlyLeafCheckable
 })

 return (
 <> 
 <div className="check-cascader-extra-render">
 <CheckCascader
 style={{ width: 240 }}
 searchable={false}
 placeholder="请选择品类"
 defaultValue={[['手机', '红米', '红米4']]}
 changeOnSelect
 data={dataOnlyLeafCheckable}
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={() => 'custom footer'}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 CheckCascader 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 menuList/menu/option）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import CheckCascader, { CheckCascaderSemanticName } from '@hi-ui/check-cascader' 
export const Semantic = () => {
 const [data] = React.useState(() => [
 {
 id: '手机',
 title: '手机',
 children: [
 {
 id: '小米',
 title: '小米',
 children: [
 { id: '小米3', title: '小米3' },
 { id: '小米4', title: '小米4' },
 ],
 },
 {
 id: '红米',
 title: '红米',
 children: [
 { id: '红米3', title: '红米3' },
 { id: '红米4', title: '红米4' },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视',
 children: [
 { id: '小米电视4A', title: '小米电视4A' },
 { id: '小米电视4C', title: '小米电视4C' },
 ],
 },
 ])

 const [selected, setSelected] = useState<CheckCascaderSemanticName>()

 return (
 <> 
 <div className="check-cascader-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <CheckCascader
 searchable
 data={data}
 classNames={{
 root: 'my-check-cascader__root',
 container: 'my-check-cascader__container',
 panel: 'my-check-cascader__panel',
 header: 'my-check-cascader__header',
 search: 'my-check-cascader__search',
 body: 'my-check-cascader__body',
 footer: 'my-check-cascader__footer',
 menuList: 'my-check-cascader__menu-list',
 menu: 'my-check-cascader__menu',
 option: 'my-check-cascader__option',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 panel: {
 overflow: 'unset',
 ...(selected === 'panel'
 ? {
 outline: '1px solid #ffbe0a',
 }
 : {}),
 },
 body: {
 overflow: 'unset',
 ...(selected === 'body'
 ? {
 outline: '1px solid #ffbe0a',
 }
 : {}),
 },
 menuList: {
 overflow: 'unset',
 ...(selected === 'menuList'
 ? {
 outline: '1px solid #ffbe0a',
 }
 : {}),
 },
 }}
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={() => 'custom footer'}
 // @ts-ignore
 overlay={{ flip: false }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'container', description: '下拉容器' },
 { title: 'panel', description: '下拉面板' },
 { title: 'header', description: '头部' },
 { title: 'search', description: '搜索区' },
 { title: 'body', description: '内容区' },
 { title: 'footer', description: '底部' },
 { title: 'menuList', description: '菜单列表容器' },
 { title: 'menu', description: '单列菜单' },
 { title: 'option', description: '选项' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as CheckCascaderSemanticName)}
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

### CheckCascader Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| data | 设置选择项数据源 | CheckCascaderDataItem\[] | - | \[] |
| fieldNames | 设置 data 中字段对应的 key | HiBaseFieldNames | - | - |
| value | 设置当前多选值 | ReactText\[]\[] | - | - |
| defaultValue | 设置当前多选值默认值 | ReactText\[]\[] | - | \[] |
| onChange | 多选值改变时的回调 | ((values: ReactText\[]\[], targetOption?: CheckCascaderItemEventData, optionPaths?: FlattedCheckCascaderDataItem\[] \| undefined) => void) \| undefined | (values: ReactText\[]\[], targetOption?: CheckCascaderItemEventData \| undefined, optionPaths?: FlattedCheckCascaderDataItem\[] \| undefined) => void | - |
| expandTrigger | 次级菜单的展开方式 | CheckCascaderExpandTriggerEnum | "click" \| "hover" | - |
| searchable | 是否可搜索（仅在 title 为字符串时支持） | boolean | true \| false | - |
| clearable | 是否可清空 | boolean | true \| false | - |
| onClear | 点击关闭按钮时触发 | (() => void) | - | - |
| disabled | 是否禁止使用 | boolean | true \| false | false |
| emptyContent | 设置选项为空时展示的内容 | ReactNode | - | - |
| changeOnSelect | 是否启用选择即改变功能 | boolean | true \| false | - |
| render | 自定义渲染节点的 title 内容 | ((item: CheckCascaderItemEventData) => ReactNode) | - | - |
| displayRender | 自定义选择后触发器所展示的内容 | ((checkedOption: FlattedCheckCascaderDataItem) => ReactNode) | - | - |
| checkCascaded | 支持 checkbox 级联（正反选）功能 | boolean | true \| false | - |
| flattedSearchResult | 搜索结果拍平展示 | boolean | true \| false | true |
| placeholder | 触发器输入框占位符 | string | - | - |
| searchPlaceholder | 搜索输入框占位符 | string | - | - |
| onLoadChildren | 异步请求更新数据 | ((item: CheckCascaderItemEventData, idPaths: ReactText\[]) => void \| Promise\<void \| CheckCascaderDataItem\[]>) | (item: CheckCascaderItemEventData, idPaths: ReactText\[]) => void \| Promise\<void \| CheckCascaderDataItem\[]> | - |
| appearance | 设置展现形式 | CheckCascaderAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: any) => boolean) | - | - |
| checkedMode | 多选数据交互时回填、回显模式&#xA;PARENT: 当所有子节点被选中时将只保留父节点&#xA;ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）&#xA;CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）&#xA;SEPARATE：父子完全独立受控 | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | - |
| tagInputProps | TagInput 参数设置 | TagInputMockProps | - | - |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | (() => ReactNode) | - | - |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| dropdownColumnRender | 自定义下拉菜单每列渲染 | ((menu: ReactElement\<any, string \| JSXElementConstructor\<any>>, level: number) => ReactNode) | (menu: ReactElement\<any, string \| JSXElementConstructor\<any>>, level: number) => ReactNode | - |
| customRender | 自定义触发器 | ReactNode \| ((selectItems: (FlattedCheckCascaderDataItem)\[], value?: ReactText\[] \| undefined) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (selectItems: (FlattedCheckCascaderDataItem \| undefined)\[], value?: ReactText\[] \| undefined) => ReactNode | - |
| showOnlyShowChecked | 是否只展示选中的选项 | boolean | true \| false | - |
| virtual | 是否开启虚拟滚动 | boolean | true \| false | - |
| showCheckAll | 是否开启全选功能 | boolean | true \| false | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | true |
| loading | 是否在加载中 | boolean | true \| false | - |
| loadingContent | 加载中时的提示 | ReactNode | - | - |
| showEmpty | 展示未搜索结果 | boolean | true \| false | - |
| optionWidth | 自定义下拉选项宽度 | Width\<string \| number> | string \| number \| string & {} | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| keyword | 搜索关键字，searchable 为 true 时有效 | string | - | - |
| creatableInSearch | 在搜索状态下是否可创建选项 | boolean | true \| false | - |
| creatableInSearchVisible | 是否显示「创建选项」入口。为 false 时不显示。&#xA;不传（undefined）时保持兼容：只要有搜索词即显示创建入口。&#xA;Select/CheckSelect 会传入此 prop，实现「仅当无结果或关键字与结果无全匹配时显示」。 | boolean | true \| false | - |
| createTitle | 创建选项时展示的标题 | string | - | - |
| onCreate | 创建选项时触发回调 | ((keyword: string) => void) | - | - |
| onSearch | 搜索时触发回调 | ((keyword: string) => void) | - | - |
| clearSearchOnClosed | 是否在关闭时清除搜索 | boolean | true \| false | - |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 下拉菜单打开时回调 | (() => void) | - | - |
| onClose | 下拉菜单关闭时回调 | (() => void) | - | - |
| onOverlayScroll | 下拉列表滚动时的回调 | (() => void) | - | - |
| gutterGap | 气泡卡片与触发器的间距 | number | - | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<PickerHelper> | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | CheckCascaderSemanticClassNames | - | - |
| styles | | CheckCascaderSemanticStyles | - | - |


## Type

### CheckCascaderDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------------------------------------------------------------- | ----------------------- | ------------- | ------ |
| id | 选择项值，唯一 id | ReactText | - | - |
| title | 选项标题 | ReactNode | - | - |
| children | 下一级选项列表 | CheckCascaderDataItem[] | - | - |
| disabled | 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用） | boolean | true \| false | false |
| isLeaf | 是否为叶子节点，当 children 为空数组也表示为叶子结点 | boolean | true \| false | - |
| checkable | 是否开启 checkbox 功能 | boolean | true \| false | - |
| disabledCheckbox | 是否禁用该节点 checkbox 功能 | boolean | true \| false | - |
| disabledCheckboxCascaded | 是否禁用该节点 checkbox 级联功能，禁用后只能用于展示勾选状态，无法进行操作 | boolean | true \| false | - |

### CheckCascaderItemEventData

> 继承自 CheckCascaderDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------ | ---------------------------- | ------ | ------ |
| children | 下一级选项列表 | CheckCascaderItemEventData[] | - | - |
| raw | 关联用户传入的原始数据对象 | CheckCascaderDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的父节点 | CheckCascaderItemEventData | - | - |

### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | false |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |
