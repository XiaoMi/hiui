# Search 搜索

可以通过关键字从海量数据条目中检索到匹配数据，较大提升数据检索能力。

## 使用示例

### 基础用法

按搜索关键字直接请求结果


```tsx
import React from 'react'
import Search from '@hi-ui/search' 
export const Basic = () => {
 return (
 <> 
 <div className="search-basic__wrap">
 <Search
 style={{ width: 260 }}
 placeholder="搜索关键字"
 onSearch={(keyword) => {
 console.log('onSearch', keyword)
 }}
 />
 </div>
 </>
 )
}

```


### 关键词联想数据

输入搜索关键词时，可以自动联想匹配的关键字，提高检索效率


```tsx
import React from 'react'
import Search from '@hi-ui/search' 
export const Data = () => {
 return (
 <> 
 <div className="search-basic__wrap">
 <div>
 <h2>普通数据</h2>
 <Search
 style={{ width: 260 }}
 placeholder="搜索关键字"
 data={[
 {
 id: 'miphone',
 title: '手机',
 },
 {
 id: 'live',
 title: '智能生活',
 },
 ]}
 onSearch={(keyword, item) => {
 console.log('Input Value', keyword, item)
 }}
 />
 </div>
 <div>
 <h2>分组</h2>
 <Search
 style={{ width: 260 }}
 placeholder="搜索关键字"
 data={[
 {
 id: 'miphone',
 title: '手机',
 children: [
 {
 id: 1,
 title: '小米9 Pro',
 },
 {
 id: 2,
 title: '小米9 探索版',
 },
 {
 id: 3,
 title: '小米9 CC 美图定制版',
 },
 ],
 },
 {
 id: 'live',
 title: '智能生活',
 children: [
 {
 id: 4,
 title: '小米 手环',
 },
 {
 id: 5,
 title: '小米 净水器',
 },
 {
 id: 6,
 title: '小米 小爱音响',
 },
 ],
 },
 ]}
 // onSearch={(keyword) => {
 // console.log('Input Value', keyword)
 // keyword && alert('Input Value: ' + keyword)
 // }}
 />
 </div>
 </div>
 </>
 )
}

```


### 异步搜索


```tsx
import React from 'react'
import Search from '@hi-ui/search' 
export const Async = () => {
 const [loading, setLoading] = React.useState(false)
 const [data, setData] = React.useState([])

 return (
 <> 
 <div className="search-async__wrap">
 <Search
 style={{ width: 260 }}
 placeholder="搜索关键字"
 loading={loading}
 data={data}
 onSearch={(keyword) => {
 console.log('onSearch', keyword)
 }}
 onChange={(value) => {
 if (!value) {
 // 清空操作
 setData([])
 return
 }

 // 模拟异步请求数据
 setLoading(true)
 setTimeout(() => {
 const mockDataItem = (str: string, value: number) => ({
 id: str.repeat(value),
 title: str.repeat(value),
 })

 setData([mockDataItem(value, 1), mockDataItem(value, 2), mockDataItem(value, 3)])
 setLoading(false)
 }, 1000)
 }}
 />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Search from '@hi-ui/search' 
export const Size = () => {
 return (
 <> 
 <div className="search-size__wrap">
 <Search style={{ width: 260 }} placeholder="搜索关键字" size="sm" />
 <br />
 <br />
 <Search style={{ width: 260 }} placeholder="搜索关键字" size="md" />
 <br />
 <br />
 <Search style={{ width: 260 }} placeholder="搜索关键字" size="lg" />
 </div>
 </>
 )
}

```


### 自定义按钮


```tsx
import React from 'react'
import Search from '@hi-ui/search'
import { SearchOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 const [data] = React.useState([
 {
 id: 'miphone',
 title: '手机',
 children: [
 {
 id: 1,
 title: '小米9 Pro',
 },
 {
 id: 2,
 title: '小米9 探索版',
 },
 {
 id: 3,
 title: '小米9 CC 美图定制版',
 },
 ],
 },
 {
 id: 'live',
 title: '智能生活',
 children: [
 {
 id: 4,
 title: '小米 手环',
 },
 {
 id: 5,
 title: '小米 净水器',
 },
 {
 id: 6,
 title: '小米 小爱音响',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="search-addon__wrap">
 <Search
 style={{ width: 260 }}
 placeholder="搜索关键字"
 prefix={<SearchOutlined />}
 append={null}
 data={data}
 />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性两种


```tsx
import React from 'react'
import Search from '@hi-ui/search' 
export const Appearance = () => {
 const [data] = React.useState([
 {
 id: 'miphone',
 title: '手机',
 children: [
 {
 id: 1,
 title: '小米9 Pro',
 },
 {
 id: 2,
 title: '小米9 探索版',
 },
 {
 id: 3,
 title: '小米9 CC 美图定制版',
 },
 ],
 },
 {
 id: 'live',
 title: '智能生活',
 children: [
 {
 id: 4,
 title: '小米 手环',
 },
 {
 id: 5,
 title: '小米 净水器',
 },
 {
 id: 6,
 title: '小米 小爱音响',
 },
 ],
 },
 ])

 return (
 <> 
 <div className="search-appearance__wrap">
 <div>
 <h2>线性</h2>
 <Search style={{ width: 260 }} placeholder="搜索关键字" data={data} appearance="line" />
 </div>
 <div>
 <h2>面性</h2>
 <Search style={{ width: 260 }} placeholder="搜索关键字" data={data} appearance="filled" />
 </div>
 </div>
 </>
 )
}

```


### 分类检索

按不同的类别划分搜索范围；可减少搜索成本


```tsx
import React from 'react'
import Search from '@hi-ui/search'
import Select from '@hi-ui/select' 
export const Classify = () => {
 return (
 <> 
 <div className="search-classify__wrap">
 <Search
 style={{ width: 360 }}
 placeholder="搜索关键字"
 prepend={
 <Select
 clearable={false}
 style={{ width: 90 }}
 onChange={(selectedIds, changedItem) => {
 console.log(selectedIds, changedItem)
 }}
 data={[
 { title: '订单号', id: '1' },
 { title: '用户名', id: '2' },
 ]}
 defaultValue="1"
 />
 }
 onSearch={(title) => {
 console.log('Input Value', title)
 }}
 />
 </div>
 </>
 )
}

```


## Props

### Search Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| loading | 是否展示 loading | boolean | true \| false | false |
| appearance | 设置展现形式 | "line" \| "filled" | "line" \| "filled" | - |
| onChange | 值改变时的回调 | ((value: string) => void) | - | - |
| onSearch | 点击搜索图标、清除图标，点击下拉选项，或聚焦按下回车键时的回调 | ((value: string, item?: SearchDataItem) => void) \| undefined | (value: string, item?: SearchDataItem \| undefined) => void | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| dropdownClassName | 下拉列表的类名称 | string | - | - |
| data | 搜索结果的数据 | SearchDataItem\[] | - | \[] |
| fieldNames | 设置 data 中 id, title, children 对应的 key | HiBaseFieldNames | - | - |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| type | 设置输入框类型 | InputTypeEnum | "number" \| "text" \| "id" \| "tel" \| "card" \| "amount" \| "email" \| "password" | - |
| defaultValue | 设置输入框的默认值 | string | - | "" |
| value | 设置输入框的值 | string | - | - |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| prefix | 输入框前置内容 | ReactNode | - | - |
| autoFocus | 开启输入框自动聚焦 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| maxLength | 输入最大长度 | number | - | - |
| placeholder | 输入框占位符 | string | - | - |
| readOnly | 开启输入框只读 | boolean | true \| false | - |
| suffix | 输入框后置内容 | ReactNode | - | - |
| prepend | 输入框前置外部内容 | ReactNode | - | - |
| append | 输入框后置外部内容 | ReactNode | - | - |
| clearable | 是否可清空，通过点击右侧清除按钮 | boolean | true \| false | - |
| trimValueOnBlur | 开启失焦时触发对值的 trim，将触发 onChange 给用户 | boolean | true \| false | - |
| clearableTrigger | 清除按钮展示的触发形态 | "always" \| "hover" | "always" \| "hover" | - |
| waitCompositionEnd | 是否等待文本段落组成完成 | boolean | true \| false | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | InputSemanticClassNames | - | - |
| styles | | InputSemanticStyles | - | - |


## SearchDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------------------ | ---------------- | ------ | ------ |
| id | 选项唯一 id | ReactText | - | - |
| title | 选项标题，如果存在 children 则表示分组标题 | ReactNode | - | - |
| children | 分组选项列表 | SearchDataItem[] | - | - |
