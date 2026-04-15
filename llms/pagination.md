# Pagination 分页

用来分隔一个长列表，每次只加载一个页面，从而可释放后端服务器加载压力。

## 使用示例

### 基础用法

常见的分页用法，用于数据量或分页数适中的场景，进行基础翻页操作


```tsx
import React, { useState } from 'react'
import Pagination from '@hi-ui/pagination' 
export const Basic = () => {
 const [current, updateCurrent] = useState(1)
 return (
 <> 
 <div className="pagination-basic__wrap">
 <Pagination
 total={200}
 pageSize={10}
 current={current}
 onChange={(cur, prev, pageSize) => {
 updateCurrent(cur)
 console.log('onChange', cur, prev, pageSize)
 }}
 />
 </div>
 </>
 )
}

```


### 每页最大条数

数据量庞大，分页数较多时使用


```tsx
import React, { useState } from 'react'
import Pagination from '@hi-ui/pagination' 
export const PageSizeOptions = () => {
 const [current, updateCurrent] = useState(1)
 const [pageSize, updatePageSize] = useState(10)

 return (
 <> 
 <div className="pagination-basic__wrap">
 <Pagination
 total={200}
 pageSize={pageSize}
 showTotal
 showJumper
 pageSizeOptions={[10, 20, 50, 100]}
 onPageSizeChange={(pageSize, current) => {
 console.log('onPageSizeChange', pageSize, current)
 updatePageSize(pageSize)
 }}
 current={current}
 onChange={(cur, prev, pageSize) => {
 console.log('onChange', cur, prev, pageSize)
 updateCurrent(cur)
 }}
 />
 </div>
 </>
 )
}

```


### 简洁用法

数据分批展示的形式，弱化页码


```tsx
import React, { useState } from 'react'
import { Pagination } from '@hi-ui/pagination' 
export const Simple = () => {
 const [current, setCurrent] = useState(1)
 return (
 <> 
 <div className="pagination-simple__wrap">
 <Pagination
 type="shrink"
 total={200}
 pageSize={10}
 showJumper={false}
 current={current}
 onChange={(cur) => {
 console.log('onChange', cur)
 setCurrent(cur)
 }}
 />
 </div>
 </>
 )
}

```


### 文本框用法

节省页码的占用空间


```tsx
import React, { useState } from 'react'
import { Pagination } from '@hi-ui/pagination' 
export const MiniInput = () => {
 const [current, setCurrent] = useState(1)
 return (
 <> 
 <div className="pagination-mini-input__wrap">
 <Pagination
 type="shrink"
 total={200}
 pageSize={10}
 current={current}
 onChange={(cur) => {
 console.log('onChange', cur)
 setCurrent(cur)
 }}
 />
 </div>
 </>
 )
}

```


### 自定义组合

灵活搭配，适配不同的场景


