# Select 选择器

选择器是一种接收数据的容器，为用户提供选择一部分数据的能力。

## 使用示例

### 基础用法

展示从多个收起的备选项中选出的一个选项


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const Basic = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-basic__wrap">
 <Select style={{ width: 240 }} clearable={false} data={data} />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const Controlled = () => {
 const [value, setValue] = React.useState<React.ReactText>('shouji')
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-controlled__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 value={value}
 onChange={(selectedId) => {
 setValue(selectedId)
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
import Select from '@hi-ui/select' 
export const Uncontrolled = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-uncontrolled__wrap">
 <Select
 style={{ width: 240 }}
 data={data}
 defaultValue={'3'}
 onChange={(selectedId) => {
 console.log('onChange', selectedId)
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
import Select from '@hi-ui/select' 
export const Clearable = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-clearable__wrap">
 <Select style={{ width: 240 }} clearable data={data} onChange={console.log} />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性、无UI三种


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const Appearance = () => {
 const [value, setValue] = React.useState<React.ReactText>('shouji')
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="tree-select-appearance__wrap">
 <div>
 <h2>filled</h2>
 <Select
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="filled"
 onChange={(value, targetItem) => {
 console.log('Select onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>outline</h2>
 <Select
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="line"
 onChange={(value, targetItem) => {
 console.log('Select onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>unset</h2>
 <Select
 data={data}
 value={value}
 clearable
 appearance="unset"
 optionWidth={260}
 onChange={(value, targetItem) => {
 console.log('Select onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>borderless</h2>
 <Select
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="borderless"
 optionWidth={260}
 onChange={(value, targetItem) => {
 console.log('Select onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h2>contained</h2>
 <Select
 data={data}
 value={value}
 clearable
 appearance="contained"
 label="服务类型"
 optionWidth={260}
 onChange={(value, targetItem) => {
 console.log('Select onChange: ', value, targetItem)
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
import Select from '@hi-ui/select' 
export const Size = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-size__wrap">
 <h2>xs</h2>
 <Select style={{ width: 240 }} size="xs" clearable={false} data={data} />
 <h2>sm</h2>
 <Select style={{ width: 240 }} size="sm" clearable={false} data={data} />
 <h2>md</h2>
 <Select style={{ width: 240 }} size="md" clearable={false} data={data} />
 <h2>lg</h2>
 <Select style={{ width: 240 }} size="lg" clearable={false} data={data} />
 </div>
 </>
 )
}

```


### 禁用状态

暂不可操作的状态


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const Disabled = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao', disabled: true },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-disabled__wrap">
 <h2>整体禁用</h2>
 <Select style={{ width: 240 }} disabled data={data} defaultValue="2" />

 <h2>局部禁用</h2>
 <Select style={{ width: 240 }} data={data} defaultValue="2" />
 </div>
 </>
 )
}

```


### 类型分组


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const Group = () => {
 const [value, setValue] = React.useState<React.ReactText>('3')

 const [data] = React.useState([
 {
 groupId: 'redmi',
 groupTitle: '红米手机',
 children: [
 { title: '红米 5A', id: '3' },
 { title: '红米 6A', id: '2' },
 { title: '红米 note', id: '4' },
 { title: '红米 note8', id: '5' },
 ],
 },
 {
 groupId: 'mi',
 groupTitle: '小米电视',
 children: [
 { title: '小米电视4A 60寸', id: '10' },
 { title: '小米电视E55A', id: '11' },
 { title: '小米电视E65A', id: '12' },
 { title: '小米电视4S', id: '13' },
 { title: '小米电视4C', id: '14' },
 ],
 },
 ])

 return (
 <> 
 <div className="select-Group__wrap">
 <Select
 style={{ width: 240 }}
 data={data}
 placeholder="请选择"
 searchable
 value={value}
 onChange={(selectedId) => {
 setValue(selectedId)
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
import Select from '@hi-ui/select' 
export const Search = () => {
 const [data] = React.useState([
 {
 id: 'up-1',
 title: 'up',
 },
 {
 id: '0',
 title: '0',
 },
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 ])
 return (
 <> 
 <div className="select-search__wrap">
 <Select
 style={{ width: 240 }}
 searchable
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={data}
 />
 </div>
 </>
 )
}

```


### 搜索关键字受控

searchable 为 true 时生效


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const SearchControlled = () => {
 const [keyword, setKeyword] = React.useState('1')

 const [data] = React.useState([
 {
 id: 'up-1',
 title: 'up',
 },
 {
 id: '0',
 title: '0',
 },
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 {
 id: '11',
 title: '11',
 },
 {
 id: '12',
 title: '12',
 },
 ])

 return (
 <> 
 <div className="select-search-controlled__wrap">
 <Select
 style={{ width: 240 }}
 searchable
 keyword={keyword}
 onSearch={(value) => {
 setKeyword(value)
 console.log('onSearch', value)
 }}
 onClear={() => {
 setKeyword('')
 }}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={data}
 />
 </div>
 </>
 )
}

```


### 清除搜索

关闭弹窗时清除搜索，默认不开启


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const ClearSearch = () => {
 const [data] = React.useState([
 {
 id: 'up-1',
 title: 'up',
 },
 {
 id: '0',
 title: '0',
 },
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 ])
 return (
 <> 
 <div className="select-clear-search__wrap">
 <Select
 style={{ width: 240 }}
 searchable
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 data={data}
 clearSearchOnClosed
 />
 </div>
 </>
 )
}

```


### 创建选项


```tsx
import React from 'react'
import Select, { SelectMergedItem } from '@hi-ui/select' 
export const CreateItem = () => {
 const [data, setData] = React.useState<SelectMergedItem[]>([
 {
 id: 'up-1',
 title: 'up',
 },
 {
 id: '0',
 title: '0',
 },
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 ])

 return (
 <> 
 <div className="select-search__wrap">
 <Select
 style={{ width: 240 }}
 searchable
 creatableInSearch
 // createTitle="添加"
 onItemCreate={(item) => {
 console.log('onCreate', item)
 // setData([...data, item])
 setData([item, ...data])
 }}
 data={data}
 />
 </div>
 </>
 )
}

```


### 异步加载数据

备选项数量较大时，通过搜索选项关键词调取存储于服务端数据备选项


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const DataSource = () => {
 const [data] = React.useState([
 {
 id: 'up-1',
 title: 'up',
 },
 {
 id: '0',
 title: '0',
 },
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 ])

 return (
 <> 
 <div className="cascader-DataSource__wrap">
 <Select
 style={{ width: 240 }}
 // placeholder="请选择品类"
 // searchPlaceholder="请输入搜索内容"
 data={data}
 onChange={console.log}
 // searchOnInit
 dataSource={(keyword) => {
 console.log('DataSource', keyword)
 const url =
 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list?keyword=' +
 keyword
 return fetch(url)
 .then((response) => {
 return response.json()
 })
 .then(function (res) {
 return res.list
 })
 .catch((error) => {
 console.error('DataSource', error)
 return []
 })
 }}
 />
 </div>
 </>
 )
}

```


### 自定义选项展示

可自定义选项的信息结构或样式


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const TitleRender = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-TitleRender__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 render={(item) => {
 console.log(item)
 return (
 <React.Fragment>
 <span style={{ float: 'left' }}>{item.title}</span>
 <span style={{ float: 'right', color: '#999', fontSize: 14 }}>{item.id}</span>
 </React.Fragment>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 自定义回显展示


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const DisplayRender = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-display-render__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 displayRender={(item) => {
 console.log(item)
 return (
 <span style={{ float: 'left' }}>
 {item.title}
 <span style={{ float: 'right', color: '#999', fontSize: 14 }}>({item.id})</span>
 </span>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 自定义筛选

通过 filterOption 可自定义搜索条件的算法


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const FilterOptions = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 return item.id >= parseInt(keyword)
 }, [])

 return (
 <> 
 <div className="select-filter-options__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 searchPlaceholder="搜索：id >= keyword"
 filterOption={filterOptionMemo}
 />
 </div>
 </>
 )
}

```


### 拼音搜索

通过输入拼音搜索关键字


```tsx
import React from 'react'
import Select from '@hi-ui/select'

import { match } from 'pinyin-pro' 
export const Pinyin = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 return !!match(item.title as string, keyword)
 }, [])

 return (
 <> 
 <div className="select-pinyin__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 filterOption={filterOptionMemo}
 />
 </div>
 </>
 )
}

```


### 大数据


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const VirtualList = () => {
 const [data] = React.useState(() => {
 const defaultData = []
 for (let i = 0; i < 5000; i++) {
 defaultData.push({
 id: `id${i}`,
 title: `title${i}`,
 disabled: i === 8,
 })
 }
 return defaultData
 })

 return (
 <> 
 <div className="select-display-render__wrap">
 <Select style={{ width: 240 }} clearable={false} data={data} height={260} />
 </div>
 </>
 )
}

```


### 自定义空内容


```tsx
import React from 'react'
import Select from '@hi-ui/select' 
export const EmptyContent = () => {
 const [data] = React.useState([])

 return (
 <> 
 <div className="select-empty-content__wrap">
 <Select style={{ width: 240 }} data={data} emptyContent="暂无选项" />
 </div>
 </>
 )
}

```


### 带Tooltip提示


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const Tip = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机洗衣机洗衣机洗衣机洗衣机洗衣机洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-Tip__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 render={(item) => {
 console.log(item)
 return (
 <EllipsisTooltip
 tooltipProps={{
 placement: 'right',
 gutterGap: 14,
 }}
 >
 {item.title}
 </EllipsisTooltip>
 )
 }}
 displayRender={(item) => {
 return (
 <EllipsisTooltip
 tooltipProps={{
 gutterGap: 14,
 }}
 >
 {item.title}
 </EllipsisTooltip>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 前后内置元素

将选择框与内置的其他元素组合使用


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const Addon = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-addon__wrap">
 <Select
 style={{ width: 240 }}
 // clearable={false}
 data={data}
 prefix={<AppStoreOutlined style={{ color: '#333' }} />}
 suffix={<InfoCircleOutlined style={{ color: '#333' }} />}
 displayRender={(item) => {
 return (
 <EllipsisTooltip
 tooltipProps={{
 gutterGap: 14,
 }}
 >
 {item.title}
 </EllipsisTooltip>
 )
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
import Input from '@hi-ui/input'
import Select from '@hi-ui/select' 
export const CustomRender = () => {
 const [data] = React.useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-custom-render__wrap">
 <Select
 style={{ width: 240 }}
 clearable={false}
 data={data}
 customRender={(data) => {
 return <Input value={!data ? '' : data.title + ''} readOnly placeholder="请选择" />
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
import Select from '@hi-ui/select' 
export const ExtraRender = () => {
 const [data] = useState([
 { title: '手机', id: 'shouji' },
 { title: '电脑', id: 'diannao' },
 { title: '电视', id: 'dianshi' },
 { title: '洗衣机', id: 'xiyiji' },
 { title: '冰箱', id: 'bingxiang' },
 { title: '空调', id: 'kongtiao' },
 { title: '汽车', id: 'qiche' },
 ])

 return (
 <> 
 <div className="select-extra-render">
 <Select
 style={{ width: 240 }}
 clearable={false}
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

通过 classNames 和 styles 属性，可以对 Select 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 option/optionGroup）


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Select, { SelectSemanticName } from '@hi-ui/select' 
export const Semantic = () => {
 const [data] = React.useState([
 {
 groupId: 'redmi',
 groupTitle: '红米手机',
 children: [
 { title: '红米 5A', id: '3' },
 { title: '红米 6A', id: '2' },
 { title: '红米 note', id: '4' },
 { title: '红米 note8', id: '5' },
 ],
 },
 {
 groupId: 'mi',
 groupTitle: '小米电视',
 children: [
 { title: '小米电视4A 60寸', id: '10' },
 { title: '小米电视E55A', id: '11' },
 { title: '小米电视E65A', id: '12' },
 { title: '小米电视4S', id: '13' },
 { title: '小米电视4C', id: '14' },
 ],
 },
 ])

 const [selected, setSelected] = useState<SelectSemanticName>()

 return (
 <> 
 <div className="select-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Select
 style={{ width: 240 }}
 searchable
 visible
 data={data}
 classNames={{
 root: 'my-select__root',
 container: 'my-select__container',
 panel: 'my-select__panel',
 header: 'my-select__header',
 search: 'my-select__search',
 body: 'my-select__body',
 footer: 'my-select__footer',
 option: 'my-select__option',
 optionGroup: 'my-select__option-group',
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
 { title: 'option', description: '选项' },
 { title: 'optionGroup', description: '选项组' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as SelectSemanticName)}
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

### Select Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| data | 选项数据 | SelectMergedItem\[] | - | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | Record\<string, string> | - | - |
| appearance | 设置展现形式 | SelectAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| placeholder | 触发器输入框占位符 | string | - | - |
| clearable | 是否可清空 | boolean | true \| false | true |
| render | 自定义渲染节点的 title 内容 | ((item: SelectItemEventData) => ReactNode) | - | - |
| displayRender | 自定义选择后触发器所展示的内容，只在 title 为字符串时有效 | ((option: SelectItemEventData) => ReactNode) | - | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | (() => ReactNode) | - | - |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | true |
| searchable | 是否可搜索（仅在 title 为字符串时支持） | boolean | true \| false | - |
| keyword | 搜索关键字，searchable 为 true 时有效 | string | - | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: SelectItemEventData) => boolean) | - | - |
| dataSource | 异步加载数据 | UseDataSource\<SelectMergedItem\[]> | - | - |
| searchOnInit | 初始化时执行一次搜索，仅在 dataSource 不为空时有效 | boolean | true \| false | - |
| onSearch | 搜索时触发 | ((keyword: string) => void) | - | - |
| onClear | 点击关闭按钮时触发 | (() => void) | - | - |
| size | 设置大小 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| customRender | 自定义触发器 | ReactNode \| ((option: SelectItemEventData) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (option: SelectItemEventData) => ReactNode | - |
| onItemCreate | 创建选项时触发 | ((item: SelectMergedItem) => void) | - | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | true |
| loading | 是否在加载中 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| emptyContent | 设置选项为空时展示的内容 | ReactNode | - | - |
| loadingContent | 加载中时的提示 | ReactNode | - | - |
| showEmpty | 展示未搜索结果 | boolean | true \| false | - |
| optionWidth | 自定义下拉选项宽度 | Width\<string \| number> | string \| number \| string & {} | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| creatableInSearch | 在搜索状态下是否可创建选项 | boolean | true \| false | - |
| creatableInSearchVisible | 是否显示「创建选项」入口。为 false 时不显示。&#xA;不传（undefined）时保持兼容：只要有搜索词即显示创建入口。&#xA;Select/CheckSelect 会传入此 prop，实现「仅当无结果或关键字与结果无全匹配时显示」。 | boolean | true \| false | - |
| createTitle | 创建选项时展示的标题 | string | - | - |
| onCreate | 创建选项时触发回调 | ((keyword: string) => void) | - | - |
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
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | false |
| value | 设置当前选中值 | ReactText | - | - |
| defaultValue | 设置当前选中值默认值 | ReactText | - | - |
| onChange | 选中值改变时的回调 | ((selectedId: ReactText, changedItem: SelectItemEventData) => void) | - | - |
| onSelect | 选中值时回调 | ((value: ReactText, targetOption: SelectItemEventData) => void) | - | - |
| classNames | | SelectSemanticClassNames | - | - |
| styles | | SelectSemanticStyles | - | - |


### SelectOptionGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----- | ---- | ------ | ------ | ------ |
| label | 祖名 | string | - | - |
| depth | 深度 | number | - | - |


## Type

### SelectMergedItem

> SelectDataItem | SelectGroupDataItem

#### SelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----------------- | --------- | ------------- | ------ |
| id | 选择项值，唯一 id | ReactText | - | - |
| title | 选项标题 | ReactNode | - | - |
| disabled | 是否禁用该选项 | boolean | true \| false | false |

#### SelectGroupDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------------- | ------ | ------ |
| groupId | 选项组唯一 id | ReactText | - | - |
| groupTitle | 选项组标题 | ReactNode | - | - |
| children | 分组下选项列表 | SelectDataItem[] | - | - |

### SelectItemEventData

> 继承自 SelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------------------------------ | ------------------- | ------ | ------ |
| raw | 关联用户传入的原始数据对象 | SelectDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的组信息 | SelectGroupDataItem | - | - |

### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | true |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |

### UseDataSource

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ---------------------------------- | -------------------------------- | -------------------------------------------------- | ------------- |
| url | 请求的 url | string | - | - |
| method | 请求方法 | string | get \| post | get |
| data | post 请求时请求体参数 | object | - | - |
| params | url 查询参数 | object | - | - |
| headers | 请求头 | object | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | false |
| transformResponse | 成功时的回调，用于对数据进行预处理 | (response: object) => DataItem[] | - | - |
| onError | 请求发生异常的回调方法 | (error: object) => void | - | - |
| mode | 请求模式 | string | 'same-origin' \| 'cors' \| 'no-cors' \| 'navigate' | 'same-origin' |
