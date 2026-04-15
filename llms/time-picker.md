# TimePicker 时间选择器

在弹出面板上选择时间，以便捷完成时间输入的控件。

## 使用示例

### 基础用法

选择时间点，可与日期搭配使用，也可用于展示当天时间


```tsx
import React, { useState } from 'react'
import TimePicker from '@hi-ui/time-picker' 
export const Basic = () => {
 const [basicValue, setBasicValue] = useState<string | string[]>(['12:00:00'])

 return (
 <> 
 <div className="time-picker-basic__wrap">
 <TimePicker
 style={{ width: '240px' }}
 placeholder={['请选择时间']}
 value={basicValue}
 onChange={(e) => {
 console.log('basic-default', e)
 setBasicValue(e)
 }}
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
import TimePicker from '@hi-ui/time-picker' 
export const Appearance = () => {
 return (
 <> 
 <div className="time-picker-appearance__wrap">
 <h2>line</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} appearance={'line'} />
 <h2>filled</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} appearance={'filled'} />
 <h2>unset</h2>
 <TimePicker placeholder={['请选择时间']} appearance={'unset'} />
 <h2>borderless</h2>
 <TimePicker style={{ width: 240 }} placeholder={['请选择时间']} appearance={'borderless'} />
 <h2>contained</h2>
 <TimePicker label="时间" appearance={'contained'} onChange={console.log} />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import TimePicker from '@hi-ui/time-picker' 
export const Size = () => {
 return (
 <> 
 <div className="time-picker-appearance__wrap">
 <h2>xs</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} size={'xs'} />
 <h2>sm</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} size={'sm'} />
 <h2>md</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} size={'md'} />
 <h2>lg</h2>
 <TimePicker style={{ width: '240px' }} placeholder={['请选择时间']} size={'lg'} />
 </div>
 </>
 )
}

```


### 禁用状态


```tsx
import React from 'react'
import TimePicker from '@hi-ui/time-picker' 
export const Disabled = () => {
 return (
 <> 
 <div className="time-picker-disabled__wrap">
 <TimePicker style={{ width: '240px' }} disabled placeholder={['请选择时间']} />
 </div>
 </>
 )
}

```


### 时间范围

选择时间范围，可与日期搭配使用，也可用于展示当天时间范围


```tsx
import React, { useState } from 'react'
import TimePicker from '@hi-ui/time-picker' 
export const Range = () => {
 const [rangeValue, setRangeValue] = useState<string | string[]>(['11:11:11', '12:00:00'])

 return (
 <> 
 <div className="time-picker-range__wrap">
 <TimePicker
 style={{ width: '240px' }}
 value={rangeValue}
 placeholder={['请选择开始时间', '请选择结束时间']}
 onChange={(value) => {
 console.log('range-value', value)
 setRangeValue(value)
 }}
 type="range"
 />
 </div>
 </>
 )
}

```


### 不同粒度

可自定义不同的时间粒度


```tsx
import React, { useCallback, useState } from 'react'
import TimePicker, { TimePickerFormat } from '@hi-ui/time-picker' 
export const Format = () => {
 const [values, setValues] = useState([['11:11:11'], ['11:11'], ['11:11'], ['11'], ['11'], ['11']])

 const setMatchIndexValue = useCallback((newValue: string[], index: number) => {
 setValues((pre) => {
 const result = [...pre]
 result[index] = newValue
 return result
 })
 }, [])

 return (
 <> 
 <div className="time-picker-format__wrap">
 {['HH:mm:ss', 'HH:mm', 'mm:ss', 'HH', 'mm', 'ss'].map((item, index) => (
 <React.Fragment key={index}>
 <h2>{item}</h2>
 <TimePicker
 style={{ width: '240px' }}
 format={item as TimePickerFormat}
 placeholder={['请选择时间']}
 value={values[index]}
 onChange={(value: any) => {
 console.log(item, value)
 setMatchIndexValue(value, index)
 }}
 />
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 自定义禁选值

自定义禁选的时、分、秒数据


```tsx
import React, { useState } from 'react'
import TimePicker from '@hi-ui/time-picker' 
export const CustomDisabled = () => {
 const [hourValue, setHourValue] = useState(['11:11:11', '13:13:13'])
 const [minuteValue, setMinuteValue] = useState(['11:11:11', '13:13:13'])
 const [secondValue, setSecondValue] = useState(['11:11:11', '13:13:13'])

 return (
 <> 
 <div className="time-picker-custom-disabled__wrap" style={{ height: 400 }}>
 <h2>hour</h2>
 <TimePicker
 style={{ width: '240px' }}
 value={hourValue}
 placeholder={['请选择开始时间', '请选择结束时间']}
 onChange={(value: any) => {
 console.log('custom-hour-value', value)
 setHourValue(value)
 }}
 disabledHours={() => [5]}
 type="range"
 />
 <h2>minute</h2>
 <TimePicker
 style={{ width: '240px' }}
 value={minuteValue}
 placeholder={['请选择开始时间', '请选择结束时间']}
 onChange={(value: any) => {
 console.log('custom-minute-value', value)
 setMinuteValue(value)
 }}
 disabledMinutes={(hour) => {
 if (hour === 5) {
 return [2]
 }
 return []
 }}
 type="range"
 />
 <h2>second</h2>
 <TimePicker
 style={{ width: '240px' }}
 value={secondValue}
 placeholder={['请选择开始时间', '请选择结束时间']}
 onChange={(value: any) => {
 console.log('custom-second-value', value)
 setSecondValue(value)
 }}
 disabledSeconds={(hour, minute) => {
 if (hour === 5 && minute === 2) {
 return [0]
 }
 return []
 }}
 type="range"
 />
 </div>
 </>
 )
}

```


### 前内置元素


```tsx
import React, { useState } from 'react'
import TimePicker from '@hi-ui/time-picker'
import { AppStoreOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 const [addonValue, setAddonValue] = useState<string | string[]>(['12:00:00'])

 return (
 <> 
 <div className="time-picker-addon__wrap">
 <TimePicker
 style={{ width: '240px' }}
 placeholder={['请选择时间']}
 value={addonValue}
 onChange={(e) => {
 console.log('basic-default', e)
 setAddonValue(e)
 }}
 prefix={<AppStoreOutlined />}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 TimePicker 各元素进行细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import TimePicker, { TimePickerSemanticName } from '@hi-ui/time-picker' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TimePickerSemanticName>()

 return (
 <> 
 <div className="time-picker-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <TimePicker
 style={{ width: 280 }}
 placeholder={['请选择时间']}
 classNames={{
 root: 'my-time-picker__root',
 inputWrapper: 'my-time-picker__input-wrapper',
 prefix: 'my-time-picker__prefix',
 label: 'my-time-picker__label',
 input: 'my-time-picker__input',
 functionButton: 'my-time-picker__function-button',
 closeButton: 'my-time-picker__close-button',
 popContent: 'my-time-picker__pop-content',
 popFunctionButtons: 'my-time-picker__pop-function-buttons',
 popConfirmBtn: 'my-time-picker__pop-confirm-btn',
 popNowBtn: 'my-time-picker__pop-now-btn',
 }}
 styles={{
 ...(selected
 ? { [selected]: { outline: '2px solid #ffbe0a', outlineOffset: 2 } }
 : {}),
 }}
 // @ts-ignore
 overlay={{ flip: false }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'input', description: '输入框' },
 { title: 'functionButton', description: '右侧功能按钮区域' },
 { title: 'closeButton', description: '关闭/清空按钮' },
 { title: 'popContent', description: '弹层时间选择内容' },
 { title: 'popFunctionButtons', description: '弹层底部按钮区域' },
 { title: 'popConfirmBtn', description: '确认按钮' },
 { title: 'popNowBtn', description: '此刻按钮' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TimePickerSemanticName)}
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

### TimePicker Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------- |
| type | 选择器类型 | TimePickerType | - | "single" |
| format | 选择器格式 | TimePickerFormat | - | "HH:mm:ss" |
| value | 当前值（type='single'取数组第一个值，type='range'取数组第一个作为开始，第二个作为结束） | TimePickerValue \| TimePickerValue\[] | string \| number \| Date \| TimePickerValue\[] | - |
| defaultValue | 默认值 | TimePickerValue \| TimePickerValue\[] | string \| number \| Date \| TimePickerValue\[] | - |
| overlay | 自定义控制弹出层 popper | PopperOverlayProps | - | - |
| inputReadonly | 输入框是否不可编辑 | boolean | true \| false | false |
| disabled | 是否禁用 | boolean | true \| false | false |
| placeholder | 输入框占位符 | string \| string\[] | string \| string\[] | - |
| appearance | 选择器外观 | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | "line" \| "filled" \| "unset" \| "borderless" \| "contained" | "line" |
| label | 选择器标签 | string | - | - |
| size | 尺寸 | "xs" \| "sm" \| "md" \| "lg" | "xs" \| "sm" \| "md" \| "lg" | "'md'" |
| onChange | 值改变事件&#xA;@param value | ((value: string \| string\[]) => void) | (value: string \| string\[]) => void | - |
| invalid | 是否非法 | boolean | true \| false | false |
| prefix | 选择框前置内容 | ReactNode | - | - |
| showIndicator | 是否展示指示器 | boolean | true \| false | true |
| disabledHours | 禁止选择的小时 | TimePickerDisabledHoursFunction \| number\[] | TimePickerDisabledHoursFunction \| number\[] | () => \[] |
| disabledMinutes | 禁止选择的分钟 | number\[] \| TimePickerDisabledMinutesFunction | number\[] \| TimePickerDisabledMinutesFunction | () => \[] |
| disabledSeconds | 禁止选择的秒数 | number\[] \| TimePickerDisabledSecondsFunction | number\[] \| TimePickerDisabledSecondsFunction | () => \[] |
| hourStep | 小时选项间隔 | number | - | 1 |
| minuteStep | 分钟选项间隔 | number | - | 1 |
| secondStep | 秒选项间隔 | number | - | 1 |
| classNames | | TimePickerSemanticClassNames | - | - |
| styles | | TimePickerSemanticStyles | - | - |

