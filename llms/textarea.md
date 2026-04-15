# Textarea 文本输入框

基本的接收用户多行文本输入的组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import TextArea from '@hi-ui/textarea' 
export const Basic = () => {
 const [value, setValue] = React.useState('')
 return (
 <> 
 <div className="textarea-basic__wrap">
 <h2>line</h2>
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="line"
 />
 <br />
 <br />
 <h2>filled</h2>
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="filled"
 />
 <br />
 <br />
 <h2>unset</h2>
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="unset"
 />
 <br />
 <br />
 <h2>borderless</h2>
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="borderless"
 />
 </div>
 </>
 )
}

```


### 自动适应高度


```tsx
import React from 'react'
import TextArea from '@hi-ui/textarea' 
export const AutoSize = () => {
 const [value, setValue] = React.useState('')

 return (
 <> 
 <div className="textarea-auto-size__wrap">
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 minRows={2}
 appearance="line"
 />
 <br />
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 maxRows={3}
 appearance="line"
 />
 </div>
 </>
 )
}

```


### 展示输入字数


```tsx
import React from 'react'
import TextArea from '@hi-ui/textarea' 
export const ShowCount = () => {
 const [value, setValue] = React.useState('')
 return (
 <> 
 <div className="textarea-show-count__wrap">
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="line"
 showCount
 maxLength={100}
 />
 <br />
 <br />
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="filled"
 showCount
 maxLength={100}
 />
 <br />
 <br />
 <TextArea
 value={value}
 onChange={(evt) => setValue(evt.target.value)}
 placeholder="请输入"
 appearance="unset"
 showCount
 maxLength={100}
 />
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import TextArea from '@hi-ui/textarea' 
export const Disabled = () => {
 return (
 <> 
 <div className="textarea-disabled__wrap">
 <h2>普通</h2>
 <div>
 <TextArea appearance="line" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea appearance="unset" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea appearance="filled" disabled placeholder="请输入"></TextArea>
 </div>
 <br />
 <h2>Invalid</h2>
 <div>
 <TextArea invalid appearance="line" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea invalid appearance="unset" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea invalid appearance="filled" disabled placeholder="请输入"></TextArea>
 </div>
 <br />
 <h2>有值</h2>
 <div>
 <TextArea value="输入值" appearance="line" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea value="输入值" appearance="unset" disabled placeholder="请输入"></TextArea>
 <br />
 <br />
 <TextArea value="输入值" appearance="filled" disabled placeholder="请输入"></TextArea>
 </div>
 </div>
 </>
 )
}

```


### 输入框内置内容

header默认在顶部展示，可根据需求自行定义样式


```tsx
import React from 'react'
import TextArea from '@hi-ui/textarea'
import { CopyOutlined, ExpressionOutlined } from '@hi-ui/icons' 
export const Header = () => {
 return (
 <> 
 <div className="text-header__wrap">
 <TextArea
 placeholder="请输入"
 header={
 <>
 <CopyOutlined style={{ marginRight: 6, fontSize: 16, color: '#5f6a7a' }} />
 <ExpressionOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
 </>
 }
 ></TextArea>
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
import { CopyOutlined } from '@hi-ui/icons'
import TextArea, { TextAreaSemanticName } from '@hi-ui/textarea' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TextAreaSemanticName>()

 return (
 <> 
 <div className="textarea-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <TextArea
 placeholder="请输入"
 showCount
 maxLength={100}
 classNames={{
 root: 'my-textarea__root',
 inner: 'my-textarea__inner',
 header: 'my-textarea__header',
 text: 'my-textarea__text',
 count: 'my-textarea__count',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 header={
 <>
 <CopyOutlined style={{ marginRight: 6, fontSize: 16, color: '#5f6a7a' }} />
 </>
 }
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根/包装器' },
 { title: 'inner', description: '内层容器' },
 { title: 'header', description: '头部' },
 { title: 'text', description: '输入框' },
 { title: 'count', description: '字数统计' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TextAreaSemanticName)}
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

### TextArea Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ | ------ |
| size | 设置输入框尺寸 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | - |
| header | 输入框顶部内容 | ReactNode | - | - |
| appearance | 设置展现形式&#xA;其中 \`underline\` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性） | HiBaseAppearanceEnum \| "underline" | "line" \| "filled" \| "unset" \| "borderless" \| "underline" | "line" |
| showCount | 是否展示字数 | boolean | true \| false | false |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | false |
| classNames | | TextAreaSemanticClassNames | - | - |
| styles | | TextAreaSemanticStyles | - | - |
| autoSize | 自适应内容高度 | boolean | true \| false | - |
| maxRows | 自适应内容最大行数 | number | - | - |
| minRows | 自适应内容最小行数 | number | - | - |
| onChange | 值改变时回调 | ((event: ChangeEvent\<HTMLTextAreaElement>) => void) | - | - |
| defaultValue | 设置输入框的默认值 | string | - | - |
| value | 设置输入框的值 | string | - | - |
| trimValueOnBlur | 在失焦时触发对值的 trim 并触发 onChange 回调 | boolean | true \| false | - |
| inputElementRef | 输入框 ref | any | - | - |
| waitCompositionEnd | 是否等待文本段落组成完成 | boolean | true \| false | - |

