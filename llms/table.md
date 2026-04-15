# Table 表格

可容纳多种数据类型的大型数据容器，并可支持多种数据相关和表格属性设置相关的操作，具有强大的统计功能。

## 使用示例

### 基础用法


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Basic = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-basic__wrap">
 <Table columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 字段别名


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const FieldKey = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 },
 ])

 return (
 <> 
 <div className="table-field-key__wrap">
 <Table fieldKey="name" columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 列冻结


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Frozen = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 200,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 150,
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 width: 150,
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-frozen__wrap">
 <p>使用列冻结必须指定 column 每项 width</p>
 <Table fixedToColumn={{ left: 'name', right: 'email' }} columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 统计行


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Calc = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 total: true,
 avg: true,
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 30,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 27,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 42,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-calc__wrap">
 <Table columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 列筛选


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const ColMenu = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 200,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 150,
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 width: 150,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-col-menu__wrap">
 <Table
 columns={columns}
 data={data}
 showColMenu
 onHighlightedCol={(changedColInfo, highlightedColKeys) => {
 console.log(changedColInfo, highlightedColKeys)
 }}
 onChange={(sorter, extra) => {
 console.log(sorter, extra)
 }}
 />
 </div>
 </>
 )
}

```


### 数据排序


```tsx
import React from 'react'
import Table from '@hi-ui/table' 
export const DataSorter = () => {
 const [columns] = React.useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 80,
 // defaultSortOrder: 'descend' as const,
 sorter(pre, next) {
 return pre.raw.age - next.raw.age
 },
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 180,
 },
 {
 title: 'Address',
 width: 240,
 dataKey: 'address',
 },
 ])
 const [data] = React.useState([
 {
 key: '1',
 name: 'John Brown',
 age: 32,
 phone: '18889898989',
 address: 'New York No. 1 Lake Park',
 },
 {
 key: '3',
 name: 'Joe Black',
 age: 41,
 phone: '18900010002',
 address: 'Sidney No. 1 Lake Park',
 },
 {
 key: '4',
 name: 'Jim Red',
 age: 18,
 phone: '18900010002',
 address: 'London No. 2 Lake Park',
 },
 ])

 return (
 <> 
 <div className="table-data-sorter__wrap">
 <Table columns={columns} data={data} onChange={console.log} />
 </div>
 </>
 )
}

```


### 受控的数据排序


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Table, { TableColumnSortOrder } from '@hi-ui/table' 
export const DataSorterControl = () => {
 const [sortOrder, setSortOrder] = React.useState<TableColumnSortOrder>(null)

 const columns = [
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 80,
 sortOrder,
 sorter(pre, next) {
 return pre.raw.age - next.raw.age
 },
 },
 {
 title: 'Home phone',
 width: 180,
 dataKey: 'phone',
 },
 {
 title: 'Address',
 width: 240,
 dataKey: 'address',
 },
 ]
 const [data] = React.useState([
 {
 key: '1',
 name: 'John Brown',
 age: 32,
 phone: '18889898989',
 address: 'New York No. 1 Lake Park',
 },
 {
 key: '3',
 name: 'Joe Black',
 age: 41,
 phone: '18900010002',
 address: 'Sidney No. 1 Lake Park',
 },
 {
 key: '4',
 name: 'Jim Red',
 age: 18,
 phone: '18900010002',
 address: 'London No. 2 Lake Park',
 },
 ])

 return (
 <> 
 <div className="table-data-sorter-control__wrap">
 <Button onClick={() => setSortOrder('descend')} style={{ marginBottom: 10 }}>
 Sort age
 </Button>
 <Table
 columns={columns}
 data={data}
 onChange={(action, extra) => {
 console.log('action', action, extra)
 setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
 }}
 />
 </div>
 </>
 )
}

```


### 远程排序

使用远程排序，需结合 sortOrder 和 onChange 一起使用，并且将 sorter 设置为 true


```tsx
import React from 'react'
import Table, { TableColumnSortOrder } from '@hi-ui/table' 
export const AsyncSort = () => {
 const [loading, setLoading] = React.useState(false)
 const [sortOrder, setSortOrder] = React.useState<TableColumnSortOrder>(null)

 const columns = [
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 key: 1,
 },
 {
 title: 'Age',
 dataKey: 'age',
 key: 2,
 width: 80,
 sortOrder,
 sorter: true,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 180,
 key: 16,
 },
 {
 title: 'Address',
 width: 240,
 dataKey: 'address',
 key: 17,
 },
 ]
 const initialData = [
 {
 key: '1',
 name: 'John Brown',
 age: 32,
 phone: 18889898989,
 address: 'New York No. 1 Lake Park',
 },
 {
 key: '3',
 name: 'Joe Black',
 age: 41,
 phone: '18900010002',
 address: 'Sidney No. 1 Lake Park',
 },
 {
 key: '4',
 name: 'Jim Red',
 age: 18,
 phone: '18900010002',
 address: 'London No. 2 Lake Park',
 },
 ]
 const [data, setData] = React.useState(initialData)

 return (
 <> 
 <div className="table-async-sort__wrap">
 <Table
 columns={columns}
 data={data}
 loading={loading}
 onChange={(action, extra) => {
 console.log(action, extra)

 if (!action.sorter?.column) {
 setData(initialData)
 setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
 return
 }

 // 对指定列进行远程排序
 if (action.sorter?.column?.dataKey === 'age') {
 setLoading(true)

 // 模拟远程排序，实际情况是调用接口获取排序后的数据
 return new Promise((resolve) => {
 setTimeout(() => {
 const newData = [...data]
 resolve(
 newData.sort((a, b) => {
 if (action.sorter?.order === 'ascend') {
 return a.age - b.age
 } else {
 return b.age - a.age
 }
 })
 )
 setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
 setData(newData)
 setLoading(false)
 }, 1000)
 })
 }
 }}
 />
 </div>
 </>
 )
}

```


### 自定义过滤


```tsx
import { SearchOutlined, FilterOutlined } from '@hi-ui/icons'
import React from 'react'
import Table from '@hi-ui/table'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import CheckSelect from '@hi-ui/check-select'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const CustomFilter = () => {
 const initialData = React.useRef([
 {
 key: '1',
 name: 'John Brown',
 age: 32,
 phone: '18889898989',
 email: 'john.brown@example.com',
 address: 'New York No. 1 Lake Park',
 },
 {
 key: '2',
 name: 'Jim Green',
 phone: '18889898888',
 age: 42,
 email: 'jim.green@example.com',
 address: 'London No. 1 Lake Park',
 },
 {
 key: '3',
 name: 'Joe Black',
 age: 22,
 phone: '18900010002',
 email: 'joe.black@example.com',
 address: 'Sidney No. 1 Lake Park',
 },
 ])
 const [data, setData] = React.useState(initialData.current)
 const customFilterData = (keyword, label) => {
 if (keyword.length > 0) {
 setData(
 initialData.current.filter((item) => {
 return typeof keyword === 'string'
 ? item[label].includes(keyword)
 : keyword.includes(item[label])
 })
 )
 } else {
 setData(initialData.current)
 }
 }

 const [columns] = React.useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 filterDropdownClassName: 'table-customefilter',
 filterIcon: <SearchOutlined />,
 filterDropdown({ setFilterDropdownVisible }) {
 let keyword = ''
 return (
 <div>
 <Input
 placeholder="请输入关键字"
 onChange={(e) => {
 keyword = e.target.value
 }}
 />
 <div style={{ marginTop: '12px', textAlign: 'right' }}>
 <Button onClick={() => setFilterDropdownVisible(false)} appearance="line" size="sm">
 取消
 </Button>
 <Button
 onClick={() => {
 customFilterData(keyword, 'name')
 setFilterDropdownVisible(false)
 }}
 type="primary"
 size="sm"
 >
 确定
 </Button>
 </div>
 </div>
 )
 },
 render(text) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 80,
 sorter(pre, next) {
 return pre.raw.age - next.raw.age
 },
 },
 {
 title: (
 <div style={{ display: 'inline-flex', alignItems: 'center' }}>
 Home phone
 <CheckSelect
 style={{ width: 'auto', marginLeft: 2 }}
 optionWidth={200}
 customRender={<FilterOutlined />}
 searchable
 data={[
 { id: '18889898989', title: '18889898989' },
 { id: '18889898888', title: '18889898888' },
 { id: '18900010002', title: '18900010002' },
 ]}
 onChange={(value) => {
 console.log('value', value)
 customFilterData(value, 'phone')
 }}
 />
 </div>
 ),
 width: 180,
 render(text) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 dataKey: 'phone',
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 180,
 },
 {
 title: 'Address',
 width: 240,
 render(text) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 dataKey: 'address',
 },
 ])

 return (
 <> 
 <div className="table-custom-filter__wrap">
 <Table columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 可调节列宽

表头分组不支持拖拽调节列宽


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip' 
export const Resizable = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 render(text: string) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 // 注：当 title 长度过长时，可设置 minWidth 来保证列头最小宽度
 minWidth: 100,
 render(text: string) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 render(text: string) {
 return <EllipsisTooltip>{text}</EllipsisTooltip>
 },
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 200,
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 width: 200,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-resizable__wrap" style={{ minWidth: 660 }}>
 <Table
 resizable
 // 可选，拖拽过程中想要实现表格宽度自由拉伸，可配置该参数
 tableWidthAdjustOnResize
 onResizeStop={(e, data, index, columnsWidth) => {
 console.log('onResizeStop', e, data, index, columnsWidth)
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### hover 列高亮


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Highlight = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-highlight__wrap">
 <Table showColHighlight showRowHighlight={false} columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 行高亮


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const HighlightRows = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-highlight-rows__wrap">
 <Table columns={columns} data={data} highlightedRowKeys={[1]} />
 </div>
 </>
 )
}

```


### 列高亮


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const HighlightCols = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-highlight-cols__wrap">
 <Table columns={columns} data={data} highlightedColKeys={['name']} />
 </div>
 </>
 )
}

```


### 设置表格行和单元格类名

用于自定义行和单元格的个性化样式


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const RowClassName = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 // 实际使用中可以直接将样式写在样式文件中，不必这样动态创建style标签，此处只是做示例展示
 React.useLayoutEffect(() => {
 const head = document.getElementsByTagName('head')[0]
 const style = document.createElement('style')
 style.appendChild(
 document.createTextNode(`
 .table-row--price-normal .hi-v5-table-cell {
 background: #e5feeb;
 }
 .table-row--price-warning .hi-v5-table-cell {
 background: #fefae0;
 }
 .hi-v5-table-row .table-cell--stock-danger {
 background: #fee9e5;
 }
 `)
 )
 head.appendChild(style)
 }, [])

 return (
 <> 
 <div className="table-row-class-name__wrap">
 <Table
 rowClassName={(record) => {
 const { age } = record.raw
 if (age > 30) {
 return 'table-row--price-warning'
 }
 return 'table-row--price-normal'
 }}
 cellClassName={(record, column) => {
 if (column.raw.dataKey === 'age' && record.raw.age <= 30) {
 return 'table-cell--stock-danger'
 }
 return ''
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### 斑马纹


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Striped = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-striped__wrap">
 <Table striped columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 带边框


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Bordered = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-bordered__wrap">
 <Table bordered columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Size = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-size__wrap" style={{ minWidth: 660, background: '#fff' }}>
 <Table bordered columns={columns} data={data} size="sm" rowSelection={{}} />
 <br />
 <br />
 <Table bordered columns={columns} data={data} size="md" rowSelection={{}} />
 <br />
 <br />
 <Table bordered columns={columns} data={data} size="lg" rowSelection={{}} />
 </div>
 </>
 )
}

```


### 行拖拽


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Draggable = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-draggable__wrap">
 <Table
 draggable
 onDragStart={(e) => console.log('onDragStart', e)}
 onDrop={(e) => {
 console.log('onDrop', e)
 return true
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### 表头列合并

只支持表头列合并，被合并的表头需要设置 colSpan 为 0，则该表头不显示


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const HeaderColSpan = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address + Email',
 dataKey: 'address',
 colSpan: 2,
 },
 {
 title: 'Email',
 dataKey: 'email',
 colSpan: 0,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-header-colspan__wrap">
 <Table bordered columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 表头分组

当列数较少且数据为空时，表头可能显示异常，可配置 <code>needDoubleTable</code> 为 <code>true</code> 来解决


```tsx
import React from 'react'
import Table, { TableColumnItem } from '@hi-ui/table' 
export const GroupHeader = () => {
 const [columns] = React.useState<TableColumnItem[]>([
 {
 title: 'Name',
 dataKey: 'name',
 width: 100,
 },
 {
 title: 'Other',
 dataKey: 'other',
 children: [
 {
 title: 'Age',
 dataKey: 'age',
 width: 80,
 },
 {
 title: 'Address',
 dataKey: 'address',
 children: [
 {
 title: 'Street',
 dataKey: 'street',
 width: 100,
 },
 {
 title: 'Block',
 dataKey: 'block',
 children: [
 {
 title: 'Building',
 dataKey: 'building',
 width: 90,
 },
 {
 title: 'Door No.',
 dataKey: 'number',
 width: 90,
 },
 ],
 },
 ],
 },
 ],
 },
 {
 title: 'Name2',
 dataKey: 'name2',
 width: 100,
 },
 {
 title: 'Company',
 dataKey: 'company',
 children: [
 {
 title: 'Address',
 dataKey: 'companyAddress',
 width: 200,
 },
 {
 title: 'Name',
 dataKey: 'companyName',
 width: 150,
 },
 ],
 },
 {
 title: 'Gender',
 dataKey: 'gender',
 width: 100,
 },
 ])

 const [data] = React.useState(() => {
 const data: any[] = []
 for (let i = 0; i < 6; i++) {
 const item = {
 key: i + 1,
 age: i + 1,
 street: 'Lake Park',
 building: 'C',
 number: 2035,
 name: 'Flcwl',
 name2: 'Flcwl2',
 companyAddress: 'Lake Street 42',
 companyName: 'SoftLake Co',
 gender: 'M',
 }

 data.push(item)
 }

 return data
 })

 return (
 <> 
 <div className="table-group-header__wrap">
 <Table
 rowSelection={{}}
 fixedToColumn={{
 left: 'name',
 right: 'gender',
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### 表格高度自动拉伸

使用该功能需要保证 Table 的父级元素有设置高度，具体请看示例中的用法


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const StretchHeight = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 120,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 200,
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 width: 200,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 {
 name: 'John Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'john.doe@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 4,
 },
 {
 name: 'Jane Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jane.doe@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 5,
 },
 {
 name: 'Jim Beam',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jim.beam@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 6,
 },
 ])

 return (
 <> 
 <div className="table-width__wrap">
 <div
 className="table-width__container"
 style={{
 display: 'flex',
 flexDirection: 'column',
 height: 300,
 }}
 >
 <div
 className="table-width__header"
 style={{ padding: 12, marginBottom: 12, background: '#f5f7f6' }}
 >
 头部内容
 </div>
 {/* 必须加上以下样式 */}
 <div className="table-width__body" style={{ flexGrow: 1, overflow: 'hidden' }}>
 <Table columns={columns} data={data} stretchHeight />
 </div>
 </div>
 </div>
 </>
 )
}

```


### 固定表头

设置 maxHeight 来控制表格的高度


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const FixedHeader = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 {
 name: 'John Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'john.doe@example.com',
 key: 4,
 },
 {
 name: 'Jane Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jane.doe@example.com',
 key: 5,
 },
 {
 name: 'Jim Beam',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jim.beam@example.com',
 key: 6,
 },
 {
 name: 'Jill Bean',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jill.bean@example.com',
 key: 7,
 },
 ])

 return (
 <> 
 <div className="table-fixed-header__wrap">
 <Table maxHeight={200} columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 表头吸顶


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const StickyHeader = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-sticky-header__wrap" style={{ maxHeight: 500, overflow: 'scroll' }}>
 <Table sticky stickyTop={0} columns={columns} data={data} />
 <div style={{ height: 400, paddingTop: 48, textAlign: 'center' }}>模拟外层滚动</div>
 </div>
 </>
 )
}

```


### 页脚吸底


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const StickyFooter = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 {
 name: 'John Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'john.doe@example.com',
 key: 4,
 },
 {
 name: 'Jane Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jane.doe@example.com',
 key: 5,
 },
 {
 name: 'Jim Beam',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jim.beam@example.com',
 key: 6,
 },
 {
 name: 'Jill Bean',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jill.bean@example.com',
 key: 7,
 },
 ])

 const [paginationState, setPaginationState] = React.useState({
 current: 1,
 data: data.slice(0, 5),
 })

 return (
 <> 
 <div className="table-sticky-footer__wrap">
 <Table
 stickyFooter
 maxHeight={200}
 pagination={{
 showTotal: true,
 showJumper: true,
 pageSize: 5,
 total: data.length,
 current: paginationState.current,
 onChange: (page, pre, size = 5) => {
 console.log('onPaginationChange', page, pre, size)

 setPaginationState({
 current: page,
 data: data.slice(size * (page - 1), size * page),
 })
 },
 }}
 columns={columns}
 data={paginationState.data}
 />
 </div>
 </>
 )
}

```


### 树形表格


```tsx
import React from 'react'
import Table from '@hi-ui/table' 
export const TableTree = () => {
 return (
 <> 
 <div className="table-TableTree__wrap">
 <Table
 columns={[
 {
 title: 'A',
 dataKey: 'a',
 sorter(pre, next) {
 return pre.raw.b - next.raw.b
 },
 },
 { title: 'B', dataKey: 'b' },
 { title: 'C', dataKey: 'c' },
 { title: 'D', dataKey: 'd' },
 ]}
 data={[
 { a: 'a-4', b: '4', c: 'c-4', d: 'd-4', key: 4 },
 {
 a: 'a-3',
 b: '3',
 c: 'c-3',
 d: 'd-3',
 key: 3,
 children: [
 {
 a: 'a-3-2',
 b: '32',
 c: 'c-3-2',
 d: 'd-3-2',
 key: 32,
 },
 {
 a: 'a-3-1',
 b: '31',
 c: 'c-3-1',
 d: 'd-3-1',
 key: 31,
 },
 ],
 },
 {
 a: 'a-1',
 b: '1',
 c: 'c-1',
 d: 'd-1',
 key: 1,
 children: [
 { a: 'a-1-3', b: '13', c: 'c-1-3', d: 'd-1-3', key: 13 },
 {
 a: 'a-1-1',
 b: '11',
 c: 'c-1-1',
 d: 'd-1-1',
 key: 11,
 children: [
 {
 a: 'a-1-1-1',
 b: '111',
 c: 'c-1-1-1',
 d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-1',
 key: 111,
 },
 {
 a: 'a-1-1-3',
 b: '113',
 c: 'c-1-1-3',
 d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-3',
 key: 113,
 },
 {
 a: 'a-1-1-2',
 b: '112',
 c: 'c-1-1-2',
 d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-2',
 key: 112,
 },
 ],
 },
 { a: 'a-1-2', b: '12', c: 'c-1-2', d: 'd-1-2', key: 12 },
 ],
 },

 { a: 'a-2', b: '2', c: 'c-2', d: 'd-2', key: 2 },
 ]}
 />
 </div>
 </>
 )
}

```


### 异步加载 children


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const OnLoadChildren = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-basic__wrap">
 <Table
 columns={columns}
 data={data}
 onLoadChildren={(item) => {
 const { depth } = item
 console.log('item', item)
 return new Promise((resolve) => {
 setTimeout(() => {
 // 模拟无子节点情况处理
 if (depth > 0) {
 resolve([])
 } else {
 const children = [
 {
 name: 'Jane Doe',
 age: 30,
 address: '32 Park Road, London',
 email: 'jane.doe@example.com',
 key: new Date().getTime(),
 },
 {
 name: 'Jim Green',
 age: 42,
 address: 'London No. 1 Lake Park',
 email: 'jim.green@example.com',
 key: new Date().getTime() + 1,
 },
 ]
 resolve(children)
 }
 }, 1000)
 })
 }}
 />
 </div>
 </>
 )
}

```


### 内嵌面板


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const ExpandedRender = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-expanded-render__wrap">
 <Table
 fixedToColumn={{ left: 'type' }}
 columns={columns}
 expandedRender={() => {
 return (
 <div style={{ backgroundColor: '#fff', padding: 24, textAlign: 'center' }}>
 此处是自定义展开渲染内容
 </div>
 )
 }}
 data={data}
 />
 </div>
 </>
 )
}

```


### 异步展开渲染


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const AsyncExpandedRender = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 100,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-async-expanded-render__wrap">
 <Table
 defaultExpandedEmbedRowKeys={[1]}
 expandedRender={(rowData, index) => {
 console.log('expandedRender', rowData, index)

 return new Promise((resolve) => {
 // 模拟异步
 setTimeout(() => {
 const embedTable = (
 <Table
 striped
 columns={columns}
 data={[
 {
 name: 'Jane Doe',
 age: 30,
 address: '32 Park Road, London',
 email: 'jane.doe@example.com',
 key: 2,
 },
 ]}
 />
 )

 resolve(embedTable)
 }, 3000)
 })
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### 行选中

通过 rowSelection.type 属性来设置单选或多选，默认为 <code>checkbox</code>


```tsx
import React, { useState } from 'react'
import { RadioGroup } from '@hi-ui/radio'
import Table from '@hi-ui/table' 
export const RowSelection = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 const [selectedRowKeys, setSelectedRowKeys] = React.useState<any>([])
 const [type, setType] = React.useState<'checkbox' | 'radio'>('checkbox')

 React.useEffect(() => {
 if (type === 'radio' && selectedRowKeys.length > 1) {
 setSelectedRowKeys([selectedRowKeys[0]])
 }
 }, [selectedRowKeys, type])

 return (
 <> 
 <div className="table-row-selection__wrap">
 <RadioGroup
 defaultValue={'checkbox'}
 type={'button'}
 data={[
 { title: '多选', id: 'checkbox' },
 { title: '单选', id: 'radio' },
 ]}
 onChange={(value) => {
 console.log('onChange', value)
 setType(value as 'checkbox' | 'radio')
 }}
 style={{ marginBottom: 16 }}
 />
 <Table
 rowSelection={{
 type,
 selectedRowKeys,
 onChange: (keys, target, shouldChecked, rows) => {
 console.log(keys, target, shouldChecked, rows)

 setSelectedRowKeys(keys)
 },
 }}
 columns={columns}
 data={data}
 />
 </div>
 </>
 )
}

```


### 自定义页脚


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const FooterRender = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 const [selectedRowKeys, setSelectedRowKeys] = React.useState<any>([])

 return (
 <> 
 <div className="table-footer-render__wrap">
 <Table
 pagination={{
 pageSize: 5,
 total: data.length,
 }}
 columns={columns}
 data={data}
 rowSelection={{
 selectedRowKeys,
 onChange: (keys, target, shouldChecked, rows) => {
 console.log(keys, target, shouldChecked, rows)

 setSelectedRowKeys(keys)
 },
 }}
 footerRender={(pagination) => {
 return (
 <div
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
 >
 <div>
 已选 <span style={{ color: '#237ffa' }}>{selectedRowKeys.length}</span> 项
 </div>
 {pagination}
 </div>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 合并单元格


```tsx
import React from 'react'
import Table from '@hi-ui/table' 
export const MergedCell = () => {
 return (
 <> 
 <div className="table-merged-cell__wrap">
 <Table
 striped
 columns={[
 {
 title: 'Name',
 dataKey: 'name',
 width: 150,
 render: (text, row, index) => {
 return {
 children: <span>{text}</span>,
 props: {
 // 自定义单元格列合并
 colSpan: index === 4 ? 4 : undefined,
 },
 }
 },
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 150,
 render: (value, row, index) => {
 return {
 children: value,
 props: {
 // 自定义单元格行合并（第 2 ~ 3 行）
 rowSpan: index === 1 ? 2 : index === 2 ? 0 : undefined,
 // 自定义单元格列合并（第 4 行）
 colSpan: index === 4 ? 0 : undefined,
 },
 }
 },
 },
 {
 title: 'Home phone',
 dataKey: 'tel',
 render: (value, row, index) => {
 return {
 children: value,
 props: {
 colSpan: index === 4 ? 0 : undefined,
 },
 }
 },
 },
 {
 title: 'Address',
 dataKey: 'address',
 render: (value, row, index) => {
 return {
 children: value,
 props: {
 colSpan: index === 4 ? 0 : undefined,
 },
 }
 },
 },
 ]}
 data={[
 {
 key: '1',
 name: 'John Brown',
 age: 32,
 tel: '0571-22098909',
 address: 'New York No. 1 Lake Park',
 },
 {
 key: '2',
 name: 'Jim Green',
 tel: '0571-22098333',
 age: 42,
 address: 'London No. 1 Lake Park',
 },
 {
 key: '3',
 name: 'Joe Black',
 age: 32,
 tel: '0575-22098909',
 address: 'Sidney No. 1 Lake Park',
 },
 {
 key: '4',
 name: 'Jim Red',
 age: 18,
 tel: '0575-22098909',
 address: 'London No. 2 Lake Park',
 },
 {
 key: '5',
 name: 'Jake White',
 age: 18,
 tel: '0575-22098909',
 address: 'Dublin No. 2 Lake Park',
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 表格分页


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Pagination = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 {
 name: 'Jim Green',
 age: 42,
 address: 'London No. 1 Lake Park',
 email: 'jim.green@example.com',
 key: 4,
 },
 {
 name: 'Jane Doe',
 age: 30,
 address: '32 Park Road, London',
 email: 'jane.doe@example.com',
 key: 5,
 },
 {
 name: 'Jim Green',
 age: 42,
 address: 'London No. 1 Lake Park',
 email: 'jim.green@example.com',
 key: 6,
 },
 {
 name: 'Jane Doe',
 age: 30,
 address: '32 Park Road, London',
 email: 'jane.doe@example.com',
 key: 7,
 },
 {
 name: 'Jim Green',
 age: 42,
 address: 'London No. 1 Lake Park',
 email: 'jim.green@example.com',
 key: 8,
 },
 ])

 const [paginationState, setPaginationState] = React.useState({
 current: 1,
 data: data.slice(0, 5),
 pageSize: 5,
 })

 console.log('paginationState', paginationState)

 return (
 <> 
 <div className="table-pagination__wrap">
 <Table
 pagination={{
 showTotal: true,
 showJumper: true,
 pageSize: paginationState.pageSize,
 pageSizeOptions: [5, 10, 20],
 pageSizeOptionsOverlay: {
 // 该参数用来配置分页器下拉框的挂载容器，默认是 body，设置为 true 时，会自动寻找最近的元素作为父节点
 // 在浏览器原生的全屏模式中，需要将此值设成 true，否则无法正常显示，若无需在全屏状态下使用，则不需要做任何处理
 disabledPortal: true,
 },
 onPageSizeChange: (pageSize) => {
 setPaginationState((prev) => ({
 ...prev,
 pageSize,
 }))
 },
 total: data.length,
 current: paginationState.current,
 onChange: (page, pre, size = 5) => {
 console.log('onPaginationChange', page, pre, size)

 setPaginationState((prev) => ({
 ...prev,
 current: page,
 data: data.slice(size * (page - 1), size * page),
 }))
 },
 }}
 columns={columns}
 data={paginationState.data}
 />
 </div>
 </>
 )
}

```


### 异步加载数据

封装了分页加载数据的逻辑


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button'
import Table from '@hi-ui/table' 
export const DataSource = () => {
 const [columns] = React.useState([
 { title: 'ID', dataKey: 'id' },
 { title: 'Title', dataKey: 'title' },
 ])

 const [searchVal, setSearchVal] = React.useState(0)

 const handleDataSource = React.useCallback(
 (current, pageSize) => {
 return {
 url: 'https://mife-gallery.test.mi.com/hiui/stores',
 params: {
 page: current,
 pageSize,
 // searchParams: searchVal,
 },
 transformResponse: (res) => {
 const data = JSON.parse(res).data

 return {
 list: data.map((item, i) => {
 return {
 key: i,
 title: item.title + current,
 id: item.id,
 }
 }),
 total: 28,
 }
 },
 }
 },
 // 当查询参数变化后会更新 dataSource，此时会自动刷新数据
 // 如果不希望查询参数变化后马上更新数据，例如点击查询按钮后再去刷新数据，可以将该依赖值设置一个其他自定义的状态值
 [searchVal]
 )

 return (
 <> 
 <div className="table-data-source__wrap">
 <Space align="center" style={{ marginBottom: '1em' }}>
 <Button onClick={() => setSearchVal(searchVal + 1)}>模拟更新查询参数</Button>
 <small>更新后表格会从第一页开始重新加载数据</small>
 </Space>
 <Table columns={columns} dataSource={handleDataSource} />
 </div>
 </>
 )
}

```


### 自定义列控制


```tsx
import React from 'react'
import Table from '@hi-ui/table' 
export const Setting = () => {
 const [dataSource] = React.useState([
 {
 name: '小米9',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '3299.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',

 address: '华润五彩城店',
 stock: '29,000',
 key: 1,
 },
 {
 name: '小米9 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '1999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '清河店',
 stock: '10,000',
 key: 2,
 },
 {
 name: '小米8',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '2599.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 3,
 },
 {
 name: 'Redmi Note7',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '140,000',
 key: 4,
 },
 {
 name: '小米8 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '699.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 5,
 },
 ])
 const cacheKey = '_hiuiTableSetStoreKey_'
 const initStoreInfo: any = localStorage.getItem(cacheKey)
 ? JSON.parse(localStorage.getItem(cacheKey))
 : {}
 const [hiddenColKeys, setHiddenColKeys] = React.useState(initStoreInfo.hiddenColKeys)
 const [sortedColKeys, setSortedColKeys] = React.useState(initStoreInfo.sortedColKeys)
 const onSetColKeysChange = (sortedColKeys: string[], hiddenColKeys: string[]) => {
 console.log('onColKeysChange', { sortedColKeys, hiddenColKeys })
 setHiddenColKeys(hiddenColKeys)
 setSortedColKeys(sortedColKeys)
 localStorage.setItem(cacheKey, JSON.stringify({ hiddenColKeys, sortedColKeys }))
 }
 const columnsMemo = React.useMemo(() => {
 return [
 {
 title: '商品名',
 dataKey: 'name',
 width: 150,
 },
 {
 title: '品类',
 dataKey: 'type',
 width: 150,
 },
 {
 title: '规格',
 dataKey: 'size',
 width: 150,
 },
 {
 title: '单价',
 dataKey: 'price',
 width: 150,
 },
 {
 title: '门店',
 dataKey: 'address',
 width: 150,
 },
 {
 title: '库存',
 dataKey: 'stock',
 width: 150,
 },
 ]
 }, [])

 return (
 <> 
 <div className="table-setting__wrap" style={{ minWidth: 660 }}>
 <Table
 hiddenColKeys={hiddenColKeys}
 sortedColKeys={sortedColKeys}
 onSetColKeysChange={onSetColKeysChange}
 checkDisabledColKeys={['name', 'type']}
 columns={columnsMemo}
 data={dataSource}
 setting
 />
 </div>
 </>
 )
}

```


### 设置抽屉


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Table, { SettingDrawer } from '@hi-ui/table' 
export const TableSettingDrawer = () => {
 const [dataSource] = React.useState([
 {
 name: '小米9',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '3299.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '29,000',
 key: 1,
 },
 {
 name: '小米9 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '1999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '清河店',
 stock: '10,000',
 key: 2,
 },
 {
 name: '小米8',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '2599.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 3,
 },
 {
 name: 'Redmi Note7',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '140,000',
 key: 4,
 },
 {
 name: '小米8 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '699.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 5,
 },
 ])

 const columnsMemo = React.useMemo(() => {
 return [
 {
 title: '商品名',
 dataKey: 'name',
 width: 150,
 },
 {
 title: '品类',
 dataKey: 'type',
 width: 150,
 },
 {
 title: '规格',
 dataKey: 'size',
 width: 150,
 },
 {
 title: '单价',
 dataKey: 'price',
 width: 150,
 },
 {
 title: '门店',
 dataKey: 'address',
 width: 150,
 },
 {
 title: '库存',
 dataKey: 'stock',
 width: 150,
 },
 ]
 }, [])

 const [columns, setColumns] = React.useState(columnsMemo)
 const [hiddenColKeys, setHiddenColKeys] = React.useState<string[]>(['price'])
 const [sortedColKeys, setSortColKeys] = React.useState<string[]>()

 const onSetColKeysChange = (
 sortedColKeys: string[],
 hiddenColKeys: string[],
 newColumns: any[]
 ) => {
 console.log('onColKeysChange', { sortedColKeys, hiddenColKeys, newColumns })

 setSortColKeys(sortedColKeys)
 setHiddenColKeys(hiddenColKeys)
 setColumns(newColumns)
 }

 const [visible, setVisible] = React.useState<boolean>(false)

 return (
 <> 
 <div className="table-setting-drawer__wrap" style={{ minWidth: 660 }}>
 <div style={{ marginBottom: '1em' }}>
 <Button onClick={() => setVisible(true)}>列设置抽屉</Button>
 </div>
 <Table columns={columns} data={dataSource} />
 <SettingDrawer
 visible={visible}
 onClose={() => setVisible(false)}
 drawerProps={{ width: 400, title: '表格字段设置' }}
 columns={columnsMemo}
 checkDisabledColKeys={['name', 'type']}
 // 禁用拖拽的列
 dragDisabledColKeys={['name', 'type']}
 hiddenColKeys={hiddenColKeys}
 sortedColKeys={sortedColKeys}
 onSetColKeysChange={onSetColKeysChange}
 />
 </div>
 </>
 )
}

```


### 设置抽屉-全选


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Table, { SettingDrawer } from '@hi-ui/table' 
export const SettingDrawerCheckAll = () => {
 const [dataSource] = React.useState([
 {
 name: '小米9',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '3299.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '29,000',
 key: 1,
 },
 {
 name: '小米9 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '1999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '清河店',
 stock: '10,000',
 key: 2,
 },
 {
 name: '小米8',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '2599.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 3,
 },
 {
 name: 'Redmi Note7',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '140,000',
 key: 4,
 },
 {
 name: '小米8 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '699.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 5,
 },
 ])

 const columnsMemo = React.useMemo(() => {
 return [
 {
 title: '商品名',
 dataKey: 'name',
 width: 150,
 },
 {
 title: '品类',
 dataKey: 'type',
 width: 150,
 },
 {
 title: '规格',
 dataKey: 'size',
 width: 150,
 },
 {
 title: '单价',
 dataKey: 'price',
 width: 150,
 },
 {
 title: '门店',
 dataKey: 'address',
 width: 150,
 },
 {
 title: '库存',
 dataKey: 'stock',
 width: 150,
 },
 ]
 }, [])

 const [columns, setColumns] = React.useState(columnsMemo)
 const [hiddenColKeys, setHiddenColKeys] = React.useState<string[]>(['price'])
 const [sortedColKeys, setSortColKeys] = React.useState<string[]>()

 const onSetColKeysChange = (
 sortedColKeys: string[],
 hiddenColKeys: string[],
 newColumns: any[]
 ) => {
 console.log('onColKeysChange', { sortedColKeys, hiddenColKeys, newColumns })

 setSortColKeys(sortedColKeys)
 setHiddenColKeys(hiddenColKeys)
 setColumns(newColumns)
 }

 const [visible, setVisible] = React.useState<boolean>(false)

 return (
 <> 
 <div className="table-setting-drawer-check-all__wrap" style={{ minWidth: 660 }}>
 <div style={{ marginBottom: '1em' }}>
 <Button onClick={() => setVisible(true)}>列设置抽屉</Button>
 </div>
 <Table columns={columns} data={dataSource} />
 <SettingDrawer
 visible={visible}
 showCheckAll
 onClose={() => setVisible(false)}
 drawerProps={{ width: 400, title: '表格字段设置' }}
 columns={columnsMemo}
 checkDisabledColKeys={['name', 'type']}
 // 禁用拖拽的列
 dragDisabledColKeys={['name', 'type']}
 hiddenColKeys={hiddenColKeys}
 sortedColKeys={sortedColKeys}
 onSetColKeysChange={onSetColKeysChange}
 />
 </div>
 </>
 )
}

```


### 设置抽屉-扩展头部内容


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Search from '@hi-ui/search'
import { SearchOutlined } from '@hi-ui/icons'
import Highlighter from '@hi-ui/highlighter'
import Table, { SettingDrawer, TableColumnItem } from '@hi-ui/table' 
export const SettingDrawerExtraHeader = () => {
 const [dataSource] = React.useState([
 {
 name: '小米9',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '3299.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',

 address: '华润五彩城店',
 stock: '29,000',
 key: 1,
 },
 {
 name: '小米9 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '1999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '清河店',
 stock: '10,000',
 key: 2,
 },
 {
 name: '小米8',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '2599.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 3,
 },
 {
 name: 'Redmi Note7',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '999.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '华润五彩城店',
 stock: '140,000',
 key: 4,
 },
 {
 name: '小米8 SE',
 type: '手机',
 size: '6G+64G 幻彩蓝',
 price: '699.00',
 size1: '6G+64G 幻彩蓝',
 price1: '3299.00',
 size2: '6G+64G 幻彩蓝',
 price2: '3299.00',
 size3: '6G+64G 幻彩蓝',
 price3: '3299.00',
 size4: '6G+64G 幻彩蓝',
 price4: '3299.00',
 size5: '6G+64G 幻彩蓝',
 price5: '3299.00',
 size6: '6G+64G 幻彩蓝',
 price6: '3299.00',
 size7: '6G+64G 幻彩蓝',
 price7: '3299.00',
 address: '双安店',
 stock: '12,000',
 key: 5,
 },
 ])
 const [originColumns] = React.useState<TableColumnItem[]>([
 {
 title: '商品名',
 dataKey: 'name',
 width: 150,
 },
 {
 title: '品类',
 dataKey: 'type',
 width: 150,
 },
 {
 title: '规格',
 dataKey: 'size',
 width: 150,
 },
 {
 title: '单价',
 dataKey: 'price',
 width: 150,
 },
 {
 title: '门店',
 dataKey: 'address',
 width: 150,
 },
 {
 title: '库存',
 dataKey: 'stock',
 width: 150,
 },
 ])
 const [columns, setColumns] = React.useState<TableColumnItem[]>(originColumns)
 const [disabledColumns] = React.useState<string[]>(['name', 'type'])
 const [searchKey, setSearchKey] = React.useState<string>('')
 const [hiddenColKeys, setHiddenColKeys] = React.useState<string[]>(['price'])
 const [sortedColKeys, setSortColKeys] = React.useState<string[]>()
 const [visible, setVisible] = React.useState<boolean>(false)

 const settingColumnsMemo = React.useMemo(() => {
 return [...originColumns]
 // searchKey 作为依赖项，目的是搜索结果改变时重新渲染设置项，让关键字高亮
 }, [originColumns, searchKey])

 const onSetColKeysChange = (
 sortedColKeys: string[],
 hiddenColKeys: string[],
 newColumns: TableColumnItem[]
 ) => {
 console.log('onColKeysChange', { sortedColKeys, hiddenColKeys, newColumns })

 setSortColKeys(sortedColKeys)
 setHiddenColKeys(hiddenColKeys)
 setColumns(newColumns)
 }

 return (
 <> 
 <div className="table-setting-drawer-extra-header__wrap" style={{ minWidth: 660 }}>
 <div style={{ marginBottom: '1em' }}>
 <Button onClick={() => setVisible(true)}>列设置抽屉</Button>
 </div>
 <Table columns={columns} data={dataSource} />
 <SettingDrawer
 visible={visible}
 onClose={() => setVisible(false)}
 drawerProps={{ width: 400, title: '表格字段设置' }}
 columns={settingColumnsMemo}
 // 禁用拖拽的列
 dragDisabledColKeys={settingColumnsMemo.map((d) => d.dataKey!)}
 checkDisabledColKeys={disabledColumns}
 hiddenColKeys={hiddenColKeys}
 sortedColKeys={sortedColKeys}
 onSetColKeysChange={onSetColKeysChange}
 itemRender={(item) => {
 return <Highlighter keyword={searchKey}>{item.title}</Highlighter>
 }}
 extraHeader={
 <div style={{ marginBottom: 16 }}>
 <Search
 prefix={<SearchOutlined />}
 append={null}
 placeholder="搜素"
 onInput={(e) => {
 const searchKey = (e.target as HTMLInputElement).value
 setSearchKey(searchKey)
 }}
 onSearch={(key, item) => console.log({ key, item })}
 />
 </div>
 }
 />
 </div>
 </>
 )
}

```


### 设置滚动条

解决Windows环境下滚动条样式不美观问题


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Scrollbar = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 width: 200,
 },
 {
 title: 'Age',
 dataKey: 'age',
 width: 100,
 },
 {
 title: 'Address',
 dataKey: 'address',
 width: 200,
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 width: 150,
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 width: 150,
 },
 {
 title: 'Email',
 dataKey: 'email',
 width: 200,
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 phone: '1234567890',
 phone2: '1234567890',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 phone: '1234567890',
 phone2: '1234567890',
 key: 3,
 },
 {
 name: 'John Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'john.doe@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 4,
 },
 {
 name: 'Jane Doe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jane.doe@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 5,
 },
 {
 name: 'Jim Beam',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jim.beam@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 6,
 },
 {
 name: 'Jill Bean',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'jill.bean@example.com',
 phone: '1234567890',
 phone2: '1234567890',
 key: 7,
 },
 ])

 const scrollbarInnerRef = React.useRef<any>(null)
 const update = () => scrollbarInnerRef.current?.update?.()

 // 在外部滚动时更新 Scrollbar 滚动条的位置
 // 该处理是针对 scrollbarXStickToBottom 参数为 true 的情况，让滚动条始终保持在底部，详见 Scrollbar 组件文档
 React.useEffect(() => {
 document.addEventListener('scroll', update)

 return () => {
 document.removeEventListener('scroll', update)
 }
 }, [])

 return (
 <> 
 <div className="table-scrollbar__wrap">
 <Table
 fixedToColumn={{ left: 'name', right: 'email' }}
 columns={columns}
 data={data}
 maxHeight={200}
 scrollbar={
 // 根据需要进行以下配置
 {
 // 保持滚动条始终可见
 keepVisible: true,
 innerRef: scrollbarInnerRef,
 // 设置滚动条的 z-index 值
 zIndex: 9,
 settings: {
 // 垂直滑动时，让横向滚动条一直显示在容器底部
 scrollbarXStickToBottom: true,
 // 横向滚动条距离底部的距离
 scrollbarXStickToBottomGap: 20,
 },
 }
 }
 />
 </div>
 </>
 )
}

```


### 加载态


```tsx
import React, { useState } from 'react'
import Table from '@hi-ui/table' 
export const Loading = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 return (
 <> 
 <div className="table-loading__wrap">
 <Table loading columns={columns} data={data} />
 </div>
 </>
 )
}

```


### 空状态


```tsx
import React from 'react'
import Table from '@hi-ui/table'
import EmptyState from '@hi-ui/empty-state' 
export const Empty = () => {
 return (
 <> 
 <div className="table-empty__wrap">
 <Table
 columns={[
 { title: 'Name', dataKey: 'name' },
 { title: 'Age', dataKey: 'age' },
 { title: 'Address', dataKey: 'address' },
 { title: 'Email', dataKey: 'email' },
 ]}
 data={[]}
 emptyContent={<EmptyState title={'暂时没有数据，请联系管理员'} />}
 />
 </div>
 </>
 )
}

```


### 虚拟列表

内嵌面板、表头分组等复杂场景暂不支持


```tsx
import React, { useState } from 'react'
import Table, { TableHelper } from '@hi-ui/table'
import Button from '@hi-ui/button' 
export const Virtual = () => {
 const MockData: any = []
 for (let index = 0; index < 10000; index++) {
 MockData.push({
 name: 'yun-' + index,
 age: Math.floor(Math.random() * 100),
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 phone: '1234567890',
 phone2: '1234567890',
 })
 }
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Phone',
 dataKey: 'phone',
 },
 {
 title: 'Phone2',
 dataKey: 'phone2',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])
 const [data] = React.useState(MockData)
 const tableRef = React.useRef<TableHelper>(null)

 return (
 <> 
 <div className="table-virtual__wrap">
 <div style={{ marginBottom: '1em' }}>
 <Button
 onClick={() => {
 // key 为节点 id
 tableRef.current?.scrollTo?.({ key: 'yun-100', align: 'top' })
 }}
 >
 scroll to key: yun-100
 </Button>
 </div>
 <Table
 fieldKey="name"
 columns={columns}
 data={data}
 virtual
 innerRef={tableRef}
 // virtual={{
 // onVisibleChange(...args) {
 // console.log('onVisibleChange', ...args)
 // },
 // }}
 rowSelection={{}}
 fixedToColumn={{ right: 'email' }}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 对表格各区域进行细粒度样式控制


```tsx
import React, { useState } from 'react'
import List from '@hi-ui/list'
import Table, { TableSemanticName } from '@hi-ui/table' 
export const Semantic = () => {
 const [columns] = useState([
 {
 title: 'Name',
 dataKey: 'name',
 },
 {
 title: 'Age',
 dataKey: 'age',
 },
 {
 title: 'Address',
 dataKey: 'address',
 },
 {
 title: 'Email',
 dataKey: 'email',
 },
 ])

 const [data] = useState([
 {
 name: 'Raynor Maverick',
 age: 31,
 address: '45 Sunbeam Lane, Mistville',
 email: 'raynor.mav@maildemo.net',
 key: 1,
 },
 {
 name: 'Elina Voss',
 age: 26,
 address: '83 Dewdrop Road, Rivertown',
 email: 'elina.voss@sampleinbox.cc',
 key: 2,
 },
 {
 name: 'Darin Poe',
 age: 37,
 address: '12 Blossom Close, Newcrest',
 email: 'darin.poe@mockpost.io',
 key: 3,
 },
 ])

 const [selected, setSelected] = useState<TableSemanticName>()

 return (
 <> 
 <div
 className="table-semantic__wrap"
 style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
 >
 <div style={{ flex: 1, minWidth: 0 }}>
 <Table
 columns={columns}
 data={data}
 // fixedToColumn={{ left: 'name', right: 'email' }}
 pagination={{ pageSize: 10, total: 100 }}
 classNames={{
 root: 'my-table__root',
 wrapper: 'my-table__wrapper',
 content: 'my-table__content',
 table: 'my-table__table',
 header: 'my-table__header',
 headerRow: 'my-table__header-row',
 headerCell: 'my-table__header-cell',
 body: 'my-table__body',
 bodyRow: 'my-table__body-row',
 bodyCell: 'my-table__body-cell',
 cell: 'my-table__cell',
 footer: 'my-table__footer',
 freezeShadowLeft: 'my-table__freeze-left',
 freezeShadowRight: 'my-table__freeze-right',
 }}
 styles={{
 content: { overflow: 'unset' },
 ...(selected ? { [selected]: { outline: '2px solid #ffbe0a' } } : {}),
 }}
 />
 </div>
 <div style={{ width: 280, flexShrink: 0 }}>
 <List
 split={false}
 data={[
 { title: 'root', description: '表格根容器' },
 { title: 'wrapper', description: '表格包装层' },
 { title: 'content', description: '表格内容滚动区' },
 { title: 'table', description: '原生 table 元素' },
 { title: 'headerRow', description: '表头行 (thead tr)' },
 { title: 'headerCell', description: '表头单元格 (th)' },
 { title: 'bodyRow', description: '表体行 (tbody tr)' },
 { title: 'bodyCell', description: '表体单元格 (td)' },
 { title: 'cell', description: '单元格通用（同时作用于 th/td）' },
 { title: 'footer', description: '页脚（如分页）' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TableSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item title={dataItem.title} description={dataItem.description} />
 </div>
 )}
 />
 </div>
 </div>
 </>
 )
}

```


## Props

### Table Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| loading | 加载中状态 | boolean | true \| false | - |
| standard | 标准模式，默认集成 \`showColMenu = true, sticky = true, bordered = true, setting = true, striped = true\` | boolean | true \| false | false |
| uniqueId | 唯一 id 前缀，废弃 | string | - | - |
| hiddenColKeys | 隐藏列（受控） (v3.9.0 新增)，需要 column 中必须传入唯一的 dataKey 用于列隐藏 | string\[] | - | - |
| onHiddenColKeysChange | 列隐藏设置时回调 (v3.9.0 新增) | ((hiddenColKeys: string\[]) => void) | - | - |
| sortedColKeys | 排序列（受控)，需要 column 中必须传入唯一的 dataKey 用于列隐藏 | string\[] | - | - |
| onSortedColKeysChange | 列排序设置时回调 | ((sortedColKeys: string\[]) => void) | - | - |
| checkDisabledColKeys | checkbox 被禁用的列 | string\[] | - | - |
| onSetColKeysChange | 列设置时回调 | ((sortedColKeys: string\[], hiddenColKeys: string\[]) => void) | - | - |
| pagination | 表格分页配置项 | (TablePaginationProps & { pageSize: number; }) | - | - |
| dataSource | 异步数据源，分页切换时加载数据 | ((current: number, pageSize?: number) => TableDataSource) \| undefined | (current: number, pageSize?: number \| undefined) => TableDataSource | - |
| onChange | 设置排序变化回调 | ((action: Action, extra: Extra) => void) | - | - |
| size | 配置表格尺寸 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| data | 表格数据 | object\[] | - | \[] |
| draggable | 表格行可拖拽 | boolean | true \| false | - |
| onDragStart | 开始拖拽时触发 | ((evt: DragEvent\<Element>, option: { dragNode: object; }) => void) | - | - |
| onDrop | 拖拽行放开时触发 | ((evt: DragEvent\<Element>, option: { dragNode: object; dropNode: object; dataStatus: { after: object; }; }) => boolean \| Promise\<any>) | (evt: DragEvent\<Element>, option: { dragNode: object; dropNode: object; dataStatus: { after: object; }; }) => boolean \| Promise\<any> | - |
| scrollbar | 配置滚动条，滚动条样式使用HiUI自带的滚动条风格 | boolean \| ScrollbarProps | false \| true \| ScrollbarProps | - |
| striped | 是否展示为斑马纹效果 | boolean | true \| false | - |
| onRow | 表格内容行事件处理函数，对于统计行（合计或均值），rowData 为 null | ((rowData: Record\<string, any> \| null, index: number) => TableOnRowReturn) | (rowData: Record\<string, any> \| null, index: number) => TableOnRowReturn | - |
| onHeaderRow | 行标题事件处理函数 | ((columns: TableColumnItem\<any>\[], index: number) => TableOnRowReturn) | - | - |
| emptyContent | 数据为空时的展示内容 | ReactNode | - | - |
| stickyFooter | 底部吸底 | boolean | true \| false | - |
| stickyFooterBottom | 底部吸底距离视口底部距离 | number | - | - |
| fixedColumnTrigger | 自定义冻结列触发展示行为 | "auto" \| "always" | "auto" \| "always" | - |
| onResizeStop | resizable 模式下，列宽变化后触发的回调 | ((evt: SyntheticEvent\<Element, Event>, size: { width: number; height: number; }, index: number, columnsWidth: number\[]) => void) | - | - |
| fixedToRow | 固定行，只有设置 maxHeight 时才生效 | { top?: number \| ((rowData: TableRowEventData, index: number) => boolean); bottom?: number \| ((rowData: TableRowEventData, index: number) => boolean) \| undefined; } \| undefined | { top?: number \| ((rowData: TableRowEventData, index: number) => boolean) \| undefined; bottom?: number \| ((rowData: TableRowEventData, index: number) => boolean) \| undefined; } | - |
| fieldKey | 指定 data 表格数据中某一属性为 key | string | - | "key" |
| columns | 表格列配置信息 | TableColumnItem\<any>\[] | - | - |
| bordered | 是否显示边框（表头分组模式下，表格自带边框） | boolean | true \| false | - |
| sticky | 是否支持表头吸顶 | boolean | true \| false | - |
| stickyTop | 表头吸顶距离视口顶部距离 | number | - | - |
| highlightedColKeys | 高亮列（受控） | string\[] | - | - |
| expandedRowKeys | 树形表格展开的行（受控） | ReactText\[] | - | - |
| defaultExpandedRowKeys | 树形表格默认展开的行 | ReactText\[] | - | - |
| onExpand | 树形表格展开时的回调函数 | ((expandIds: ReactText\[], targetRow: TableRowEventData, expanded: boolean) => void) | - | - |
| maxHeight | 表格最大高度，当穿过该高度时，展示滚动条且表头固定 | string \| number | string \| number | - |
| stretchHeight | 表格高度自动拉伸&#xA;Todo: 无法显示分页和Footer | boolean | true \| false | - |
| defaultFixedToColumn | 表格列冻结默认设置，为 string 时仅支持从左侧冻结至某一列 | TableFrozenColumnOptions | - | - |
| fixedToColumn | 表格列冻结设置，为 string 时仅支持从左侧冻结至某一列 | TableFrozenColumnOptions | - | - |
| onFixedToColumn | 表格列冻结设置时回调 | ((fixedToColumn: TableFrozenColumnOptions) => void) | - | - |
| errorRowKeys | 错误列（受控） | ReactText\[] | - | - |
| highlightedRowKeys | 高亮行（受控） | ReactText\[] | - | - |
| rowSelection | 行可选（受控） | TableRowSelection | - | - |
| showColMenu | 是否支持列操作 | boolean | true \| false | - |
| setting | 是否集成控制面板功能 | boolean \| { trigger?: ReactNode; } | false \| true \| { trigger?: ReactNode; } | - |
| resizable | 是否能够动态控制列宽 | boolean | true \| false | - |
| virtual | 是否支持虚拟滚动，&#xA;列宽：column设置的width或200作为宽度，内容区填充不满时，宽度等比分配。&#xA;滚动区域高度：使用maxHeight或300作为虚拟列表高度区域&#xA;TODO：&#xA;-可展开的内嵌面板&#xA;-支持拖拽排序&#xA;-支持列拖拽&#xA;-Row：onDoubleClick&#xA;-Cell: colspan，rowspan&#xA;-统计：平局行，总数行&#xA;-表头分组 | boolean \| { onVisibleChange?: ((visibleList: any\[], fullList: any\[], virtualInfo?: { start: number; end: number; scrollTop: number; heights: number\[]; }) => void) \| undefined; } \| undefined | false \| true \| { onVisibleChange?: ((visibleList: any\[], fullList: any\[], virtualInfo?: { start: number; end: number; scrollTop: number; heights: number\[]; } \| undefined) => void) \| undefined; } | - |
| scrollWidth | 表格滚动的宽度（当表格总设置宽度（含自适应列）大于表格父级容器宽度时需要设置）\*\*3.7.0 版本以后，该属性不建议使用\*\* | number | - | - |
| showColHighlight | 表格某一列\`hover\`时，该列高亮 | boolean | true \| false | - |
| showRowHighlight | 表格某一行 \`hover\` 时，该行高亮 | boolean | true \| false | - |
| highlightRowOnDoubleClick | 表格某一行被双击时，该行高亮 | boolean | true \| false | - |
| onDropEnd | 拖拽成功时触发 | ((option: { dragNode: object; dropNode: object; dataStatus: { after: object; }; }) => void) | - | - |
| defaultExpandAll | 初始时展开所有行 | boolean | true \| false | - |
| cellRender | 全局控制单元格自定义渲染，优先级低于 column 的 render 方法 | ((text: any) => ReactNode) | - | - |
| onLoadChildren | 点击异步加载子项 | ((item: TableRowEventData) => void \| Promise\<void \| any\[]>) | (item: TableRowEventData) => void \| Promise\<void \| any\[]> | - |
| footerRender | 自定义渲染页脚 | ((...nodes: ReactElement\<any, string \| JSXElementConstructor\<any>>\[]) => ReactNode) | (...nodes: ReactElement\<any, string \| JSXElementConstructor\<any>>\[]) => ReactNode | - |
| rowClassName | 设置行类名 | ((record: Record\<string, any>, index: number) => string) | - | - |
| cellClassName | 设置单元格类名 | ((record: Record\<string, any>, column: Record\<string, any>, index: number) => string) | - | - |
| onHighlightedCol | 设置列高亮回调 | ((changedColInfo: { active: boolean; column: TableColumnItem\<any>; }, highlightedColKeys: string\[]) => void) | - | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<TableHelper> | - | - |
| expandedEmbedRowKeys | 内嵌式表格展开的行（受控） | ReactText\[] | - | - |
| defaultExpandedEmbedRowKeys | 内嵌式表格默认展开的行 | ReactText\[] | - | - |
| onEmbedExpand | 内嵌式表格展开时的回调函数 | ((expandedIds: ReactText\[], targetRow: Record\<string, any>, shouldExpanded: boolean) => void) | - | - |
| expandedRender | 表格展开项 | ((row: Record\<string, any>, index: number) => ReactNode \| Promise\<void \| ReactNode>) | (row: Record\<string, any>, index: number) => ReactNode \| Promise\<void \| ReactNode> | - |
| rowExpandable | 设置是否允许行展开 | boolean \| ((row: TableColumnItem\<any>) => ReactNode) | false \| true \| (row: TableColumnItem\<any>) => ReactNode | - |
| classNames | | TableSemanticClassNames | - | - |
| styles | | TableSemanticStyles | - | - |


### SettingDrawer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------- | ------ |
| visible | 是否显示抽屉 | boolean | true \| false | - |
| columns | 表格列配置 | TableColumnItem\<any>\[] | - | - |
| onClose | 关闭回调 | (() => void) | - | - |
| checkDisabledColKeys | 禁止选择的列 | string\[] | - | - |
| dragDisabledColKeys | 禁止拖拽的列 | string\[] | - | - |
| onSetColKeysChange | 确认设置回调 | ((sortedColKeys: string\[], hiddenColKeys: string\[], visibleCols: TableColumnItem\<any>\[]) => void) | - | - |
| onReset | 重置按钮点击时回调 | (() => void) | - | - |
| hiddenColKeys | 隐藏列 | string\[] | - | - |
| onHiddenColKeysChange | 列隐藏回调 | ((hiddenColKeys: string\[]) => void) | - | - |
| sortedColKeys | 排序列 | string\[] | - | - |
| onSortedColKeysChange | 列排序回调 | ((sortedColKeys: string\[]) => void) | - | - |
| extraHeader | 自定义扩展头部内容 | ReactNode | - | - |
| itemRender | 自定义字段渲染 | ((item: TableColumnItem\<any>) => ReactNode) | - | - |
| drawerProps | Drawer 组件配置 | Omit\<DrawerProps, "className"> | - | - |
| showCheckAll | 显示全选 | boolean | true \| false | - |


> 在 onLoadChildren 方法中，返回的数据中会根据 `isLeaf` 字符控制左侧展开按钮的显示状态

### TableHelper
| 名称 | 说明 | 类型 |
| ------------------ | ------------------------------------------- | -------------------------------------------- |
| scrollTo | 设置表格内容滚动位置，虚拟表格和普通表格参数有所不同：虚拟表格场景使用 number 或 TableVirtualScrollConfig，普通表格场景：使用 ScrollToOptions 对象 | {<br />(arg: number &#124; TableVirtualScrollConfig): void<br />(options: { top?: number; left?: number; behavior?: 'auto' &#124; 'smooth' }): void<br />} |


#### TableVirtualScrollAlign

`'top' | 'bottom' | 'auto'`

表格虚拟滚动对齐方式，可选值包括 `top`、`bottom` 和 `auto`。

---

#### TableVirtualScrollConfig

用于配置虚拟滚动的参数：

- `{ index: number, align?: TableVirtualScrollAlign, offset?: number }`
 通过指定索引控制滚动到具体内容，`align` 指定对齐方式（可选），`offset` 额外偏移量（可选）。

- `{ key: React.Key, align?: TableVirtualScrollAlign, offset?: number }`
 通过指定数据项的唯一 `key` 控制滚动，`align` 指定对齐方式（可选），`offset` 额外偏移量（可选）。


### TableColumnItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------ |
| title | 列标题 | string \| () => ReactNode | - | - |
| dataKey | 列对应数据项的唯一标识 | string | - | - |
| width | 该列宽度 | number | - | - |
| fixed | 固定宽度 | boolean | true \| false | - |
| align | 列对齐方式 | string | 'left' \| 'right' \|'center' | 'left' |
| render | 控制单元格自定义渲染 | (text: TableDataItem[TableColumnItem[dataKey]], row: TableDataItem, index: number, dataKey: string) => ReactNode | - | - |
| sorter | 列排序函数 | (a: any, b: any) => number | - | null |
| filterIcon | 自定义 filter 图标 | ReactNode | - | null |
| filterDropdown | 自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | (props: { columnData: TableColumnItem, setFilterDropdownVisible: Function}) => ReactNode | - | null |
| filterDropdownVisible | 受控控制 dropdown 显隐 | boolean | true \| false | - |
| filterDropdownWidth | 自定义筛选菜单宽度 | number | - | 150 |
| filterDropdownOverlay | 自定义筛选菜单弹窗交互 | PopperOverlayProps | - | - |
| filterDropdownClassName | 自定义筛选菜单 className | string | - | - |
| onFilterDropdownVisibleChange | 自定义筛选下拉选项显示状态改变时的回调方法 | (filterDropdownVisible: boolean, column: TableColumnItem) => void | - | false |
| avg | 该列是否支持平均值 | boolean | true \| false | false |
| total | 该列是否支持合计 | boolean | true \| false | false |
| children | 多级表头 | ColumnItem[] | - | - |

### TableFrozenColumnOptions

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----- | -------------------- | ------ | ------------------------ | ------ |
| left | 表格从左侧冻结至某列 | string | columns 中对应的 dataKey | - |
| right | 表格从右侧冻结至某列 | string | columns 中对应的 dataKey | - |

### TableRowSelection

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ---------------------- | -------------------------------------------------------------------------------------------- | ---------------- | ------ |
| selectedRowKeys | 选中的行（受控） | ReactText[] | row 中对应的 key | - |
| onChange | 选中项发生变化时的回调 | (selectedRowKeys: string[], targetRow?: object \| object[], shouldChecked?: boolean) => void | - | - |
| checkboxColWidth | 设置选中列列宽 | number | - | - |
| getCheckboxConfig | 行选择的配置项 | rowData => object | - | - |
| checkAllOptions | 全选项配置集合 | TableCheckAllOptions | - | - |

### TableCheckAllOptions

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ------------------------- | -------------------------------------- | ------ | ------ |
| filterIcon | 添加全选按钮右侧过滤 icon | ReactNode | - | - |
| render | 自定义渲染全选内容 | (checkboxNode: ReactNode) => ReactNode | - | - |

### TableOnRowReturn

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | -------------- | --------------------------- | ------ | ------ |
| onClick | 行点击事件 | (event: MouseEvent) => void | - | - |
| onDoubleClick | 行双击事件 | (event: MouseEvent) => void | - | - |
| onContextMenu | 行右键菜单事件 | (event: MouseEvent) => void | - | - |
| onMouseEnter | 行鼠标入场事件 | (event: MouseEvent) => void | - | - |
| onMouseLeave | 行鼠标出场事件 | (event: MouseEvent) => void | - | - |

### TableDataSource

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

### PaginationProps

> 继承 Pagination 组件的 Props.