```tsx
import React from 'react'
import Pagination from '@hi-ui/pagination'
import Form from '@hi-ui/form'
import Switch from '@hi-ui/switch'
import Select from '@hi-ui/select'
import NumberInput from '@hi-ui/number-input' 
export const Custom = () => {
 const [paginationProps, setPaginationProps] = React.useState<any>({
 total: 200,
 showTotal: true,
 showJumper: true,
 showPagers: true,
 pageSize: 10,
 pageSizeOptions: [10, 20, 50, 100],
 current: 1,
 })

 return (
 <> 
 <div className="pagination-basic__wrap">
 <div>
 <Form
 initialValues={paginationProps}
 onValuesChange={(_, allValues) => {
 setPaginationProps(allValues)
 }}
 style={{ display: 'flex', columnGap: 36, flexWrap: 'wrap' }}
 >
 <Form.Item label="ShowTotal" field="showTotal" valuePropName="checked">
 <Switch />
 </Form.Item>
 <Form.Item label="ShowJumper" field="showJumper" valuePropName="checked">
 <Switch />
 </Form.Item>
 <Form.Item label="ShowPagers" field="showPagers" valuePropName="checked">
 <Switch />
 </Form.Item>
 <Form.Item label="PageSize" field="pageSize">
 <Select
 clearable={false}
 data={[
 { id: 10, title: '10' },
 { id: 20, title: '20' },
 { id: 50, title: '50' },
 { id: 100, title: '100' },
 ]}
 />
 </Form.Item>
 <Form.Item label="Total" field="total">
 <NumberInput />
 </Form.Item>
 </Form>
 </div>
 <Pagination
 {...paginationProps}
 onChange={(cur) => {
 setPaginationProps({
 ...paginationProps,
 current: cur,
 })
 }}
 onPageSizeChange={(pageSize) => {
 setPaginationProps({
 ...paginationProps,
 pageSize,
 })
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
import { Space } from '@hi-ui/space'
import Pagination from '@hi-ui/pagination' 
export const Size = () => {
 return (
 <> 
 <div className="button-basic__wrap">
 <h2>xs</h2>
 <Space direction="column" size="md" align="flex-start">
 <Pagination
 total={200}
 pageSize={10}
 showTotal
 showJumper
 showPagers
 size="xs"
 pageSizeOptions={[10, 20, 50, 100]}
 onChange={(cur, prev, pageSize) => {
 console.log('onChange', cur, prev, pageSize)
 }}
 />
 <Pagination
 type="shrink"
 total={200}
 pageSize={10}
 size={'xs'}
 onChange={(cur) => {
 console.log('onChange', cur)
 }}
 />
 </Space>
 <h2>sm</h2>
 <Space direction="column" size="md" align="flex-start">
 <Pagination
 total={200}
 pageSize={10}
 showTotal
 showJumper
 showPagers
 size="sm"
 pageSizeOptions={[10, 20, 50, 100]}
 onChange={(cur, prev, pageSize) => {
 console.log('onChange', cur, prev, pageSize)
 }}
 />
 <Pagination
 type="shrink"
 total={200}
 pageSize={10}
 size="sm"
 onChange={(cur) => {
 console.log('onChange', cur)
 }}
 />
 </Space>
 <h2>md</h2>
 <Space direction="column" size="md" align="flex-start">
 <Pagination
 total={200}
 pageSize={10}
 showTotal
 showJumper
 showPagers
 size="md"
 pageSizeOptions={[10, 20, 50, 100]}
 onChange={(cur, prev, pageSize) => {
 console.log('onChange', cur, prev, pageSize)
 }}
 />
 <Pagination
 type="shrink"
 total={200}
 pageSize={10}
 size="md"
 onChange={(cur) => {
 console.log('onChange', cur)
 }}
 />
 </Space>
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
import { Pagination, PaginationSemanticName } from '@hi-ui/pagination' 
export const Semantic = () => {
 const [selected, setSelected] = useState<PaginationSemanticName>()

 return (
 <> 
 <div className="pagination-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Pagination
 total={100}
 pageSize={10}
 showTotal
 showJumper
 pageSizeOptions={[10, 20, 50]}
 classNames={{
 root: 'my-pagination__root',
 total: 'my-pagination__total',
 list: 'my-pagination__list',
 prevButton: 'my-pagination__prev-button',
 nextButton: 'my-pagination__next-button',
 pager: 'my-pagination__pager',
 pageOption: 'my-pagination__page-option',
 jumper: 'my-pagination__jumper',
 }}
 styles={{
 ...(selected && {
 [selected]: {
 outline: '1px solid #ffbe0a',
 },
 }),
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'total', description: '总数区域' },
 { title: 'list', description: '页码列表容器' },
 { title: 'prevButton', description: '上一页按钮' },
 { title: 'nextButton', description: '下一页按钮' },
 { title: 'pager', description: '页码项' },
 { title: 'pageOption', description: '每页条数选择' },
 { title: 'jumper', description: '跳转输入' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as PaginationSemanticName)
 }}
 onMouseLeave={() => {
 setSelected(undefined)
 }}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### Pagination Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------------- | -------------------------- | ----------------------------------------------------------- | --------------------- | --------- |
| current | 当前页码 | number | - | - |
| defaultCurrent | 默认当前页码 | number | - | - |
| max | 最大显示的页数 | number | - | - |
| pageSize *(required)* | 每页条数 | number | - | - |
| total *(required)* | 数组总数 | number | - | - |
| showTotal | 是否展示数组总数 | boolean | true \| false | - |
| type | 分页器类型 | "default" \| "shrink" | "default" \| "shrink" | "default" |
| autoHide | 只有一页时是否隐藏分页器 | boolean | true \| false | - |
| showJumper | 是否显示跳转 | boolean | true \| false | - |
| showPagers | 是否显示页码 | boolean | true \| false | - |
| pageSizeOptions | 指定每页可以显示多少条 | number\[] | - | - |
| pageSizeOptionsOverlay | 下拉框选择项浮层配置 | PopperOverlayProps | - | - |
| onJump | 快速跳转时触发 | ((current: number) => void) | - | - |
| onChange | 页码改变时的回调 | ((current: number, prev: number, pageSize: number) => void) | - | - |
| onPageSizeChange | 每页显示条数改变的回调函数 | ((pageSize: number, current: number) => void) | - | - |
| size | 设置尺寸 | "xs" \| "sm" \| "md" | "xs" \| "sm" \| "md" | - |
| renderTotal | 自定义显示总数样式 | ((total: number) => ReactNode) | - | - |
| classNames | | PaginationSemanticClassNames | - | - |
| styles | | PaginationSemanticStyles | - | - |


### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | true |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |
