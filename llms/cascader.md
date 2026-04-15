# Cascader 级联选择

一种接收数据的容器，为用户提供选择一部分数据的能力

## 使用示例

### 基础用法

展示从多个收起的备选项中选出的一个选项


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Basic = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-basic__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 onItemClick={(...args) => {
 console.log('onItemClick', ...args)
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Size = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-size__wrap">
 <h2>xs</h2>
 <Cascader
 style={{ width: 240 }}
 size="xs"
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>sm</h2>
 <Cascader
 style={{ width: 240 }}
 size="sm"
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>md</h2>
 <Cascader
 style={{ width: 240 }}
 size="md"
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>lg</h2>
 <Cascader
 style={{ width: 240 }}
 size="lg"
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 展现形式

设置展现形式


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Appearance = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-appearance__wrap">
 <h2>Filled</h2>
 <Cascader
 style={{ width: 240 }}
 clearable
 appearance="filled"
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>Line</h2>
 <Cascader
 style={{ width: 240 }}
 clearable
 appearance="line"
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>Unset</h2>
 <Cascader
 style={{ width: 240 }}
 clearable
 appearance="unset"
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>Borderless</h2>
 <Cascader
 style={{ width: 240 }}
 clearable
 appearance="borderless"
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 <h2>Contained</h2>
 <Cascader
 style={{ width: 'auto' }}
 clearable
 appearance="contained"
 label="选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 禁用状态

暂不可操作的状态


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Disabled = () => {
 const [data] = React.useState([
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
 children: [
 {
 id: '1-0-0',
 title: '1-0-0',
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
 ])

 return (
 <> 
 <div className="cascader-disabled__wrap">
 <h2>整体禁用</h2>
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 disabled
 searchPlaceholder="请输入搜索内容"
 data={data}
 />

 <h2>禁用某个选项</h2>
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={data}
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
import Cascader from '@hi-ui/cascader' 
export const Search = () => {
 const [data] = React.useState([
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
 title: 'up-1-1',
 },
 ],
 },
 {
 id: '0',
 title: 'up-0',
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
 ])

 return (
 <> 
 <div className="cascader-search__wrap">
 <h2>展示搜索结果：拍平模式（默认）</h2>
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 data={data}
 searchable
 onChange={console.log}
 />

 <h2>展示搜索结果：级联模式</h2>
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 data={data}
 searchable
 flattedSearchResult={false}
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 自定义搜索筛选规则

通过 filterOption 可自定义搜索条件的算法


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader'
import { match } from 'pinyin-pro' 
export const FilterOptions = () => {
 const [data] = React.useState([
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
 ])

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 if (item.children) return false
 const _match = (node: any) =>
 typeof node.title === 'string' && !!match(node.title as string, keyword)

 const matchUp = (node: any) => {
 let found = _match(node)
 let { parent } = node

 if (parent && !found) {
 const ancestors = [] as any[]
 while (parent) {
 ancestors.push(parent)
 parent = parent.parent
 }

 found = ancestors.some((item: any) => _match(item))
 console.log(ancestors, found)
 }

 return found
 }

 const matchDown = (node: any) => {
 let found = _match(node)
 const { children } = node

 if (children && !found) {
 found = children.some((item: any) => matchDown(item))
 }

 return found
 }

 const result = matchUp(item) || matchDown(item)

 return result
 }, [])

 return (
 <> 
 <div className="select-filter-options__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable={false}
 data={data}
 searchPlaceholder="拼音检索"
 filterOption={filterOptionMemo}
 />
 </div>
 </>
 )
}

```


### 选中任意层级


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const SelectChange = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-select-change__wrap">
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 changeOnSelect
 expandTrigger="hover"
 searchPlaceholder="请输入搜索内容"
 data={data}
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### 选择后是否关闭弹窗

用于 changeOnSelect 模式下控制点击父节点时是否关闭弹窗


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const SelectClose = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-select-close__wrap">
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 changeOnSelect
 closeOnSelect={false}
 // expandTrigger="hover"
 searchPlaceholder="请输入搜索内容"
 data={data}
 onChange={console.log}
 />
 </div>
 </>
 )
}

```


### hover 展开次级菜单


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const HoverExpand = () => {
 const [data] = React.useState([
 {
 id: '手机',
 title: '手机',
 children: [
 {
 id: '小米',
 title: '小米',
 children: [
 {
 id: '小米3',
 title: '小米3',
 },
 {
 id: '小米4',
 title: '小米4',
 },
 ],
 },
 {
 id: '红米',
 title: '红米',
 children: [
 {
 id: '红米3',
 title: '红米3',
 },
 {
 id: '红米4',
 title: '红米4',
 },
 ],
 },
 ],
 },
 {
 id: '电视',
 title: '电视',
 children: [
 {
 id: '小米电视4A',
 title: '小米电视4A',
 },
 {
 id: '小米电视4C',
 title: '小米电视4C',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="cascader-hover-expand__wrap">
 <Cascader
 style={{ width: 240 }}
 searchable
 clearable
 expandTrigger="hover"
 placeholder="请选择品类"
 defaultValue={['手机', '小米', '红米']}
 data={data}
 ></Cascader>
 </div>
 </>
 )
}

```


### 异步加载数据


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader'
import Alert from '@hi-ui/alert' 
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
 <div className="cascader-dynamic__wrap">
 <Alert
 type="danger"
 closeable={false}
 showIcon={false}
 title={
 '注意：对于异步加载子节点，可以配合 `node.isLeaf: true` 来表明是否为叶子结点。以此来告诉组件是否有下一级子面板'
 }
 ></Alert>
 <br />
 <Cascader
 style={{ width: 240 }}
 data={treeData}
 onLoadChildren={loadChildren}
 onChange={console.log}
 ></Cascader>
 </div>
 </>
 )
}

```


### 自定义回显展示


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const DisplayRender = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-display-render__wrap">
 <Cascader
 style={{ width: 240 }}
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 displayRender={(option) => {
 const titleArr = []
 while (option.parent) {
 titleArr.push(option.title)
 option = option.parent as any
 }
 return titleArr.reverse().join(' | ')
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 自定义选项展示


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const TitleRender = () => {
 const [data] = React.useState([
 {
 id: '1',
 title: '手机t',
 children: [
 {
 id: '1-1',
 title: '小米t',
 children: [
 {
 id: '1-1-1',
 title: '小米3t',
 },
 {
 id: '1-1-2',
 title: '小米4t',
 },
 ],
 },
 {
 id: '1-2',
 title: '红米t',
 children: [
 {
 id: '1-2-1',
 title: '红米3t',
 },
 {
 id: '1-2-2',
 title: '红米4t',
 },
 ],
 },
 ],
 },
 {
 id: '2',
 title: '电视t',
 children: [
 {
 id: '2-1',
 title: '小米电视4At',
 },
 {
 id: '2-2',
 title: '小米电视4Ct',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="cascader-basic__wrap">
 <Cascader
 style={{ width: 240 }}
 searchable={true}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 render={(item, keyword) => {
 console.log(item, keyword)
 if (keyword) {
 // 自定义搜索结果展示：可以自定义控制关键词高亮，夹带 icon 等场景
 return <span>{`${keyword}: ${item.title}`}</span>
 }
 return <span>{`${item.title}(${item.id})`}</span>
 }}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 吸底内容条


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Footer = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-footer__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 renderExtraFooter={() => <div>custom footer</div>}
 ></Cascader>
 </div>
 </>
 )
}

```


### 自定义下拉菜单内容


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const DropdownColumnRender = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-dropdown-column-render__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
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
 ></Cascader>
 </div>
 </>
 )
}

```


### 字段别名

数据中的字段名非title，id或disabled时使用


```tsx
import React from 'react'
import { Cascader } from '@hi-ui/cascader' 
export const FieldNames = () => {
 const [data] = React.useState([
 {
 value: '0',
 label: '0',
 kids: [
 {
 value: '0-0',
 label: '0-0',
 kids: [
 {
 value: '0-0-0',
 label: '0-0-0',
 },
 {
 value: '0-0-1',
 label: '0-0-1',
 },
 {
 value: '0-0-2',
 label: '0-0-2',
 },
 ],
 },
 {
 value: '0-1',
 label: '0-1',
 kids: [
 {
 value: '0-1-0',
 label: '0-1-0',
 },
 {
 value: '0-1-1',
 label: '0-1-1',
 },
 ],
 },
 {
 value: '0-2',
 label: '0-2',
 kids: [
 {
 value: '0-2-0',
 label: '0-2-0',
 },
 {
 value: '0-2-1',
 label: '0-2-1',
 },
 ],
 },
 ],
 },
 {
 value: '1',
 label: '1',
 kids: [
 {
 value: '1-0',
 label: '1-0',
 },
 {
 value: '1-1',
 label: '1-1',
 },
 ],
 },
 {
 value: '2',
 label: '2',
 kids: [
 {
 value: '2-0',
 label: '2-0',
 },
 {
 value: '2-1',
 label: '2-1',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="cascader-field-names__wrap">
 <Cascader
 style={{ width: 240 }}
 fieldNames={{
 id: 'value',
 title: 'label',
 children: 'kids',
 }}
 defaultValue={['0', '0-0', '0-0-1']}
 data={data}
 />
 </div>
 </>
 )
}

```


### 受控显隐

自定义控制下拉选项菜单显隐


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Visible = () => {
 const [visible, setVisible] = React.useState(true)
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-visible__wrap">
 <Cascader
 style={{ width: 240 }}
 visible={visible}
 onOpen={() => setVisible(true)}
 overlay={{ onOutsideClick: () => setVisible(false) }}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 />
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader'
import Input from '@hi-ui/input' 
export const CustomRender = () => {
 const [data] = React.useState([
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
 ])

 return (
 <> 
 <div className="cascader-custom-render__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable
 placeholder="请选择品类"
 data={data}
 customRender={(data) => {
 return <Input value={!data ? '' : data.title + ''} placeholder="请选择" />
 }}
 ></Cascader>
 </div>
 </>
 )
}

```


### 大数据

支持大数据下的虚拟滚动


```tsx
import React from 'react'
import Cascader from '@hi-ui/cascader' 
export const Virtual = () => {
 const [data] = React.useState([
 // 随机生成 10 * 10 * 1000 条的级联数据
 ...Array.from({ length: 10 }, (_, index) => ({
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
 ])

 return (
 <> 
 <div className="cascader-virtual__wrap">
 <Cascader
 style={{ width: 240 }}
 clearable
 data={data}
 onChange={(...args) => {
 console.log('onChange', ...args)
 }}
 virtual
 ></Cascader>
 </div>
 </>
 )
}

```


### 自定义头尾


```tsx
import React, { useState } from 'react'
import Cascader from '@hi-ui/cascader' 
export const ExtraRender = () => {
 const [data] = useState([
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
 ])

 return (
 <> 
 <div className="cascader-extra-render">
 <Cascader
 style={{ width: 240 }}
 clearable
 placeholder="请选择品类"
 defaultValue={['手机', '红米', '红米4']}
 data={data}
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={() => 'custom footer'}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 Cascader 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 menuList/menu/option）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Cascader, { CascaderSemanticName } from '@hi-ui/cascader' 
export const Semantic = () => {
 const [data] = React.useState([
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
 ])

 const [selected, setSelected] = useState<CascaderSemanticName>()

 return (
 <> 
 <div className="cascader-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Cascader
 visible
 searchable
 data={data}
 classNames={{
 root: 'my-cascader__root',
 container: 'my-cascader__container',
 panel: 'my-cascader__panel',
 header: 'my-cascader__header',
 search: 'my-cascader__search',
 body: 'my-cascader__body',
 footer: 'my-cascader__footer',
 menuList: 'my-cascader__menu-list',
 menu: 'my-cascader__menu',
 option: 'my-cascader__option',
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
 onMouseEnter={() => setSelected(dataItem.title as CascaderSemanticName)}
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

### Cascader Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| expandTrigger | 次级菜单的展开方式 | CascaderExpandTriggerEnum | "click" \| "hover" | - |
| searchable | 是否可搜索（仅在 title 为字符串时支持） | boolean | true \| false | - |
| clearable | 是否可清空 | boolean | true \| false | - |
| emptyContent | 设置选项为空时展示的内容 | ReactNode | - | - |
| render | 自定义渲染节点的 title 内容 | ((item: CascaderItemEventData, keyword?: string) => ReactNode) \| undefined | (item: CascaderItemEventData, keyword?: string \| undefined) => ReactNode | - |
| displayRender | 自定义选择后触发器所展示的内容，只在 title 为字符串时有效 | ((checkedOption: CascaderItemEventData, checkedOptionPaths: CascaderItemEventData\[]) => ReactNode) | - | - |
| placeholder | 触发器输入框占位符 | string | - | - |
| searchPlaceholder | 搜索输入框占位符 | string | - | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: CascaderItemEventData) => boolean) | - | - |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| appearance | 设置展现形式 | CascaderAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| flattedSearchResult | 搜索结果拍平展示 | boolean | true \| false | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | (() => ReactNode) | - | - |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| dropdownColumnRender | 自定义下拉菜单每列渲染 | ((menu: ReactElement\<any, string \| JSXElementConstructor\<any>>, level: number) => ReactNode) | (menu: ReactElement\<any, string \| JSXElementConstructor\<any>>, level: number) => ReactNode | - |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| customRender | 自定义触发器 | ReactNode \| ((selectedItem: CascaderItemEventData \| null, value?: ReactText\[]) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (selectedItem: CascaderItemEventData \| null, value?: ReactText\[] \| undefined) => ReactNode | - |
| onClear | 点击关闭按钮时触发 | (() => void) | - | - |
| virtual | 是否开启虚拟滚动 | boolean | true \| false | - |
| onItemClick | 点击选项时触发 | ((event: MouseEvent\<HTMLDivElement, MouseEvent>, eventOption: CascaderItemEventData) => void) | - | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | - |
| loading | 是否在加载中 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | - |
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
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 下拉菜单打开时回调 | (() => void) | - | - |
| onClose | 下拉菜单关闭时回调 | (() => void) | - | - |
| onOverlayScroll | 下拉列表滚动时的回调 | (() => void) | - | - |
| gutterGap | 气泡卡片与触发器的间距 | number | - | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<PickerHelper> | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | Record\<string, string> | - | - |
| data | 设置选择项数据源 | CascaderDataItem\[] | - | - |
| value | 设置当前选中值 | ReactText\[] | - | - |
| defaultValue | 设置当前选中值默认值 | ReactText\[] | - | - |
| onChange | 选中值改变时的回调 | ((value: ReactText\[], targetOption?: CascaderItemEventData, optionPaths?: FlattedCascaderDataItem\[] \| undefined) => void) \| undefined | (value: ReactText\[], targetOption?: CascaderItemEventData \| undefined, optionPaths?: FlattedCascaderDataItem\[] \| undefined) => void | - |
| changeOnSelect | 是否启用选择即改变功能 | boolean | true \| false | - |
| closeOnSelect | 是否启用选择即关闭（用于 changeOnSelect 模式下控制父节点点击交互） | boolean | true \| false | "true" |
| onLoadChildren | 异步请求更新数据 | ((item: CascaderItemEventData, idPaths: ReactText\[]) => void \| Promise\<void \| CascaderDataItem\[]>) | (item: CascaderItemEventData, idPaths: ReactText\[]) => void \| Promise\<void \| CascaderDataItem\[]> | - |
| classNames | | CascaderSemanticClassNames | - | - |
| styles | | CascaderSemanticStyles | - | - |


## Type

### CascaderDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------------------------------------------------------------- | ------------------ | ------------- | ------ |
| id | 选择项值，唯一 id | ReactText | - | - |
| title | 选项标题 | ReactNode | - | - |
| children | 下一级选项列表 | CascaderDataItem[] | - | - |
| disabled | 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用） | boolean | true \| false | false |
| isLeaf | 是否为叶子节点，当 children 为空数组也表示为叶子结点 | boolean | true \| false | - |

### CascaderItemEventData

> 继承自 CascaderDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------ | ----------------------- | ------ | ------ |
| children | 下一级选项列表 | CascaderItemEventData[] | - | - |
| raw | 关联用户传入的原始数据对象 | CascaderDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的父节点 | CascaderItemEventData | - | - |

### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | false |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |
