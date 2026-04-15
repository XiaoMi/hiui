# CheckSelect 多项选择器

弹出一个下拉菜单给用户进行部分选项选择的操作。

## 使用示例

### 基础用法

展示从全部备选项选出的部分选项


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const Basic = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-basic__wrap">
 <CheckSelect style={{ width: 240 }} placeholder="请选择" searchable clearable data={data} />
 </div>
 </>
 )
}

```


### 受控


```tsx
import Button from '@hi-ui/button'
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const Controlled = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['3'])
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="select-controlled__wrap">
 <Button
 onClick={() => {
 setValue([])
 }}
 >
 清空
 </Button>
 <br />
 <br />
 <CheckSelect
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
import CheckSelect from '@hi-ui/check-select' 
export const Uncontrolled = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="select-uncontrolled__wrap">
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 defaultValue={['3']}
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
import CheckSelect from '@hi-ui/check-select' 
export const Clearable = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="select-clearable__wrap">
 <CheckSelect style={{ width: 240 }} clearable data={data} onChange={console.log} />
 </div>
 </>
 )
}

```


### 展示全部已选项

设置后，选中内容超出宽度时会换行展示


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const TagInputWrap = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-tag-input-wrap__wrap">
 <CheckSelect
 style={{ width: 240 }}
 placeholder="请选择"
 searchable
 clearable
 data={data}
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
import CheckSelect from '@hi-ui/check-select' 
export const Appearance = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['2'])
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="tree-select-appearance__wrap">
 <div>
 <h4>filled</h4>
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="filled"
 onChange={(value, targetItem) => {
 console.log('CheckSelect onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h4>outline</h4>
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="line"
 onChange={(value, targetItem) => {
 console.log('CheckSelect onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h4>unset</h4>
 <CheckSelect
 data={data}
 value={value}
 clearable
 appearance="unset"
 optionWidth={260}
 onChange={(value, targetItem) => {
 console.log('CheckSelect onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h4>borderless</h4>
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 value={value}
 clearable
 appearance="borderless"
 optionWidth={260}
 onChange={(value, targetItem) => {
 console.log('CheckSelect onChange: ', value, targetItem)
 setValue(value)
 }}
 />
 </div>

 <div>
 <h4>contained</h4>
 <CheckSelect
 data={data}
 value={value}
 style={{ width: 'auto' }}
 optionWidth={260}
 clearable
 showOnlyShowChecked
 appearance="contained"
 label="服务类型"
 onChange={(value, targetItem) => {
 console.log('CheckSelect onChange: ', value, targetItem)
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
import CheckSelect from '@hi-ui/check-select' 
export const Size = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-size__wrap">
 <h2>xs</h2>
 <CheckSelect
 style={{ width: 240 }}
 size="xs"
 placeholder="请选择"
 searchable
 clearable
 data={data}
 />
 <h2>sm</h2>
 <CheckSelect
 style={{ width: 240 }}
 size="sm"
 placeholder="请选择"
 searchable
 clearable
 data={data}
 />
 <h2>md</h2>
 <CheckSelect
 style={{ width: 240 }}
 size="md"
 placeholder="请选择"
 searchable
 clearable
 data={data}
 />
 <h2>lg</h2>
 <CheckSelect
 style={{ width: 240 }}
 size="lg"
 placeholder="请选择"
 searchable
 clearable
 data={data}
 />
 </div>
 </>
 )
}

```


### 禁用状态

暂不可操作的状态


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const Disabled = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: true },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: true },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])
 return (
 <> 
 <div className="check-select-basic__wrap">
 <h2>整体禁用</h2>
 <CheckSelect
 style={{ width: 240 }}
 placeholder="请选择"
 searchable
 disabled
 data={data}
 defaultValue={['2']}
 />

 <h2>禁用某个选项</h2>
 <CheckSelect
 style={{ width: 240 }}
 placeholder="请选择"
 searchable
 data={data}
 defaultValue={['2']}
 />
 </div>
 </>
 )
}

```


### 类型分组


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const Group = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['3'])

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
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 placeholder="请选择"
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


### 全选


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const CheckAll = () => {
 const [value, setValue] = React.useState<React.ReactText[]>(['3'])

 const [data] = React.useState([
 { title: '红米 5A', id: '3' },
 { title: '红米 6A', id: '2' },
 { title: '红米 note8', id: '5' },
 { title: '小米电视E65A', id: '12' },
 { title: '小米电视4S', id: '13' },
 { title: '小米电视4C', id: '14' },
 ])

 return (
 <> 
 <div className="select-check-all__wrap">
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 placeholder="请选择"
 showCheckAll
 showOnlyShowChecked
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
import CheckSelect from '@hi-ui/check-select' 
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
 <div className="check-select-search__wrap">
 <CheckSelect
 style={{ width: 240 }}
 searchable
 data={data}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
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
import CheckSelect from '@hi-ui/check-select' 
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
 <div className="check-select-clear-search__wrap">
 <CheckSelect
 style={{ width: 240 }}
 searchable
 data={data}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
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
import CheckSelect, { CheckSelectMergedItem } from '@hi-ui/check-select' 
export const CreateItem = () => {
 const [data, setData] = React.useState<CheckSelectMergedItem[]>([
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
 <div className="check-select-search__wrap">
 <CheckSelect
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


### 异步加载搜索

备选项数量较大时，通过搜索选项关键词调取存储于服务端数据备选项的一个或多个


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
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
 <CheckSelect
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


### 自定义回显展示


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const DisplayRender = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="check-select-display-render__wrap">
 <CheckSelect
 style={{ width: 240 }}
 clearable={false}
 data={data}
 displayRender={(item) => {
 console.log(item)
 return (
 <React.Fragment>
 <span style={{ float: 'left' }}>{item.title}</span>
 <span style={{ float: 'right', color: '#999', fontSize: 14 }}>({item.id})</span>
 </React.Fragment>
 )
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
import { CheckOutlined } from '@hi-ui/icons'
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const TitleRender = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="select-TitleRender__wrap">
 <CheckSelect
 style={{ width: 240 }}
 clearable={false}
 data={data}
 render={(item) => {
 return (
 <React.Fragment>
 <span style={{ float: 'left' }}>{item.title}</span>
 {item.checked ? (
 <span style={{ float: 'right' }}>
 <CheckOutlined />
 </span>
 ) : null}
 </React.Fragment>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 吸底内容条


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const Footer = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="check-select-footer__wrap">
 <CheckSelect
 style={{ width: 240 }}
 clearable={false}
 data={data}
 renderExtraFooter={() => {
 return (
 <div
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
 >
 Custom Footer
 </div>
 )
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
import CheckSelect from '@hi-ui/check-select' 
export const ExtraRender = () => {
 const [data] = useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="check-select-extra-render">
 <CheckSelect
 style={{ width: 240 }}
 clearable={false}
 data={data}
 renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
 renderExtraFooter={(CheckAllNode) => {
 return (
 <div>
 <div>custom title</div>
 {CheckAllNode}
 <div>custom footer</div>
 </div>
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
import CheckSelect from '@hi-ui/check-select' 
export const FilterOptions = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 return item.id >= parseInt(keyword)
 }, [])

 return (
 <> 
 <div className="select-filter-options__wrap">
 <CheckSelect
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


### 拼音搜索

通过输入拼音搜索关键字


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select'

import { match } from 'pinyin-pro' 
export const Pinyin = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边', id: '5' },
 { title: '办公', id: '6' },
 ])

 // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
 const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
 return !!match(item.title as string, keyword)
 }, [])

 return (
 <> 
 <div className="select-pinyin__wrap">
 <CheckSelect
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
import CheckSelect from '@hi-ui/check-select' 
export const VirtualList = () => {
 const [data] = React.useState(() => {
 const data: any[] = []
 for (let i = 0; i < 5000; i++) {
 const value = `${i.toString(36)}-${i}`
 data.push({
 id: value,
 title: value,
 disabled: i === 10,
 })
 }

 return data
 })

 console.log('data', data)

 return (
 <> 
 <div className="check-select-search__wrap">
 <CheckSelect
 style={{ width: 240 }}
 data={data}
 searchable
 height={260}
 defaultValue={data.map((v) => v.id)}
 placeholder="请选择品类"
 searchPlaceholder="请输入搜索内容"
 ></CheckSelect>
 </div>
 </>
 )
}

```


### 自定义空内容


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const EmptyContent = () => {
 const [data] = React.useState([])

 return (
 <> 
 <div className="check-select-empty-content__wrap">
 <CheckSelect style={{ width: 240 }} data={data} emptyContent="暂无选项" />
 </div>
 </>
 )
}

```


### 查看已选

只展示选中的选项


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select' 
export const OnlyChecked = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-only-checked__wrap">
 <CheckSelect
 style={{ width: 240 }}
 placeholder="请选择"
 searchable
 clearable
 data={data}
 showOnlyShowChecked
 // showCheckAll
 />
 </div>
 </>
 )
}

```


### 带Tooltip提示


```tsx
import React from 'react'
import CheckSelect from '@hi-ui/check-select'
import Tooltip from '@hi-ui/tooltip'
import Checkbox from '@hi-ui/checkbox' 
export const Tip = () => {
 const [data] = React.useState([
 { title: '电视', id: '3', disabled: false },
 { title: '手机', id: '2' },
 { title: '笔记本', id: '4', disabled: false },
 { title: '生活周边超级长文案展示生活周边超级长文案展示', id: '5' },
 { title: '办公', id: '6' },
 ])

 return (
 <> 
 <div className="check-select-tip__wrap">
 <CheckSelect
 style={{ width: 240 }}
 clearable={false}
 data={data}
 render={(item) => {
 console.log(item)
 return (
 <Tooltip title={item.title} placement="right">
 <Checkbox
 checked={item.checked}
 disabled={item.disabled}
 style={{
 display: 'inline-block',
 width: '100%',
 overflow: 'hidden',
 textOverflow: 'ellipsis',
 whiteSpace: 'nowrap',
 }}
 >
 {item.title}
 </Checkbox>
 </Tooltip>
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
import CheckSelect from '@hi-ui/check-select'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-addon__wrap">
 <CheckSelect
 style={{ width: 240 }}
 placeholder="请选择"
 searchable
 // clearable={false}
 data={data}
 tagInputProps={{ wrap: true }}
 prefix={<AppStoreOutlined />}
 suffix={<InfoCircleOutlined style={{ marginRight: 8 }} />}
 />
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import { FilterOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import CheckSelect from '@hi-ui/check-select' 
export const CustomRender = () => {
 const [data] = React.useState([
 { title: '手机', id: '1' },
 { title: '电脑', id: '2' },
 { title: '电视', id: '3' },
 { title: '平板', id: '4' },
 { title: '冰箱', id: '5' },
 { title: '洗衣机', id: '6' },
 { title: '空调', id: '7' },
 { title: '其它', id: '8' },
 ])

 return (
 <> 
 <div className="check-select-custom-render__wrap">
 <h2>只展示图标</h2>
 <CheckSelect
 style={{ width: 'auto' }}
 optionWidth={200}
 placeholder="请选择"
 searchable
 clearable
 data={data}
 onChange={console.log}
 customRender={<FilterOutlined />}
 overlay={{
 placement: 'right-start',
 }}
 />
 <h2>展示选中内容</h2>
 <CheckSelect
 style={{ width: 'auto' }}
 optionWidth={200}
 placeholder="请选择"
 searchable
 clearable
 data={data}
 defaultValue={['2']}
 customRender={(value) => {
 return (
 <Space>
 <Button>点击选择</Button>
 <Space onClick={(e) => e.stopPropagation()}>
 {value.map((item, index) => (
 <span key={index}>{item.title}</span>
 ))}
 </Space>
 </Space>
 )
 }}
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
import CheckSelect, { CheckSelectSemanticName } from '@hi-ui/check-select' 
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

 const [selected, setSelected] = useState<CheckSelectSemanticName>()

 return (
 <> 
 <div className="select-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <CheckSelect
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
 onMouseEnter={() => setSelected(dataItem.title as CheckSelectSemanticName)}
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

### CheckSelect Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | true |
| searchable | 是否可搜索（仅在 title 为字符串时支持） | boolean | true \| false | - |
| clearable | 是否可清空 | boolean | true \| false | true |
| onClear | 是否点击清理 tags | (() => void) | - | - |
| size | 自定义尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| render | 自定义渲染节点的 title 内容 | ((item: CheckSelectItemEventData) => ReactNode) | - | - |
| displayRender | 自定义选择后触发器所展示的内容，只在 title 为字符串时有效 | ((option: CheckSelectItemEventData) => ReactNode) | - | - |
| placeholder | 触发器输入框占位符 | string | - | - |
| appearance | 设置展现形式 | CheckSelectAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | - |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| searchMode | 节点搜索模式，仅在mode=normal模式下生效 | "filter" \| "highlight" | "filter" \| "highlight" | - |
| filterOption | 自定义搜索过滤器，仅在 searchable 为 true 时有效&#xA;第一个参数为输入的关键字，&#xA;第二个为数据项，返回值为 true 时将出现在结果项 | ((keyword: string, item: CheckSelectDataItem) => boolean) | - | - |
| dataSource | 异步加载数据 | UseDataSource\<CheckSelectMergedItem\[]> | - | - |
| searchOnInit | 初始化时执行一次搜索，仅在 dataSource 不为空时有效 | boolean | true \| false | - |
| renderExtraFooter | 自定义下拉菜单底部渲染 | ((CheckAllNode?: ReactNode) => ReactNode) | - | - |
| renderExtraHeader | 自定义下拉菜单顶部渲染 | (() => ReactNode) | - | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode | - | - |
| clearIcon | 自定义清除 tags 的 icon | ReactNode | - | - |
| onOpen | 面板打开时回调 | (() => void) | - | - |
| onClose | 面板关闭时回调 | (() => void) | - | - |
| showCheckAll | 是否开启全选功能 | boolean | true \| false | false |
| showOnlyShowChecked | 是否开启查看仅已选功能 | boolean | true \| false | false |
| checkedOnEntered | 按Enter键是否选中当前项 | boolean | true \| false | true |
| customRender | 自定义渲染选中的内容 | ReactNode \| ((option: CheckSelectItemEventData\[]) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (option: CheckSelectItemEventData\[]) => ReactNode | - |
| tagInputProps | TagInput 参数设置 | TagInputMockProps | - | - |
| creatableInSearch | 是否开启创建选项 | boolean | true \| false | - |
| onItemCreate | 创建选项时触发 | ((item: CheckSelectMergedItem) => void) | - | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | true |
| innerRef | 提供辅助方法的内部引用 | Ref\<CheckSelectHelper> | - | - |
| loading | 是否在加载中 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| emptyContent | 设置选项为空时展示的内容 | ReactNode | - | - |
| loadingContent | 加载中时的提示 | ReactNode | - | - |
| showEmpty | 展示未搜索结果 | boolean | true \| false | - |
| optionWidth | 自定义下拉选项宽度 | Width\<string \| number> | string \| number \| string & {} | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| keyword | 搜索关键字，searchable 为 true 时有效 | string | - | - |
| creatableInSearchVisible | 是否显示「创建选项」入口。为 false 时不显示。&#xA;不传（undefined）时保持兼容：只要有搜索词即显示创建入口。&#xA;Select/CheckSelect 会传入此 prop，实现「仅当无结果或关键字与结果无全匹配时显示」。 | boolean | true \| false | - |
| createTitle | 创建选项时展示的标题 | string | - | - |
| onCreate | 创建选项时触发回调 | ((keyword: string) => void) | - | - |
| onSearch | 搜索时触发回调 | ((keyword: string) => void) | - | - |
| clearSearchOnClosed | 是否在关闭时清除搜索 | boolean | true \| false | - |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| searchPlaceholder | 搜索的占位符 | string | - | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOverlayScroll | 下拉列表滚动时的回调 | (() => void) | - | - |
| gutterGap | 气泡卡片与触发器的间距 | number | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| value | 设置当前选中值 | ReactText\[] | - | - |
| defaultValue | 设置当前选中值默认值 | ReactText\[] | - | - |
| onChange | 选中值改变时的回调&#xA;value: 所有选中项的 id 集合&#xA;changedItems: 变更的选项集合&#xA;checkedItems：所有选中项的选项集合 | ((value: ReactText\[], changedItems: CheckSelectDataItem\[], checkedItems: CheckSelectDataItem\[]) => void) | - | - |
| data | 选项数据 | CheckSelectMergedItem\[] | - | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | Record\<string, string> | - | "{} as any" |
| classNames | | CheckSelectSemanticClassNames | - | - |
| styles | | CheckSelectSemanticStyles | - | - |


## Type

### CheckSelectMergedItem

> CheckSelectDataItem | CheckSelectGroupDataItem

#### CheckSelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----------------- | --------- | ------------- | ------ |
| id | 选择项值，唯一 id | ReactText | - | - |
| title | 选项标题 | ReactNode | - | - |
| disabled | 是否禁用该选项 | boolean | true \| false | false |

#### CheckSelectGroupDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ---------- | --------------------- | ------ | ------ |
| groupTitle | 选项组标题 | ReactNode | - | - |
| children | 组选项列表 | CheckSelectDataItem[] | - | - |

### CheckSelectItemEventData

> 继承自 CheckSelectDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------------------------------ | ------------------------ | ------ | ------ |
| raw | 关联用户传入的原始数据对象 | CheckSelectDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的组信息 | CheckSelectGroupDataItem | - | - |

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
