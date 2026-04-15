# Switch 开关

一种通过开启和关闭来控制两种状态的控制器组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Switch from '@hi-ui/switch' 
export const Basic = () => {
 return (
 <> 
 <div className="switch-basic__wrap">
 <Switch defaultChecked />
 </div>
 </>
 )
}

```


### 不同大小


```tsx
import React from 'react'
import Switch from '@hi-ui/switch' 
export const Size = () => {
 return (
 <> 
 <div className="switch-basic__wrap">
 <h2>sm</h2>
 <div>
 <Switch size="sm" defaultChecked content={['开', '关']} />
 </div>

 <h2>md</h2>
 <div>
 <Switch size="md" defaultChecked content={['开', '关']} />
 </div>

 <h2>lg</h2>
 <div>
 <Switch size="lg" defaultChecked content={['开', '关']} />
 </div>
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Switch from '@hi-ui/switch' 
export const Controlled = () => {
 const [checked, setChecked] = React.useState(false)

 return (
 <> 
 <div
 className="switch-controlled__wrap"
 style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
 >
 <Switch checked={checked} onChange={setChecked} />
 <Switch checked={checked} onChange={setChecked} />
 </div>
 </>
 )
}

```


### 不同状态


```tsx
import React from 'react'
import Switch from '@hi-ui/switch' 
export const Status = () => {
 return (
 <> 
 <div className="switch-basic__wrap">
 <h2>默认</h2>
 <div>
 <Switch defaultChecked />
 </div>

 <h2>受控开启</h2>
 <div>
 <Switch checked />
 </div>

 <h2>受控关闭</h2>
 <Switch checked={false} />

 <h2>禁用</h2>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 <Switch disabled checked />
 <Switch disabled checked={false} />
 </div>
 </div>
 </>
 )
}

```


### 自定义内容


```tsx
import React from 'react'
import Switch from '@hi-ui/switch'
import { CloseOutlined, CheckOutlined } from '@hi-ui/icons' 
export const Custom = () => {
 return (
 <> 
 <div className="switch-basic__wrap">
 <h2>自定义文字 </h2>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 <Switch
 defaultChecked
 content={['开', '关']}
 onChange={(checked) => console.log('change', checked)}
 />
 <Switch
 defaultChecked
 content={['ON', 'OFF']}
 onChange={(checked) => console.log('change', checked)}
 />
 </div>

 <h2>自定义图标 </h2>
 <div>
 <Switch
 defaultChecked
 content={[<CheckOutlined key={1} />, <CloseOutlined key={2} />]}
 onChange={(checked) => console.log('change', checked)}
 />
 </div>
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
import Switch, { SwitchSemanticName } from '@hi-ui/switch' 
export const Semantic = () => {
 const [selected, setSelected] = useState<SwitchSemanticName>()

 return (
 <> 
 <div className="switch-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Switch
 defaultChecked
 content={['关', '开']}
 classNames={{
 root: 'my-switch__root',
 text: 'my-switch__text',
 handle: 'my-switch__handle',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'text', description: '文案' },
 { title: 'handle', description: '滑块' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as SwitchSemanticName)}
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

### Switch Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | --------------------------------- | ---------------------------- | -------------------- | ------ |
| size | 开关大小 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| checked | 是否选中 | boolean | true \| false | - |
| defaultChecked | 是否默认选中 | boolean | true \| false | false |
| content | 开关状态内容，用法：\['开', '关'] | \[ReactNode, ReactNode] | - | - |
| onChange | 状态改变时的回调 | ((checked: boolean) => void) | - | - |
| classNames | | SwitchSemanticClassNames | - | - |
| styles | | SwitchSemanticStyles | - | - |

