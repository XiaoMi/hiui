# Dropdown 下拉菜单

用来将菜单收起在下拉面板中，使用中唤起面板，有效节省空间

## 使用示例

### 基础用法

将一组同类的动作收起成为菜单，由一个操作入口展示使用


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown' 
export const Basic = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 ])

 return (
 <> 
 <div className="dropdown-basic__wrap">
 <Dropdown data={list} title="鼠标悬停" onClick={console.log} />
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown' 
export const Disabled = () => {
 const [list] = React.useState([
 {
 id: '1',
 title: '菜单一',
 },
 {
 id: '2',
 title: '菜单二',
 },
 {
 id: '3',
 title: '菜单三',
 },
 {
 id: '4',
 title: '链接一',
 href: 'https://www.mi.com',
 },
 ])

 return (
 <> 
 <div className="dropdown-disabled__wrap">
 <Dropdown disabled data={list} title="鼠标悬停" onClick={console.log} />
 </div>
 </>
 )
}

```


### 分组

通过分隔线将选项进行分组划分


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown' 
export const Group = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 {
 id: 'divider',
 split: true,
 },
 {
 id: 6,
 title: '小米商城',
 href: 'https://www.mi.com',
 disabled: true,
 },
 ])

 return (
 <> 
 <div className="dropdown-group__wrap">
 <Dropdown data={list} title="鼠标悬停" onClick={console.log} />
 </div>
 </>
 )
}

```


### 触发方式

不同触发方式呼出菜单


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown' 
export const Trigger = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 {
 id: 5,
 title: '菜单六',
 },
 ])

 return (
 <> 
 <div className="dropdown-trigger__wrap">
 <Dropdown overlayClassName="xxx" data={list} trigger="click" title="左键单击" />
 <br />
 <br />
 <Dropdown overlayClassName="xxx" data={list} trigger="hover" title="鼠标悬停" />
 <br />
 <br />
 <Dropdown overlayClassName="xxx" data={list} trigger="contextmenu" title="右键单击" />
 </div>
 </>
 )
}

```


### 多级菜单

菜单项不属于同一级别，可分层级展开使用


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown' 
export const MultiMenu = () => {
 const [list] = React.useState([
 {
 id: '移动至',
 title: '移动至',
 children: [
 {
 id: '2019',
 title: '2019',
 children: [
 {
 id: 'Q1',
 title: 'Q1',
 children: [
 {
 id: '01',
 title: '01',
 },
 {
 id: '02',
 title: '02',
 },
 {
 id: '03',
 title: '03',
 },
 ],
 },
 {
 id: 'Q2',
 title: 'Q2',
 disabled: true,
 },
 {
 id: 'Q3',
 title: 'Q3',
 },
 ],
 },
 {
 id: '2020',
 title: '2020',
 children: [
 {
 id: 'Q1',
 title: 'Q1',
 children: [
 {
 id: '01',
 title: '01',
 },
 {
 id: '02',
 title: '02',
 },
 {
 id: '03',
 title: '03',
 },
 ],
 },
 {
 id: 'Q2',
 title: 'Q2',
 disabled: true,
 },
 {
 id: 'Q3',
 title: 'Q3',
 },
 ],
 },
 ],
 },
 {
 id: '复制至',
 title: '复制至',
 children: [
 {
 id: '2019',
 title: '2019',
 children: [
 {
 id: 'Q1',
 title: 'Q1',
 disabled: true,
 children: [
 {
 id: '01',
 title: '01',
 },
 {
 id: '02',
 title: '02',
 children: [
 {
 id: '02-01',
 title: '02-01',
 },
 {
 id: '02-02',
 title: '02-02',
 },
 ],
 },
 {
 id: '03',
 title: '03',
 children: [
 {
 id: '03-01',
 title: '03-01',
 },
 {
 id: '03-02',
 title: '03-02',
 },
 ],
 },
 ],
 },
 {
 id: 'Q2',
 title: 'Q2',
 },
 {
 id: 'Q3',
 title: 'Q3',
 },
 ],
 },
 {
 id: '2020',
 title: '2020',
 children: [
 {
 id: 'Q1',
 title: 'Q1',
 disabled: true,
 children: [
 {
 id: '01',
 title: '01',
 },
 {
 id: '02',
 title: '02',
 children: [
 {
 id: '02-01',
 title: '02-01',
 },
 {
 id: '02-02',
 title: '02-02',
 },
 ],
 },
 {
 id: '03',
 title: '03',
 children: [
 {
 id: '03-01',
 title: '03-01',
 },
 {
 id: '03-02',
 title: '03-02',
 },
 ],
 },
 ],
 },
 {
 id: 'Q2',
 title: 'Q2',
 },
 {
 id: 'Q3',
 title: 'Q3',
 },
 ],
 },
 ],
 },
 {
 id: '删除',
 title: '删除',
 },
 ])

 return (
 <> 
 <div className="dropdown-multi-menu__wrap">
 <Dropdown data={list} title="操作" width={120} trigger="click" />
 </div>
 </>
 )
}

```


