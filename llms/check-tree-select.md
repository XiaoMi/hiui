# CheckTreeSelect 多选树形选择器

一种接收树形数据结构的多项选择器，为用户提供复杂数据展示的能力。

## 使用示例

### 基础用法

展示从全部备选项选出的部分选项


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Basic = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-basic__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Controlled = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['0-0'])
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-controlled__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 clearable
 checkedMode="PARENT"
 value={value}
 onChange={(checkedIds) => {
 setValue(checkedIds)
 }}
 ></CheckTreeSelect>
 </div>
 </>
 )
}

```


### 非受控


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Uncontrolled = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-uncontrolled__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 clearable
 defaultValue={['1-0']}
 data={data}
 ></CheckTreeSelect>
 </div>
 </>
 )
}

```


### 回显模式

不同模式下，选中项的内容不一样，默认是 `ALL` 模式，无论父子节点，选中后就会展示。


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const CheckedMode = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-checked-mode__wrap">
 <h2>ALL（默认）</h2>
 <CheckTreeSelect style={{ width: 240 }} data={data} onChange={console.log} />

 <h2>PARENT</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 onChange={console.log}
 checkedMode="PARENT"
 />

 <h2>CHILD</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 onChange={console.log}
 checkedMode="CHILD"
 />

 <h2>SEPARATE</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 onChange={console.log}
 checkedMode="SEPARATE"
 />
 </div>
 </>
 )
}

```


### 禁用


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Disabled = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-disabled__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 disabled
 checkedMode="PARENT"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 展示全部已选项

设置后，选中内容超出宽度时会换行展示


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const TagInputWrap = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-tag-input-wrap__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 tagInputProps={{
 wrap: true,
 }}
 />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性、无UI三种


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Appearance = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['0-0'])
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 disabled: true,
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
 <div className="tree-select-appearance__wrap">
 <div>
 <h2>filled</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="filled"
 onChange={(value, options) => {
 console.log('CheckTreeSelect onChange: ', value, options)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>outline</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="line"
 onChange={(value, options) => {
 console.log('CheckTreeSelect onChange: ', value, options)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>unset</h2>
 <CheckTreeSelect
 data={data}
 value={value}
 clearable
 appearance="unset"
 // 取消下拉框匹配 input 触发器的宽度
 overlay={{ matchWidth: false }}
 onChange={(value, options) => {
 console.log('CheckTreeSelect onChange: ', value, options)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>borderless</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="borderless"
 onChange={(value, options) => {
 console.log('CheckTreeSelect onChange: ', value, options)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>contained</h2>
 <CheckTreeSelect
 style={{ width: 'auto' }}
 data={data}
 value={value}
 clearable
 showOnlyShowChecked
 appearance="contained"
 label="选择品类"
 // 取消下拉框匹配 input 触发器的宽度
 overlay={{ matchWidth: false }}
 onChange={(value, options) => {
 console.log('CheckTreeSelect onChange: ', value, options)
 setValue(value)
 }}
 />
 </div>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Size = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-size__wrap">
 <h2>xs</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 size="xs"
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 />
 <h2>sm</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 size="sm"
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 />
 <h2>md</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 size="md"
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 />
 <h2>lg</h2>
 <CheckTreeSelect
 style={{ width: 240 }}
 size="lg"
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 清空选中项


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Clearable = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 disabled: true,
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
 <div className="tree-select-clearable__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 clearable
 data={data}
 onChange={(checkedIds, options) => {
 console.log('CheckTreeSelect onChange: ', checkedIds, options)
 }}
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
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const Searchable = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 disabled: true,
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

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 console.log(keyword, item)

 const match = (node: any) =>
 typeof node.title === 'string' && node.title.indexOf(keyword) !== -1

 const matchUp = (node: any) => {
 let found = match(node)
 const { children } = node

 if (children && !found) {
 found = children.some((item: any) => matchUp(item))
 }

 return found
 }

 return matchUp(item)
 }, [])

 const [keyword, setKeyword] = React.useState('小米')

 return (
 <> 
 <div className="tree-select-searchable__wrap">
 <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
 highlight 仅高亮
 </div>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 searchable
 searchMode="highlight"
 onChange={(checkedIds, options) => {
 console.log('CheckTreeSelect onChange: ', checkedIds, options)
 }}
 />

 <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
 filter 高亮并且过滤无关节点
 </div>

 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 searchable
 keyword={keyword}
 onSearch={setKeyword}
 searchMode="filter"
 onChange={(checkedIds, options) => {
 console.log('CheckTreeSelect onChange: ', checkedIds, options)
 }}
 />

 <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
 filterOption 自定义搜索策略
 </div>
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 searchable
 filterOption={filterOptionMemo}
 onChange={(checkedIds, options) => {
 console.log('CheckTreeSelect onChange: ', checkedIds, options)
 }}
 />
 </div>
 </>
 )
}

```


### 异步加载数据

