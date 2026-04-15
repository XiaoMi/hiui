# QueryFilter 筛选表单



## 使用示例

### 基础用法


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import QueryFilter, { FilterFieldProps } from '@hi-ui/query-filter' 
export const Basic = () => {
 const [filterFields] = React.useState<FilterFieldProps[]>([
 {
 field: 'store',
 label: '门店',
 visible: true,
 component: (
 <Select
 optionWidth={200}
 clearable
 data={[
 {
 id: 'wuhan',
 title: '武汉分店',
 },
 {
 id: 'beijing',
 title: '北京分店',
 },
 ]}
 />
 ),
 },
 {
 field: 'category',
 label: '分类',
 visible: true,
 component: (
 <CheckSelect
 optionWidth={200}
 clearable
 data={[
 {
 id: 'phone',
 title: '手机',
 },
 {
 id: 'computer',
 title: '电脑',
 },
 ]}
 />
 ),
 },
 ])

 const [formData, setFormData] = React.useState<Record<string, unknown>>({
 store: '',
 category: [],
 })

 const handleChange = (formData: Record<string, unknown>) => {
 console.log('formData', formData)

 setFormData(formData)
 }

 return (
 <> 
 <div className="query-filter-basic__wrap">
 <QueryFilter filterFields={filterFields} formData={formData} onChange={handleChange} />
 </div>
 </>
 )
}

```


### 带搜索框


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import QueryFilter, { FilterFieldProps, SearchInput } from '@hi-ui/query-filter' 
export const WithSearch = () => {
 const [filterFields] = React.useState<FilterFieldProps[]>([
 {
 field: 'store',
 label: '门店',
 visible: true,
 component: (
 <Select
 optionWidth={200}
 clearable
 data={[
 {
 id: 'wuhan',
 title: '武汉分店',
 },
 {
 id: 'beijing',
 title: '北京分店',
 },
 ]}
 />
 ),
 },
 {
 field: 'category',
 label: '分类',
 visible: true,
 component: (
 <CheckSelect
 optionWidth={200}
 clearable
 data={[
 {
 id: 'phone',
 title: '手机',
 },
 {
 id: 'computer',
 title: '电脑',
 },
 ]}
 />
 ),
 },
 ])

 const [formData, setFormData] = React.useState<Record<string, unknown>>({
 store: '',
 category: [],
 })

 const handleChange = (formData: Record<string, unknown>) => {
 setFormData(formData)
 }

 return (
 <> 
 <div className="query-filter-with-search__wrap">
 <QueryFilter
 prepend={<SearchInput />}
 filterFields={filterFields}
 formData={formData}
 onChange={handleChange}
 />
 </div>
 </>
 )
}

```


### 带重置按钮


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Button from '@hi-ui/button'
import QueryFilter, { FilterFieldProps } from '@hi-ui/query-filter' 
export const WithReset = () => {
 const [filterFields] = React.useState<FilterFieldProps[]>([
 {
 field: 'store',
 label: '门店',
 visible: true,
 component: (
 <Select
 optionWidth={200}
 clearable
 data={[
 {
 id: 'wuhan',
 title: '武汉分店',
 },
 {
 id: 'beijing',
 title: '北京分店',
 },
 ]}
 />
 ),
 },
 {
 field: 'category',
 label: '分类',
 visible: true,
 component: (
 <CheckSelect
 optionWidth={200}
 clearable
 data={[
 {
 id: 'phone',
 title: '手机',
 },
 {
 id: 'computer',
 title: '电脑',
 },
 ]}
 />
 ),
 },
 ])

 const defaultFormData = {
 store: '',
 category: [],
 }

 const [formData, setFormData] = React.useState<Record<string, unknown>>(defaultFormData)

 const handleChange = (formData: Record<string, unknown>) => {
 setFormData(formData)
 }

 return (
 <> 
 <div className="query-filter-with-reset__wrap">
 <QueryFilter
 append={<Button onClick={() => setFormData(defaultFormData)}>重置</Button>}
 filterFields={filterFields}
 formData={formData}
 onChange={handleChange}
 />
 </div>
 </>
 )
}

```


### 全部筛选


```tsx
import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Cascader from '@hi-ui/cascader'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button'
import { ClearOutlined } from '@hi-ui/icons'
import QueryFilter, {
 FilterFieldProps,
 FilterDrawer,
 SearchInput,
 FilterButton,
 QueryFilterProvider,
} from '@hi-ui/query-filter' 
export const AllFilter = () => {
 const [filterFields, setFilterFields] = React.useState<FilterFieldProps[]>([
 {
 field: 'store',
 label: '门店',
 visible: true,
 component: (
 <Select
 optionWidth={200}
 clearable
 data={[
 {
 id: 'wuhan',
 title: '武汉分店',
 },
 {
 id: 'beijing',
 title: '北京分店',
 },
 {
 id: 'shanghai',
 title: '上海分店',
 },
 ]}
 />
 ),
 },
 {
 field: 'category',
 label: '分类',
 visible: true,
 component: (
 <CheckSelect
 optionWidth={200}
 clearable
 dataSource={() => {
 return new Promise((resolve) => {
 setTimeout(() => {
 resolve([
 {
 id: 'phone',
 title: '手机',
 },
 {
 id: 'computer',
 title: '电脑',
 },
 {
 id: 'tablet',
 title: '平板',
 },
 ])
 }, 1000)
 })
 }}
 />
 ),
 },
 {
 field: 'cascader',
 label: '级联选择',
 visible: false,
 component: (
 <Cascader
 data={[
 {
 id: '1',
 title: '一级',
 children: [
 {
 id: '1-1',
 title: '二级',
 children: [
 {
 id: '1-1-1',
 title: '三级',
 },
 ],
 },
 ],
 },
 ]}
 />
 ),
 },
 {
 field: 'date-picker',
 label: '日期选择',
 visible: true,
 component: <DatePicker type="daterange" />,
 },
 ])

 const defaultFormData = {
 store: '',
 category: [],
 cascader: [],
 'date-picker': [],
 }

 const [formData, setFormData] = React.useState<Record<string, unknown>>(defaultFormData)

 const handleChange = (formData: Record<string, unknown>, fields: FilterFieldProps[]) => {
 console.log(formData, fields)

 setFormData(formData)
 setFilterFields(fields)
 }

 const [visible, setVisible] = React.useState(false)

 const showedFields = React.useMemo(() => {
 return filterFields.filter((field) => field.visible)
 }, [filterFields])

 // 判断是否为空值
 const isEmptyValue = React.useCallback((value: any) => {
 return (
 value === undefined ||
 value === '' ||
 value === null ||
 (Array.isArray(value) && value.length === 0)
 )
 }, [])

 const filteredCount = React.useMemo(() => {
 return Object.values(formData).filter((value) => !isEmptyValue(value)).length
 }, [formData, isEmptyValue])

 return (
 <> 
 <div className="query-filter-all-filter__wrap">
 <QueryFilterProvider>
 <QueryFilter
 prepend={<SearchInput placeholder="姓名/手机号" />}
 append={[
 <FilterButton key="all-filter" count={filteredCount} onClick={() => setVisible(true)}>
 全部筛选
 </FilterButton>,
 <React.Fragment key="clear-filter">
 {filteredCount > 0 ? (
 <Button icon={<ClearOutlined />} onClick={() => setFormData(defaultFormData)}>
 清空
 </Button>
 ) : null}
 </React.Fragment>,
 ]}
 filterFields={showedFields}
 formData={formData}
 onChange={setFormData}
 />
 <FilterDrawer
 width={360}
 visible={visible}
 title="全部筛选"
 formData={formData}
 // 在抽屉中点击确定后会触发 onChange
 onChange={handleChange}
 // 在抽屉中选中控件值后会触发 onSelect
 onSelect={(val, allVals, filterField) => {
 console.log('onSelect', val, allVals, filterField)
 }}
 filterFields={filterFields}
 onClose={() => {
 setVisible(false)
 }}
 onPinChange={console.log}
 // 自定义抽屉中组件的 props
 customFieldProps={(filterField) => {
 console.log('customFieldProps', filterField)

 if (filterField.field === 'cascader') {
 return {
 overlay: {
 placement: 'bottom-end',
 },
 }
 }

 if (filterField.field !== 'date-picker') {
 return {
 optionWidth: undefined,
 }
 }
 }}
 />
 </QueryFilterProvider>
 </div>
 </>
 )
}

```


## Props

### QueryFilter Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| onChange | 表单数据变化回调 | ((formData: Record\<string, unknown>) => void) | - | - |
| filterFields *(required)* | 筛选字段 | FilterFieldProps\[] | - | - |
| formData *(required)* | 表单数据 | Record\<string, unknown> | - | - |
| onPinChange | 固定字段变化回调 | ((field: string, visible: boolean) => void) | - | - |
| placement | 布局方式 | "horizontal" \| "vertical" | "horizontal" \| "vertical" | - |
| showLabel | 是否显示标签 | boolean | true \| false | - |
| showPin | 是否显示固定字段 | boolean | true \| false | - |
| appearance | 外观 | "line" \| "contained" | "line" \| "contained" | - |
| gap | 间距 | number | - | - |
| prepend | 前置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| append | 后置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| pinTexts | 固定字段文本 | { pin: string; unpin: string; } | - | - |
| onDataChange | 数据变化回调 | ((field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void) | (field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void | - |
| customFieldProps | 自定义字段属性 | ((filterField: FilterFieldProps) => Record\<string, unknown>) \| undefined | (filterField: FilterFieldProps) => Record\<string, unknown> \| undefined | - |
| classNames | | QueryFilterSemanticClassNames | - | - |
| styles | | QueryFilterSemanticStyles | - | - |


### FilterForm Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| styles | 语义化结构 style | { form?: CSSProperties; } \| undefined | { form?: CSSProperties \| undefined; } | "{}" |
| classNames | 语义化结构 class | { form?: string; } \| undefined | { form?: string \| undefined; } | - |
| filterFields *(required)* | 筛选字段 | FilterFieldProps\[] | - | - |
| formData *(required)* | 表单数据 | Record\<string, unknown> | - | - |
| onChange | 表单数据变化回调 | ((changedValue: Record\<string, any>, allValues: Record\<string, any>) => void) | - | - |
| onPinChange | 固定字段变化回调 | ((field: string, visible: boolean) => void) | - | - |
| placement | 布局方式 | "horizontal" \| "vertical" | "horizontal" \| "vertical" | "horizontal" |
| showLabel | 是否显示标签 | boolean | true \| false | true |
| showPin | 是否显示固定字段 | boolean | true \| false | true |
| appearance | 外观 | "line" \| "contained" | "line" \| "contained" | "line" |
| gap | 间距 | number | - | 8 |
| prepend | 前置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| append | 后置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| pinTexts | 固定字段文本 | { pin: string; unpin: string; } | - | "{&#xA; pin: '',&#xA; unpin: '',&#xA; }" |
| onDataChange | 数据变化回调 | ((field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void) | (field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void | - |
| customFieldProps | 自定义字段属性 | ((filterField: FilterFieldProps) => Record\<string, unknown>) \| undefined | (filterField: FilterFieldProps) => Record\<string, unknown> \| undefined | - |


### FilterDrawer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| classNames | 语义化结构 class | ({ form?: string; } & DrawerSemanticClassNames & FilterDrawerSemanticClassNames) \| undefined | { form?: string \| undefined; } & Readonly\<Partial\<Record\<DrawerSemanticName, string>>> & Readonly\<Partial\<Record\<FilterDrawerSemanticName, string>>> \| { form?: string \| undefined; } & Readonly\<Partial\<Record\<DrawerSemanticName, string>>> & ((info: { props: FilterDrawerProps; }) => Readonly<...>) \| { form?: string \| undefined; } & ((info: { props: DrawerProps; }) => Readonly\<Partial\<Record\<DrawerSemanticName, string>>>) & Readonly<...> \| { form?: string \| undefined; } & ((info: { props: DrawerProps; }) => Readonly\<Partial\<Record\<DrawerSemanticName, string>>>) & ((info: { ...; }) => Readonly<...>) | - |
| styles | 语义化结构 style | ({ form?: CSSProperties; } & DrawerSemanticStyles & FilterDrawerSemanticStyles) \| undefined | { form?: CSSProperties \| undefined; } & Readonly\<Partial\<Record\<DrawerSemanticName, CSSProperties>>> & Readonly<...> \| { form?: CSSProperties \| undefined; } & Readonly\<Partial\<Record\<DrawerSemanticName, CSSProperties>>> & ((info: { ...; }) => Readonly<...>) \| { form?: CSSProperties \| undefined; } & ((info: { props: DrawerProps; }) => Readonly\<Partial\<Record\<DrawerSemanticName, CSSProperties>>>) & Readonly<...> \| { form?: CSSProperties \| undefined; } & ((info: { props: DrawerProps; }) => Readonly\<Partial\<Record\<DrawerSemanticName, CSSProperties>>>) & ((info: { ...; }) => Readonly<...>) | - |
| filterFields *(required)* | 筛选字段 | FilterFieldProps\[] | - | - |
| formData *(required)* | 表单数据 | Record\<string, unknown> | - | - |
| onPinChange | 固定字段变化回调 | ((field: string, visible: boolean) => void) | - | - |
| showLabel | 是否显示标签 | boolean | true \| false | - |
| showPin | 是否显示固定字段 | boolean | true \| false | - |
| appearance | 外观 | "line" \| "contained" | "line" \| "contained" | - |
| gap | 间距 | number | - | - |
| prepend | 前置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| append | 后置内容 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| pinTexts | 固定字段文本 | { pin: string; unpin: string; } | - | - |
| onDataChange | 数据变化回调 | ((field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void) | (field: string, value: ReactText \| ReactText\[], item: unknown, items: unknown\[]) => void | - |
| customFieldProps | 自定义字段属性 | ((filterField: FilterFieldProps) => Record\<string, unknown>) \| undefined | (filterField: FilterFieldProps) => Record\<string, unknown> \| undefined | - |
| onChange | | ((formData: Record\<string, unknown>, fields: FilterFieldProps\[]) => void) | - | - |
| sureText | | ReactNode | - | - |
| cancelText | | ReactNode | - | - |
| title | 模态框标题 | ReactNode | - | - |
| footer | 自定义抽屉底部 | ReactNode | - | - |
| showMask | 是否显示蒙层 | boolean | true \| false | - |
| width | 自定义抽屉宽度，仅在 placement="left" \| "right" 有效 | string \| number | string \| number | - |
| height | 自定义抽屉高度，仅在 placement="bottom" \| "top" 有效 | string \| number | string \| number | - |
| size | 头部大小 | "sm" \| "md" | "sm" \| "md" | - |
| zIndex | 自定义css展示层级 | number | - | - |
| preload | 开启预加载渲染，用于性能优化，优先级小于 \`unmountOnClose\` | boolean | true \| false | - |
| unmountOnClose | 开启关闭时销毁，用于性能优化，优先级大于 \`preload\` | boolean | true \| false | - |
| onClose | 关闭事件触发时的回调 | (() => void) | - | - |
| container | 指定 portal 的容器 | HTMLElement \| null | null \| HTMLElement | - |
| placement | 设置唤起的方向 | DrawerPlacementEnum | "left" \| "right" \| "top" \| "bottom" | - |
| closeable | 是否展示右上角关闭按钮 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: Event) => void) | - | - |
| closeIcon | 自定义关闭按钮 | ReactNode | - | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| visible | 是否弹出显示 | boolean | true \| false | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | - |
| maskClosable | 开启点击蒙层时关闭 | boolean | true \| false | - |
| onSelect | | ((val: Record\<string, unknown>, allVals: Record\<string, unknown>, filterField?: FilterFieldProps) => void) \| undefined | (val: Record\<string, unknown>, allVals: Record\<string, unknown>, filterField?: FilterFieldProps \| undefined) => void | - |


### SearchInput Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| readOnly | 开启输入框只读 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| autoFocus | 开启输入框自动聚焦 | boolean | true \| false | - |
| value | 设置输入框的值 | string | - | - |
| defaultValue | 设置输入框的默认值 | string | - | - |
| type | 设置输入框类型 | InputTypeEnum | "number" \| "text" \| "id" \| "tel" \| "email" \| "card" \| "amount" \| "password" | - |
| maxLength | 输入最大长度 | number | - | - |
| prepend | 输入框前置外部内容 | ReactNode | - | - |
| append | 输入框后置外部内容 | ReactNode | - | - |
| prefix | 输入框前置内容 | ReactNode | - | - |
| suffix | 输入框后置内容 | ReactNode | - | - |
| clearable | 是否可清空，通过点击右侧清除按钮 | boolean | true \| false | - |
| trimValueOnBlur | 开启失焦时触发对值的 trim，将触发 onChange 给用户 | boolean | true \| false | - |
| clearableTrigger | 清除按钮展示的触发形态 | "always" \| "hover" | "always" \| "hover" | - |
| placeholder | 输入框占位符 | string | - | - |
| appearance | 设置展现形式&#xA;其中 \`underline\` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性） | InputAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "underline" | - |
| size | 设置尺寸 | HiBaseSizeEnum | "sm" \| "md" \| "xs" \| "lg" | - |
| onChange | 值改变时的回调 | ((evt: ChangeEvent\<HTMLInputElement>, value: string) => void) | - | - |
| waitCompositionEnd | 是否等待文本段落组成完成 | boolean | true \| false | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | InputSemanticClassNames | - | - |
| styles | | InputSemanticStyles | - | - |


### FilterButton Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| count | 筛选数量，当数量大于 9 时，宽度会自动调整为自适应 | number | - | - |
| children | 按钮文本 | ReactNode | - | - |
| type | 设置按钮类型 | "primary" \| "success" \| "danger" \| "default" \| "secondary" | "primary" \| "success" \| "danger" \| "default" \| "secondary" | - |
| size | 设置按钮尺寸 | "sm" \| "md" \| "xs" \| "lg" | "sm" \| "md" \| "xs" \| "lg" | - |
| appearance | 设置按钮外观 | "link" \| "line" \| "text" \| "filled" \| "solid" | "link" \| "line" \| "text" \| "filled" \| "solid" | - |
| disabled | 设置按钮是否禁用 | boolean | true \| false | - |
| loading | 是否显示 loading | boolean | true \| false | - |
| href | 设置按钮链接，设置后将用 a 标签渲染按钮 | string | - | - |
| target | 同 a 标签的 target 属性，仅在设置 href 后有效 | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | "\_self" \| "\_blank" \| "\_parent" \| "\_top" | - |
| icon | 设置按钮图标 | ReactNode \| ReactNode\[] | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| ReactNode\[] | - |
| shape | 设置按钮形状 | "square" \| "round" | "square" \| "round" | - |
| onClick | 点击按钮时的回调 | ((evt: MouseEvent\<Element, MouseEvent>) => void) | - | - |
| classNames | | ButtonSemanticClassNames | - | - |
| styles | | ButtonSemanticStyles | - | - |

