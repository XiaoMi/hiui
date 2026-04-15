# TreeSelect 树形选择

一种接收树形数据结构的选择器，为用户提供复杂数据展示的能力。

## 使用示例

### 基础用法

展示从多个收起的备选项中选出的一个选项


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const Basic = () => {
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
 <div className="tree-select-basic__wrap">
 <TreeSelect
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const Controlled = () => {
 const [value, setValue] = React.useState<React.ReactText>('0')
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
 disabled: true,
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
 <div className="tree-select-controlled__wrap">
 <TreeSelect
 data={data}
 value={value}
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
 setValue(value)
 }}
 />
 </div>
 </>
 )
}

```


### 非受控


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const Uncontrolled = () => {
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
 <div className="tree-select-uncontrolled__wrap">
 <TreeSelect
 data={data}
 defaultValue={'1-2'}
 // defaultValue={defaultValue}
 onChange={(selectedId, selectedItem) => {
 console.log('TreeSelect onChange: ', selectedId, selectedItem)
 }}
 />
 </div>
 </>
 )
}

```


### 禁用


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const Disabled = () => {
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
 <div className="tree-select-disabled__wrap">
 <TreeSelect
 data={data}
 disabled
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
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
import TreeSelect from '@hi-ui/tree-select' 
export const Appearance = () => {
 const [value, setValue] = React.useState<React.ReactText>('0')
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
 <TreeSelect
 data={data}
 value={value}
 clearable
 appearance="filled"
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>outline</h2>
 <TreeSelect
 data={data}
 value={value}
 clearable
 appearance="line"
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>unset</h2>
 <TreeSelect
 data={data}
 value={value}
 clearable
 appearance="unset"
 // 取消下拉框匹配 input 触发器的宽度
 overlay={{ matchWidth: false }}
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>borderless</h2>
 <TreeSelect
 data={data}
 value={value}
 clearable
 appearance="borderless"
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>contained</h2>
 <TreeSelect
 style={{ width: 'auto' }}
 optionWidth={200}
 data={data}
 value={value}
 clearable
 appearance="contained"
 label="选择品类"
 // 取消下拉框匹配 input 触发器的宽度
 overlay={{ matchWidth: false }}
 onChange={(value, selectItems) => {
 console.log('TreeSelect onChange: ', value, selectItems)
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
import TreeSelect from '@hi-ui/tree-select' 
export const Size = () => {
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
 <div className="tree-select-size__wrap">
 <h2>xs</h2>
 <TreeSelect
 size="xs"
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 <h2>sm</h2>
 <TreeSelect
 size="sm"
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 <h2>md</h2>
 <TreeSelect
 size="md"
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 <h2>lg</h2>
 <TreeSelect
 size="lg"
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 </div>
 </>
 )
}

```


### 清空选中项


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
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
 <TreeSelect
 clearable
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 />
 </div>
 </>
 )
}

```


### 带搜索


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
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

 return (
 <> 
 <div className="tree-select-searchable__wrap">
 <h2>highlight</h2>
 <TreeSelect
 data={data}
 searchable
 searchMode="highlight"
 onChange={(checkedIds, checkedNode) => {
 console.log('TreeSelect onChange: ', checkedIds, checkedNode)
 }}
 />

 <h2>filter</h2>
 <TreeSelect
 data={data}
 searchable
 searchMode="filter"
 onChange={(checkedIds, checkedNode) => {
 console.log('TreeSelect onChange: ', checkedIds, checkedNode)
 }}
 />

 <h2>custom filter</h2>
 <TreeSelect
 data={data}
 searchable
 filterOption={filterOptionMemo}
 onChange={(checkedIds, checkedNode) => {
 console.log('TreeSelect onChange: ', checkedIds, checkedNode)
 }}
 />
 </div>
 </>
 )
}

```


### 默认展开全部


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
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
 <TreeSelect
 data={data}
 defaultExpandAll
 onChange={(checkedIds, checkedNode) => {
 console.log('TreeSelect onChange: ', checkedIds, checkedNode)
 }}
 />
 </div>
 </>
 )
}

```


### 大数据


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const VirtualList = () => {
 const [data] = React.useState(() => {
 // 模拟 10^4 个数据量
 function dig(path = '0', level) {
 const list = []
 for (let i = 0; i < 10; i += 1) {
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
 <TreeSelect data={data} onChange={console.log} virtual height={260} />
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import TreeSelect from '@hi-ui/tree-select'
import Input from '@hi-ui/input' 
export const CustomRender = () => {
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
 <div className="tree-select-custom-render__wrap">
 <TreeSelect
 data={data}
 onChange={(checkedIds, selectItem) => {
 console.log('TreeSelect onChange: ', checkedIds, selectItem)
 }}
 customRender={(data) => {
 return <Input value={!data ? '' : data.title + ''} placeholder="请选择" />
 }}
 />
 </div>
 </>
 )
}

```


### 自定义头尾


```tsx
import React, { useState } from 'react'
import TreeSelect from '@hi-ui/tree-select' 
export const ExtraRender = () => {
 const [data] = useState([
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
 <div className="tree-select-extra-render">
 <TreeSelect
 data={data}
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={() => <div>custom footer</div>}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 TreeSelect 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 tree）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import TreeSelect, { TreeSelectSemanticName } from '@hi-ui/tree-select' 
export const Semantic = () => {
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

 const [selected, setSelected] = useState<TreeSelectSemanticName>()

 return (
 <> 
 <div className="tree-select-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <TreeSelect
 style={{ width: 240 }}
 searchable
 searchMode="filter"
 visible
 data={data}
 classNames={{
 root: 'my-tree-select__root',
 container: 'my-tree-select__container',
 panel: 'my-tree-select__panel',
 header: 'my-tree-select__header',
 search: 'my-tree-select__search',
 body: 'my-tree-select__body',
 footer: 'my-tree-select__footer',
 tree: 'my-tree-select__tree',
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
 onMouseEnter={() => setSelected(dataItem.title as TreeSelectSemanticName)}
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

### TreeSelect Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| data | 展示数据 | TreeSelectDataItem\[] | - | \[] |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增)	object	-	{ title: 'title', id: 'id',disabled:'disabled', children: 'children'} | Record\<string, string> | - | "{} as any" |
| bordered | 是否有边框 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| defaultExpandAll | 是否默认展开所有树节点 | boolean | true \| false | false |
| expandedIds | 展开的节点（受控） | ReactText\[] | - | - |
| defaultExpandedIds | 默认展开的节点（非受控） | ReactText\[] | - | \[] |
| onExpand | 节点被点击(展开/收起)时触发 | (() => void) | - | - |
| defaultValue | 默认选中项 （非受控） | ReactText | - | "" |
| value | 默认选中项 （受控） | ReactText | - | - |
| displayRender | 自定义渲染 Input 中展示内容 | ((item: TreeSelectDataItem) => ReactNode) | - | - |
| placeholder | 输入框占位	string	-	请选择 | string | - | - |
| searchMode | 节点搜索模式，仅在mode=normal模式下生效 | "filter" \| "highlight" | "filter" \| "highlight" | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: TreeSelectDataItem) => boolean) | - | - |
| render | 自定义渲染节点的 title 内容 | ((node: TreeNodeEventData) => ReactNode) | - | - |
| onLoadChildren | 点击异步加载子项 | ((node: TreeNodeEventData) => void \| Promise\<void \| TreeSelectDataItem\[]>) | (node: TreeNodeEventData) => void \| Promise\<void \| TreeSelectDataItem\[]> | - |
| emptyContent | 没有选项时的提示 | ReactNode | - | - |
| optionWidth | 自定义下拉选项宽度 | number | - | - |
| overlayClassName | 下拉根元素的类名称 (3.0 新增) | string | - | - |
| onChange | 选中时触发&#xA;selectedId : 选中项 ID&#xA;selectedItem: 选中项数据项 | ((selectedId: ReactText, selectedItem: TreeSelectDataItem) => void) | - | - |
| clearable | 是否可清空 | boolean | true \| false | - |
| onClear | 点击关闭按钮时触发 | (() => void) | - | - |
| appearance | 设置展现形式 | TreeSelectAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | - |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| customRender | 自定义触发器 | ReactNode \| ((selectedItem: TreeSelectDataItem \| null) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (selectedItem: TreeSelectDataItem \| null) => ReactNode | - |
| shouldShowSwitcher | 自定义切换器显示逻辑 | ((node: TreeNodeEventData) => boolean) | - | - |
| showIndicator | 是否展示指示器 | boolean | true \| false | true |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | (() => ReactNode) | - | - |
| footer | 自定义下拉菜单底部渲染 | ReactNode | - | - |
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
| classNames | | TreeSelectSemanticClassNames | - | - |
| styles | | TreeSelectSemanticStyles | - | - |


## Type

### TreeSelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------- | -------------------- | ------ | ------ |
| id | 下拉选项唯一 id | ReactText | - | - |
| title | 下拉选项标题 | ReactNode | - | - |
| disabled | 是否禁用 | boolean | - | false |
| children | 子级数据 | TreeSelectDataItem[] | - | - |
