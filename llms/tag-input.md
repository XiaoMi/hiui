# TagInput 标签输入框

输入框的一种标签展示形式。

## 使用示例

###


```tsx
import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import TagInput from '@hi-ui/tag-input'

export const Basic = () => {
 return (
 <> 
 <div className="tag-input-basic__wrap">
 <TagInput
 clearable
 // wrap={false}
 defaultValue={['1', '2', '不存在的测试']}
 suffix={<DownOutlined />}
 data={[
 {
 id: '1',
 title: '1',
 },
 {
 id: '2',
 title: '2',
 },
 {
 id: '3',
 title: '3',
 },
 {
 id: '4',
 title: '4',
 },
 ]}
 />
 </div>
 </>
 )
}

```


###


```tsx
import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { TagInputMock } from '@hi-ui/tag-input'

export const Mock = () => {
 const [value] = React.useState(['1', '2', '不存在的测试', '11', '12', '13', '14'])
 const [data] = React.useState([
 {
 id: '1',
 title: 'title1',
 },
 {
 id: '2',
 title: '二锅头',
 },
 {
 id: '3',
 title: '梦幻3',
 },
 {
 id: '4',
 title: '老四',
 },
 {
 id: '11',
 title: '1title1',
 },
 {
 id: '12',
 title: '1二锅头',
 },
 {
 id: '13',
 title: '1梦幻3',
 },
 {
 id: '14',
 title: '1老四',
 },
 ])

 return (
 <> 
 <div className="tag-input-basic__wrap">
 <TagInputMock
 clearable
 suffix={<DownOutlined />}
 // style={{ width: 380 }}
 // wrap={false}
 // disabled
 value={value}
 data={data}
 />

 <div>
 <h2>Outline</h2>
 <TagInputMock
 appearance="line"
 placeholder="请输入"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="xs"
 appearance="line"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <TagInputMock
 size="xs"
 appearance="line"
 clearable
 wrap
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="sm"
 focused
 appearance="line"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 // wrap
 suffix={<DownOutlined />}
 />
 <TagInputMock
 size="sm"
 focused
 appearance="line"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 wrap
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="md"
 appearance="line"
 focused
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <TagInputMock
 size="md"
 appearance="line"
 focused
 placeholder="请输入"
 value={value}
 wrap
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="line"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <TagInputMock
 size="lg"
 appearance="line"
 placeholder="请输入"
 value={value}
 wrap
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 invalid
 focused
 appearance="line"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="line"
 disabled
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 </div>

 <div>
 <h2>Filled</h2>
 <TagInputMock
 appearance="filled"
 placeholder="请输入"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="xs"
 appearance="filled"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="sm"
 focused
 appearance="filled"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="md"
 appearance="filled"
 focused
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="filled"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 invalid
 focused
 appearance="filled"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="filled"
 disabled
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 </div>

 <div>
 <h2>Unset</h2>
 <TagInputMock
 appearance="unset"
 placeholder="请输入"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="xs"
 appearance="unset"
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="sm"
 appearance="unset"
 focused
 clearable
 placeholder="请输入"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="md"
 appearance="unset"
 focused
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="unset"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 invalid
 focused
 appearance="unset"
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="unset"
 disabled
 placeholder="请输入"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 </div>

 <div>
 <h2>Contained</h2>
 <TagInputMock
 appearance="contained"
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="xs"
 appearance="contained"
 clearable
 label="服务类型"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="sm"
 appearance="contained"
 focused
 clearable
 label="服务类型"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="md"
 appearance="contained"
 focused
 label="服务类型"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="contained"
 label="服务类型"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="contained"
 disabled
 label="服务类型"
 value={value}
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 </div>

 <div>
 <h2>Contained</h2>
 <TagInputMock
 appearance="contained"
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="xs"
 appearance="contained"
 clearable
 label="服务类型"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="sm"
 appearance="contained"
 focused
 clearable
 label="服务类型"
 value={value}
 data={data}
 suffix={<DownOutlined />}
 />
 <br />
 <br />
 <TagInputMock
 size="md"
 appearance="contained"
 focused
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="contained"
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 invalid
 focused
 appearance="contained"
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 <TagInputMock
 size="lg"
 appearance="contained"
 disabled
 label="服务类型"
 suffix={<DownOutlined />}
 ></TagInputMock>
 <br />
 <br />
 </div>
 </div>
 </>
 )
}

```


###


```tsx
import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { TagInputMock } from '@hi-ui/tag-input'

export const Wrap = () => {
 return (
 <> 
 <div className="tag-input-wrap__wrap">
 <TagInputMock
 wrap
 clearable
 // style={{ width: 380 }}
 // wrap={false}
 // disabled
 defaultValue={['1', '2', '不存在的测试', '11', '12', '13', '14']}
 suffix={<DownOutlined />}
 data={[
 {
 id: '1',
 title: 'title1',
 },
 {
 id: '2',
 title: '二锅头',
 },
 {
 id: '3',
 title: '梦幻3',
 },
 {
 id: '4',
 title: '老四',
 },
 {
 id: '11',
 title: '1title1',
 },
 {
 id: '12',
 title: '1二锅头',
 },
 {
 id: '13',
 title: '1梦幻3',
 },
 {
 id: '14',
 title: '1老四',
 },
 ]}
 />
 </div>
 </>
 )
}

```


## Props

### TagInput Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ------------------------------------- | ---------------------------------------------- | ------------- | ------ |
| value | 设置当前多选值 | ReactText\[] | - | - |
| defaultValue | 设置当前多选值默认值 | ReactText\[] | - | \[] |
| onChange | 多选值改变时的回调 | ((values: ReactText\[]) => void) | - | - |
| clearable | 是否可清空	boolean	true \| false	true | boolean | true \| false | true |
| disabled | 是否禁止使用	boolean	true \| false	false | boolean | true \| false | false |
| displayRender | 自定义选择后触发器所展示的内容 | ((checkedOption: TagInputOption) => ReactNode) | - | - |
| placeholder | 输入框占位符 | string | - | - |
| wrap | 是否开启换行全展示 | boolean | true \| false | true |
| suffix | 输入框后置内容 | ReactNode | - | - |
| data | tag 列表数据源 | TagInputOption\[] | - | \[] |
| onClear | 点击清空 tags 回调 | (() => void) | - | - |


### TagInputMock Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| value | 设置当前多选值 | ReactText\[] | - | - |
| defaultValue | 设置当前多选值默认值 | ReactText\[] | - | \[] |
| onChange | 多选值改变时的回调 | ((values: ReactText\[], targetItem: TagInputOption\[], shouldChecked: boolean) => void) | - | - |
| clearable | 是否可清空	boolean	true \| false	true | boolean | true \| false | true |
| disabled | 是否禁止使用	boolean	true \| false	false | boolean | true \| false | false |
| displayRender | 自定义选择后触发器所展示的内容 | ((checkedOption: TagInputOption) => ReactNode) | - | - |
| placeholder | 输入框占位符 | string | - | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| suffix | 选择框后置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| data | tag 列表数据源 | TagInputOption\[] | - | \[] |
| onClear | 点击清空 tags 回调 | (() => void) | - | - |
| tagWidth | 设置 tag 的默认宽度 | number | - | 20 |
| focused | 是否聚焦 | boolean | true \| false | false |
| readOnly | 开启输入框只读 | boolean | true \| false | false |
| appearance | 设置展现形式 | HiBaseAppearanceEnum \| "contained" | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | "line" |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| size | 设置输入框尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | "md" |
| wrap | 是否开启换行全展示 | boolean | true \| false | false |
| expandable | 开启展开 | boolean | true \| false | false |
| activeExpandable | 展开激活 | boolean | true \| false | false |
| onExpand | 展开时回调 | ((evt: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| showIndicator | 是否展示箭头 | boolean | true \| false | true |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | false |