备选项数量较大时，通过搜索选项关键词调取存储于服务端的数据备选项


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const DataSource = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-data-source__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={[]}
 dataSource={(keyword) => {
 return new Promise((resolve) => {
 // 递归过滤所有嵌套子节点，保留匹配的分支
 function filterTree(nodes: any[]): any[] {
 return nodes
 .map((node: any) => {
 if (node.children) {
 const filteredChildren = filterTree(node.children)
 if (node.title.includes(keyword) || filteredChildren.length > 0) {
 return { ...node, children: filteredChildren }
 }
 } else if (node.title.includes(keyword)) {
 return node
 }
 return null
 })
 .filter(Boolean)
 }
 const filteredData = filterTree(data)

 setTimeout(() => {
 resolve(filteredData)
 }, 1000)
 })
 }}
 checkedMode="PARENT"
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 默认展开全部


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const DefaultExpandAll = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 disabled: true,
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
 <div className="tree-select-default-expand-all__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 defaultExpandAll
 onChange={(checkedIds, options) => {
 console.log('CheckTreeSelect onChange: ', checkedIds, options)
 }}
 />
 </div>
 </>
 )
}

```


### 全选


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
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
 <div className="check-tree-select-check-all__wrap">
 <CheckTreeSelect
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


### 大数据


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const VirtualList = () => {
 const [data] = React.useState(() => {
 // 模拟 10^4 个数据量
 function dig(path = '0', level) {
 const list: any = []
 for (let i = 0; i < 5; i += 1) {
 const id = `${path}-${i}`
 const treeNode = {
 title: id,
 id,
 children: [] as any[],
 }

 if (level > 0) {
 treeNode.children = dig(id, level - 1)
 }

 list.push(treeNode)
 }
 return list
 }

 const treeData = dig('0', 4)
 return treeData
 })

 return (
 <> 
 <div className="check-tree-select-virtual-list__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 virtual
 height={260}
 />
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const CustomRender = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-custom-render__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 customRender={(value) => {
 return (
 <Input value={value.map((v) => v.title).join(',')} readOnly placeholder="请选择" />
 )
 }}
 />
 </div>
 </>
 )
}

```


### 前后内置元素


```tsx
import React from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-addon__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 tagInputProps={{ wrap: true }}
 prefix={<AppStoreOutlined />}
 suffix={<InfoCircleOutlined style={{ marginRight: 8 }} />}
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
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const OnlyChecked = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-only-checked__wrap">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 onChange={console.log}
 showOnlyShowChecked
 />
 </div>
 </>
 )
}

```


### 自定义头尾


```tsx
import React, { useState } from 'react'
import CheckTreeSelect from '@hi-ui/check-tree-select' 
export const ExtraRender = () => {
 const [data] = useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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
 <div className="check-tree-select-extra-render">
 <CheckTreeSelect
 style={{ width: 240 }}
 data={data}
 checkedMode="PARENT"
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={() => <div>custom footer</div>}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 CheckTreeSelect 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 tree）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import CheckTreeSelect, { CheckTreeSelectSemanticName } from '@hi-ui/check-tree-select' 
export const Semantic = () => {
 const [data] = React.useState([
 {
 title: '手机类',
 id: '0',
 children: [
 {
 title: 'Redmi系列',
 id: '0-0',
 disabled: true,
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

 const [selected, setSelected] = useState<CheckTreeSelectSemanticName>()

 return (
 <> 
 <div className="check-tree-select-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <CheckTreeSelect
 style={{ width: 240 }}
 searchable
 searchMode="filter"
 visible
 clearable
 data={data}
 classNames={{
 root: 'my-check-tree-select__root',
 container: 'my-check-tree-select__container',
 panel: 'my-check-tree-select__panel',
 header: 'my-check-tree-select__header',
 search: 'my-check-tree-select__search',
 body: 'my-check-tree-select__body',
 footer: 'my-check-tree-select__footer',
 tree: 'my-check-tree-select__tree',
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
 { title: 'tree', description: '树容器' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as CheckTreeSelectSemanticName)}
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

### CheckTreeSelect Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| data | 展示数据 | CheckTreeSelectDataItem\[] | - | \[] |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增)	object	-	{ title: 'title', id: 'id',disabled:'disabled', children: 'children'} | Record\<string, string> | - | "{} as any" |
| checkedMode | 多选数据交互时回填、回显模式&#xA;PARENT: 当所有子节点被选中时将只保留父节点&#xA;ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）&#xA;CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）&#xA;SEPARATE：父子完全独立受控 | "ALL" \| "PARENT" \| "CHILD" \| "SEPARATE" | "ALL" \| "PARENT" \| "CHILD" \| "SEPARATE" | "ALL" |
| bordered | 是否有边框 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| defaultExpandAll | 是否默认展开所有树节点 | boolean | true \| false | false |
| expandedIds | 展开的节点（受控） | ReactText\[] | - | - |
| defaultExpandedIds | 默认展开的节点（非受控） | ReactText\[] | - | \[] |
| onExpand | 节点被点击(展开/收起)时触发 | (() => void) | - | - |
| defaultValue | 默认选中项 （非受控） | ReactText\[] | - | \[] |
| value | 默认选中项 （受控） | ReactText\[] | - | - |
| displayRender | 自定义渲染 Input 中展示内容 | ((item: CheckTreeSelectDataItem) => ReactNode) | - | - |
| placeholder | 输入框占位	string	-	请选择 | string | - | - |
| searchMode | 节点搜索模式，仅在mode=normal模式下生效 | "filter" \| "highlight" | "filter" \| "highlight" | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: CheckTreeSelectDataItem) => boolean) | - | - |
| render | 自定义渲染节点的 title 内容 | ((node: CheckTreeSelectItemEventData) => ReactNode) | - | - |
| onLoadChildren | 点击异步加载子项 | ((node: CheckTreeSelectItemEventData) => void \| Promise\<void \| CheckTreeSelectDataItem\[]>) | (node: CheckTreeSelectItemEventData) => void \| Promise\<void \| CheckTreeSelectDataItem\[]> | - |
| emptyContent | 没有选项时的提示 | ReactNode | - | - |
| optionWidth | 自定义下拉选项宽度 | number | - | - |
| overlayClassName | 下拉根元素的类名称 (3.0 新增) | string | - | - |
| onChange | 选中时触发&#xA;checkedIds: 选中项 ID 集合&#xA;checkedNodes: 选中项数据项集合&#xA;targetNode: 当前操作节点，清空时为 null&#xA;checked: 当前操作是否为选中操作 | ((checkedIds: ReactText\[], options: { checkedNodes: CheckTreeSelectDataItem\[]; semiCheckedIds: ReactText\[]; targetNode: CheckTreeSelectItemEventData \| null; checked: boolean; }) => void) | (checkedIds: ReactText\[], options: { checkedNodes: CheckTreeSelectDataItem\[]; semiCheckedIds: ReactText\[]; targetNode: CheckTreeSelectItemEventData \| null; checked: boolean; }) => void | - |
| clearable | 是否可清空 | boolean | true \| false | - |
| onClear | 点击关闭按钮时触发 | (() => void) | - | - |
| appearance | 设置展现形式 | CheckTreeSelectAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | - |
| showCheckAll | 是否开启全选功能 | boolean | true \| false | - |
| showOnlyShowChecked | 是否开启查看仅已选功能 | boolean | true \| false | false |
| tagInputProps | TagInput 参数设置 | TagInputMockProps | - | - |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| customRender | 自定义触发器 | ReactNode \| ((option: CheckTreeSelectDataItem\[]) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (option: CheckTreeSelectDataItem\[]) => ReactNode | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | true |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | (() => ReactNode) | - | - |
| loading | 是否在加载中 | boolean | true \| false | - |
| loadingContent | 加载中时的提示 | ReactNode | - | - |
| showEmpty | 展示未搜索结果 | boolean | true \| false | - |
| searchable | 是否可搜索 | boolean | true \| false | - |
| keyword | 搜索关键字，searchable 为 true 时有效 | string | - | - |
| creatableInSearch | 在搜索状态下是否可创建选项 | boolean | true \| false | - |
| creatableInSearchVisible | 是否显示「创建选项」入口。为 false 时不显示。&#xA;不传（undefined）时保持兼容：只要有搜索词即显示创建入口。&#xA;Select/CheckSelect 会传入此 prop，实现「仅当无结果或关键字与结果无全匹配时显示」。 | boolean | true \| false | - |
| createTitle | 创建选项时展示的标题 | string | - | - |
| onCreate | 创建选项时触发回调 | ((keyword: string) => void) | - | - |
| onSearch | 搜索时触发回调 | ((keyword: string) => void) | - | - |
| clearSearchOnClosed | 是否在关闭时清除搜索 | boolean | true \| false | - |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| searchPlaceholder | 搜索的占位符 | string | - | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 下拉菜单打开时回调 | (() => void) | - | - |
| onClose | 下拉菜单关闭时回调 | (() => void) | - | - |
| onOverlayScroll | 下拉列表滚动时的回调 | (() => void) | - | - |
| gutterGap | 气泡卡片与触发器的间距 | number | - | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<PickerHelper> | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | CheckTreeSelectSemanticClassNames | - | - |
| styles | | CheckTreeSelectSemanticStyles | - | - |


## Type

### CheckTreeSelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ---------------------------------------------------- | ------------------------- | ------------- | ------ |
| id | 节点唯一 id | ReactText | - | - |
| title | 节点标题 | ReactNode | - | - |
| children | 子级数据列表 | CheckTreeSelectDataItem[] | - | - |
| disabled | 是否禁用该节点 | boolean | true \| false | false |
| isLeaf | 是否为叶子节点，当 children 为空数组也表示为叶子结点 | boolean | true \| false | - |

### CheckTreeSelectItemEventData

> 继承自 CheckTreeSelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------ | ------------------------------ | ------ | ------ |
| children | 该节点的子节点列表 | CheckTreeSelectItemEventData[] | - | - |
| raw | 关联用户传入的原始数据对象 | CheckTreeSelectDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的父节点 | CheckTreeSelectGroupDataItem | - | - |

### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | true |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |
