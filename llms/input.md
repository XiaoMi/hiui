# Input 输入框

用来接收文本型内容的组件

## 使用示例

### 基础用法

可获取有限长度的字符串，不折行显示


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Basic = () => {
 return (
 <> 
 <div className="input-basic__wrap">
 <Input placeholder="请输入" onChange={(e, t) => console.log(e.target.value, t)} />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Controlled = () => {
 const [value, setValue] = React.useState('我是输入文本')

 return (
 <> 
 <div className="input-controlled__wrap">
 <div style={{ fontSize: 14 }}>输入值：{value}</div>
 <Input
 style={{ marginTop: 8 }}
 placeholder="请输入"
 value={value}
 onChange={(e) => setValue(e.target.value)}
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
import Input from '@hi-ui/input'
import { ExpressionOutlined, AudioOutlined, MessageOutlined } from '@hi-ui/icons' 
export const Appearance = () => {
 return (
 <> 
 <div className="input-appearance__wrap">
 <h2>outline</h2>
 <Input size="md" appearance="line" placeholder="请输入内容"></Input>
 <br />
 <br />
 <Input
 size="md"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 prefix={<MessageOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 <br />
 <br />
 <h2>filled</h2>
 <Input size="md" appearance="filled" placeholder="请输入内容"></Input>
 <br />
 <br />
 <Input
 size="md"
 appearance="filled"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 prefix={<MessageOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 <br />
 <br />
 <h2>unset</h2>
 <Input size="md" appearance="unset" placeholder="请输入内容"></Input>
 <br />
 <br />
 <Input
 appearance="unset"
 size="md"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 prefix={<MessageOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 <br />
 <br />
 <h2>borderless</h2>
 <Input size="md" appearance="borderless" placeholder="请输入内容"></Input>
 <br />
 <br />
 <Input
 appearance="borderless"
 size="md"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 prefix={<MessageOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 <br />
 <br />
 <h2>underline</h2>
 <Input size="md" appearance="underline" placeholder="请输入内容"></Input>
 <br />
 <br />
 <Input
 appearance="underline"
 size="md"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 prefix={<MessageOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 <br />
 <br />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import { ExpressionOutlined, AudioOutlined } from '@hi-ui/icons' 
export const Size = () => {
 return (
 <> 
 <div className="input-size__wrap">
 <Input
 size="xs"
 placeholder="xs"
 prefix={<ExpressionOutlined />}
 suffix={<AudioOutlined style={{ marginRight: 4 }} />}
 ></Input>
 <br />
 <br />
 <Input
 size="sm"
 placeholder="sm"
 prefix={<ExpressionOutlined />}
 suffix={<AudioOutlined style={{ marginRight: 4 }} />}
 ></Input>
 <br />
 <br />
 <Input
 size="md"
 placeholder="md"
 prefix={<ExpressionOutlined />}
 suffix={<AudioOutlined style={{ marginRight: 4 }} />}
 ></Input>
 <br />
 <br />
 <Input
 size="lg"
 placeholder="lg"
 prefix={<ExpressionOutlined />}
 suffix={<AudioOutlined style={{ marginRight: 4 }} />}
 ></Input>
 </div>
 </>
 )
}

```


### 前后外置元素

将输入框与外置的其他元素组合使用


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import { ExpressionOutlined, AudioOutlined, SearchOutlined, MessageOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 return (
 <> 
 <div className="input-addon__wrap">
 <h2>prefix or suffix</h2>
 <Input placeholder="请输入" prefix="http://" suffix=".com"></Input>
 <br />
 <br />
 <Input
 clearable
 clearableTrigger="always"
 placeholder="请输入"
 suffix={<SearchOutlined />}
 ></Input>
 <br />
 <br />
 <Input placeholder="请输入" prefix={<ExpressionOutlined />}></Input>
 <br />
 <br />
 <Input
 placeholder="请输入"
 prefix={<MessageOutlined />}
 suffix={
 <>
 <AudioOutlined style={{ marginRight: 4 }} />
 <ExpressionOutlined />
 </>
 }
 ></Input>
 </div>
 <br />
 <div className="input-addon__wrap">
 <h2>prepend or append</h2>
 <Input placeholder="请输入" prepend="http://" append=".com"></Input>
 <br />
 <br />
 <Input
 clearable
 clearableTrigger="always"
 placeholder="请输入"
 append={<SearchOutlined />}
 ></Input>
 <br />
 <br />
 <Input placeholder="请输入" prepend={<ExpressionOutlined />}></Input>
 <br />
 <br />
 <Input
 placeholder="请输入"
 prepend={<MessageOutlined />}
 append={
 <>
 <AudioOutlined style={{ marginRight: 4 }} />
 <ExpressionOutlined />
 </>
 }
 ></Input>
 </div>
 <div className="input-addon__wrap">
 <h2>mixin addon</h2>
 <Input
 size="md"
 clearable
 placeholder="请输入"
 prepend={<ExpressionOutlined />}
 suffix={<AudioOutlined />}
 append={<div>Send</div>}
 ></Input>
 </div>
 </>
 )
}

```


### 组合


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import { SearchOutlined } from '@hi-ui/icons'
import { Select } from '@hi-ui/select'
import { message } from '@hi-ui/message'
import Button from '@hi-ui/button' 
export const Group = () => {
 return (
 <> 
 <div className="input-Group__wrap">
 <Input
 placeholder="请输入"
 prepend={
 <Select
 clearable={false}
 style={{ width: 80 }}
 data={[
 { title: '+86', id: '86' },
 { title: '+1', id: '1' },
 { title: '+33', id: '33' },
 { title: '+91', id: '91' },
 ]}
 defaultValue="86"
 />
 }
 />
 <br />
 <br />
 <Input
 clearable
 clearableTrigger="always"
 placeholder="请输入"
 append={
 <Button
 type="primary"
 icon={<SearchOutlined />}
 onClick={() => {
 message.open({ type: 'success', title: '查询成功', duration: 2000 })
 }}
 />
 }
 />
 </div>
 </>
 )
}

```


### 可清除


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Clearable = () => {
 return (
 <> 
 <div className="input-clearable__wrap">
 <Input
 clearable
 placeholder="内容输入后只在 hover 时可清除"
 onChange={(e) => console.log('change', e.target.value)}
 onBlur={(e) => console.log('onBlur', e.target.value)}
 ></Input>
 <br />
 <br />
 <Input clearable clearableTrigger="always" placeholder="内容输入后就可清除"></Input>
 </div>
 </>
 )
}

```


### 无效状态


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Invalid = () => {
 return (
 <> 
 <div className="input-invalid__wrap">
 <div>
 <Input appearance="line" invalid placeholder="请输入"></Input>
 <br />
 <br />
 <Input appearance="unset" invalid placeholder="请输入"></Input>
 <br />
 <br />
 <Input appearance="filled" invalid placeholder="请输入"></Input>
 <br />
 <br />
 <Input appearance="underline" invalid placeholder="请输入"></Input>
 </div>
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Disabled = () => {
 return (
 <> 
 <div className="input-disabled__wrap">
 <h2>普通</h2>
 <div>
 <Input appearance="line" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input appearance="unset" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input appearance="filled" disabled placeholder="请输入"></Input>
 </div>
 <br />
 <h2>Invalid</h2>
 <div>
 <Input invalid appearance="line" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input invalid appearance="unset" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input invalid appearance="filled" disabled placeholder="请输入"></Input>
 </div>
 <br />
 <h2>有值</h2>
 <div>
 <Input clearable value="输入值" appearance="line" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input clearable value="输入值" appearance="unset" disabled placeholder="请输入"></Input>
 <br />
 <br />
 <Input clearable value="输入值" appearance="filled" disabled placeholder="请输入"></Input>
 </div>
 </div>
 </>
 )
}

```


### 手动聚焦

通过 ref 获取 input 引用手动调用 focus 方法


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button' 
export const Focus = () => {
 const inputRef = React.useRef<any>(null)

 return (
 <> 
 <div className="input-focus__wrap">
 <Button
 onClick={() => {
 inputRef.current?.focus()
 }}
 >
 手动聚焦
 </Button>
 <Input style={{ marginTop: 10 }} ref={inputRef} placeholder="请输入"></Input>
 </div>
 </>
 )
}

```


### 自动 Trim


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Trim = () => {
 return (
 <> 
 <div className="input-trim__wrap">
 <Input
 placeholder="请输入"
 onChange={(e) => console.log('change', e.target.value)}
 trimValueOnBlur
 ></Input>
 <br />
 <br />
 <Input disabled placeholder="请输入"></Input>
 </div>
 </>
 )
}

```


### 特殊格式

满足不同业务场景的特殊格式


```tsx
import React from 'react'
import Input from '@hi-ui/input' 
export const Type = () => {
 return (
 <> 
 <div className="input-type__wrap">
 <h2>身份证</h2>
 <Input
 type="id"
 style={{ width: 250 }}
 placeholder="请输入"
 clearable
 trimValueOnBlur
 onChange={(event, value) => {
 console.log(event.target.value, value)
 }}
 />
 <h2>手机号</h2>
 <Input
 type="tel"
 style={{ width: 250 }}
 placeholder="请输入"
 clearable
 trimValueOnBlur
 onChange={(event, value) => {
 console.log(event.target.value, value)
 }}
 />
 <h2>金额</h2>
 <Input
 type="amount"
 style={{ width: 250 }}
 placeholder="请输入"
 clearable
 trimValueOnBlur
 onChange={(event, value) => {
 console.log(event.target.value, value)
 }}
 />
 <h2>银行卡</h2>
 <Input
 type="card"
 style={{ width: 250 }}
 placeholder="请输入"
 clearable
 trimValueOnBlur
 onChange={(event, value) => {
 console.log(event.target.value, value)
 }}
 />
 </div>
 </>
 )
}

```


### 带Tooltip


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import Tooltip from '@hi-ui/tooltip' 
export const WithTooltip = () => {
 const [value, setValue] = React.useState('Tooltip')

 return (
 <> 
 <div className="input-Tooltip__wrap">
 <Tooltip trigger="focus" title={value || '请输入'}>
 <Input
 placeholder="请输入"
 value={value}
 onChange={(e) => setValue(e.target.value)}
 ></Input>
 </Tooltip>
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
import Input, { InputSemanticName } from '@hi-ui/input' 
export const Semantic = () => {
 const [selected, setSelected] = useState<InputSemanticName>()

 return (
 <> 
 <div className="input-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Input
 placeholder="请输入内容"
 prefix="前缀"
 suffix="后缀"
 prepend="前置"
 append="后置"
 clearable
 classNames={{
 root: 'my-input__root',
 outer: 'my-input__outer',
 inner: 'my-input__inner',
 input: 'my-input__input',
 prefix: 'my-input__prefix',
 suffix: 'my-input__suffix',
 prepend: 'my-input__prepend',
 append: 'my-input__append',
 clear: 'my-input__clear',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
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
 title: 'outer',
 description: '外层容器',
 },
 {
 title: 'inner',
 description: '内层容器',
 },
 {
 title: 'input',
 description: '输入框元素',
 },
 {
 title: 'prefix',
 description: '前缀元素',
 },
 {
 title: 'suffix',
 description: '后缀元素',
 },
 {
 title: 'prepend',
 description: '前置外部内容',
 },
 {
 title: 'append',
 description: '后置外部内容',
 },
 {
 title: 'clear',
 description: '清除按钮',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as InputSemanticName)
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

### Input Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------- |
| readOnly | 开启输入框只读 | boolean | true \| false | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| autoFocus | 开启输入框自动聚焦 | boolean | true \| false | - |
| value | 设置输入框的值 | string | - | - |
| defaultValue | 设置输入框的默认值 | string | - | - |
| type | 设置输入框类型 | InputTypeEnum | "number" \| "text" \| "id" \| "tel" \| "card" \| "amount" \| "email" \| "password" | - |
| maxLength | 输入最大长度 | number | - | - |
| prepend | 输入框前置外部内容 | ReactNode | - | - |
| append | 输入框后置外部内容 | ReactNode | - | - |
| prefix | 输入框前置内容 | ReactNode | - | - |
| suffix | 输入框后置内容 | ReactNode | - | - |
| clearable | 是否可清空，通过点击右侧清除按钮 | boolean | true \| false | false |
| trimValueOnBlur | 开启失焦时触发对值的 trim，将触发 onChange 给用户 | boolean | true \| false | - |
| clearableTrigger | 清除按钮展示的触发形态 | "always" \| "hover" | "always" \| "hover" | "hover" |
| placeholder | 输入框占位符 | string | - | - |
| appearance | 设置展现形式&#xA;其中 \`underline\` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性） | InputAppearanceEnum | "line" \| "filled" \| "unset" \| "borderless" \| "underline" | "line" |
| size | 设置尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | - |
| onChange | 值改变时的回调 | ((evt: ChangeEvent\<HTMLInputElement>, value: string) => void) | - | - |
| waitCompositionEnd | 是否等待文本段落组成完成 | boolean | true \| false | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | false |
| classNames | | InputSemanticClassNames | - | - |
| styles | | InputSemanticStyles | - | - |

