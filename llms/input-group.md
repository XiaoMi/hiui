# InputGroup 输入框组合器

将表单控件或按钮进行组合，轻松扩展表单控件。

## 使用示例

### 基础用法

通过包裹多个表单控件，将它们进行组合展示


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import Select from '@hi-ui/select'

import InputGroup from '@hi-ui/input-group' 
export const Basic = () => {
 return (
 <> 
 <div className="input-group-basic__wrap">
 <InputGroup>
 <Select
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <Input />
 </InputGroup>
 </div>
 </>
 )
}

```


### 不同组合形式

根据不同场景组合不同类型的表单控件


```tsx
import React from 'react'
import Input from '@hi-ui/input'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Cascader from '@hi-ui/cascader'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button'

import InputGroup from '@hi-ui/input-group' 
export const Group = () => {
 return (
 <> 
 <div
 className="input-group-group__wrap"
 style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
 >
 {/* Input + button */}
 <InputGroup>
 <Input placeholder="请输入" />
 <Button type="primary">检索</Button>
 </InputGroup>

 <InputGroup>
 <Select
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <Input placeholder="请输入" />
 </InputGroup>

 <InputGroup>
 <Input placeholder="请输入" />
 <Input placeholder="请输入" />
 </InputGroup>

 <InputGroup>
 <Select
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <Input placeholder="请输入" />
 <Button type="primary">确定</Button>
 </InputGroup>

 <InputGroup>
 <CheckSelect
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <CheckSelect
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <Input placeholder="请输入" />
 </InputGroup>

 <InputGroup>
 <Cascader
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <DatePicker placeholder="请输入" />
 </InputGroup>

 <InputGroup>
 <Select
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <Cascader
 style={{ width: '36%' }}
 data={[
 {
 id: '1',
 title: 'Option 1',
 children: [
 { id: '1-1', title: 'Option 1-1' },
 { id: '1-2', title: 'Option 1-2' },
 ],
 },
 {
 id: 2,
 title: 'Option 2',
 children: [
 { id: '2-1', title: 'Option 1-1' },
 { id: '2-2', title: 'Option 1-2' },
 ],
 },
 ]}
 />
 <Input placeholder="请输入" />
 </InputGroup>

 <InputGroup>
 <Select
 style={{ width: '36%' }}
 data={[
 { id: 1, title: 'Option 1' },
 { id: 2, title: 'Option 2' },
 ]}
 />
 <DatePicker type="daterange" />
 </InputGroup>

 <InputGroup>
 <DatePicker type="daterange" placeholder={['开始时间', '结束时间']} />
 <Input style={{ width: '36%' }} placeholder="请输入" />
 </InputGroup>
 </div>
 </>
 )
}

```


## Props

### InputGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | -------------------------------- | ------- | ------------- | ------ |
| disabled | 统一设置被包裹表单控件的禁用状态 | boolean | true \| false | - |