### 弹出方位

下拉菜单可打开不同的方向，以应对页面边缘的遮盖问题


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown'
import Button from '@hi-ui/button' 
export const Placement = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 ])

 return (
 <> 
 <div className="dropdown-placement__wrap">
 <table className="placement-table" cellSpacing="5">
 <tbody>
 <tr>
 <td></td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'top-start' }}
 >
 <Button>top-start</Button>
 </Dropdown>
 </td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'top' }}
 >
 <Button>top</Button>
 </Dropdown>
 </td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'top-end' }}
 >
 <Button>top-end</Button>
 </Dropdown>
 </td>
 <td></td>
 </tr>
 <tr>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'left-start' }}
 >
 <Button>left-start</Button>
 </Dropdown>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'right-start' }}
 >
 <Button>right-start</Button>
 </Dropdown>
 </td>
 </tr>
 <tr>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'left' }}
 >
 <Button>left</Button>
 </Dropdown>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'right' }}
 >
 <Button>right</Button>
 </Dropdown>
 </td>
 </tr>
 <tr>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'left-end' }}
 >
 <Button>left-end</Button>
 </Dropdown>
 </td>
 <td></td>
 <td></td>
 <td></td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'right-end' }}
 >
 <Button>right-end</Button>
 </Dropdown>
 </td>
 </tr>
 <tr>
 <td></td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'bottom-start' }}
 >
 <Button>bottom-start</Button>
 </Dropdown>
 </td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'bottom' }}
 >
 <Button>bottom</Button>
 </Dropdown>
 </td>
 <td>
 <Dropdown
 data={list}
 title="鼠标悬停"
 trigger="hover"
 overlay={{ placement: 'bottom-end' }}
 >
 <Button>bottom-end</Button>
 </Dropdown>
 </td>
 <td></td>
 </tr>
 </tbody>
 </table>
 </div>
 </>
 )
}

```


### 按钮用法

操作入口以 Button 样式展示，强调重要操作


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown'
import message from '@hi-ui/message' 
export const Type = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 {
 id: 5,
 title: '菜单六',
 },
 ])

 return (
 <> 
 <div className="dropdown-type__wrap">
 <Dropdown type="text" data={list} title="鼠标悬停" onClick={console.log} />
 <br />
 <br />
 <Dropdown type="button" data={list} title="鼠标悬停" onClick={console.log} />
 <br />
 <br />
 <Dropdown
 type="group"
 data={list}
 title="鼠标悬停"
 onClick={console.log}
 onButtonClick={() => {
 message.open({ title: '点击左侧按钮' })
 }}
 />
 </div>
 </>
 )
}

```


### 自定义触发按钮


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown'
import { Tooltip } from '@hi-ui/tooltip'
import { Avatar } from '@hi-ui/avatar' 
export const TriggerButton = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 {
 id: 5,
 title: '菜单六',
 },
 {
 id: 6,
 title: '菜单七',
 },
 ])

 return (
 <> 
 <div className="dropdown-trigger-button__wrap">
 <Dropdown data={list} title="鼠标悬停" onClick={console.log}>
 <div style={{ display: 'inline-block' }}>
 <Tooltip title="Dropdown 触发的事件传给 tooltip 不会影响 Avatar 哦">
 <Avatar initials="M" />
 </Tooltip>
 </div>
 </Dropdown>
 </div>
 </>
 )
}

```


### 带Icon


```tsx
import React from 'react'
import Dropdown from '@hi-ui/dropdown'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@hi-ui/icons' 
export const Icon = () => {
 const [list] = React.useState([
 {
 id: 0,
 title: (
 <span style={{ display: 'flex', alignItems: 'center' }}>
 <PlusOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
 <span style={{ marginLeft: 8 }}>添加</span>
 </span>
 ),
 },
 {
 id: 1,
 title: (
 <span style={{ display: 'flex', alignItems: 'center' }}>
 <EditOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
 <span style={{ marginLeft: 8 }}>编辑</span>
 </span>
 ),
 },
 {
 id: 2,
 title: (
 <span style={{ display: 'flex', alignItems: 'center' }}>
 <DeleteOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
 <span style={{ marginLeft: 8 }}>删除</span>
 </span>
 ),
 },
 ])

 return (
 <> 
 <div className="dropdown-icon__wrap">
 <Dropdown data={list} width={120} title="鼠标悬停" onClick={console.log} />
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
import Dropdown, { DropdownSemanticName } from '@hi-ui/dropdown' 
export const Semantic = () => {
 const [selected, setSelected] = useState<DropdownSemanticName>()
 const [list] = React.useState([
 {
 id: 0,
 title: '小米商城',
 href: 'https://www.mi.com',
 },
 {
 id: 1,
 title: '菜单二',
 },
 {
 id: 2,
 title: '菜单三',
 },
 {
 id: 3,
 title: '菜单四',
 },
 {
 id: 4,
 title: '菜单五',
 },
 ])

 return (
 <> 
 <div className="dropdown-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Dropdown
 data={list}
 title="鼠标点击"
 trigger="click"
 onClick={console.log}
 classNames={{
 root: 'my-dropdown__root',
 trigger: 'my-dropdown__trigger',
 menu: 'my-dropdown__menu',
 menuItem: 'my-dropdown__menuItem',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 // @ts-ignore
 overlay={{ flip: false }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 {
 title: 'root',
 description: '根元素',
 },
 {
 title: 'trigger',
 description: '触发按钮',
 },
 {
 title: 'menu',
 description: '下拉菜单',
 },
 {
 title: 'menuItem',
 description: '菜单项',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as DropdownSemanticName)
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

### Dropdown Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| title | 下拉菜单显示标题的内容 | ReactNode | - | - |
| data | 下拉菜单数据项 | DropdownDataItem\[] | - | \[] |
| fieldNames | 设置data 中id, title, href, target, disabled, split 等属性对应的 key | HiBaseFieldNames | - | - |
| width | 设置下拉面板宽度 | number | - | - |
| type | 下拉菜单按钮类型 | "button" \| "text" \| "group" | "button" \| "text" \| "group" | "text" |
| onButtonClick | 点击左侧按钮的回调，仅在 type 为 group 时有效 | ((event: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| onClick | 点击后的回调 | ((id: ReactText, item: DropdownDataItem) => void) | - | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| children | 自定义下拉菜单触发按钮&#xA;注意：自定义按钮需要支持 ref 获取元素 dom 引用 以及 trigger 对应的事件：&#xA;&#xA;hover: onMouseEnter \ onMouseLeave&#xA;click: onClick&#xA;contextmenu: onContextMenu | ReactNode | - | - |
| overlay | 自定义控制 下拉 popper 行为 | PopperOverlayProps | - | - |
| size | 设置大小 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | "lg" |
| trigger | 下拉菜单触发方式 | DropdownTriggerActionEnum \| DropdownTriggerActionEnum\[] | "click" \| "contextmenu" \| "hover" \| DropdownTriggerActionEnum\[] | - |
| disabled | 是否禁用下拉菜单 | boolean | true \| false | - |
| classNames | | DropdownSemanticClassNames | - | - |
| styles | | DropdownSemanticStyles | - | - |


## Type

### DropdownDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | --------------------------------------------- | --------- | ----------------------------------------------- | ------ |
| title | 标题的内容 | ReactNode | - | - |
| id | 唯一标识 id | ReactText | - | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| href | 点击跳转的路径 | string | - | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | string | ︎'\_self' \| '\_blank' \| '\_parent' \| '\_top' | - |
| split | 是否在其底部建立分隔线 | boolean | ︎true \| false | false |

### PopperOverlayProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| className | 弹层类名 | string | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | false |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" \| "auto" \| "auto-start" \| "auto-end" | "bottom-start" |
| container | 指定 portal 的容器 | HTMLElement | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | false |
| arrow | 是否展示箭头 | boolean | true \| false | false |
