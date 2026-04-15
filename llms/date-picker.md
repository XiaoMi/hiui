# DatePicker 日期选择器

用于接收日期和时间类型的容器。

## 使用示例

### 基础用法

以天为粒度，展示“YYYY-MM-DD”


```tsx
import React, { useState } from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const Basic = () => {
 const [controlledValue, setControlledValue] = useState(new Date())
 return (
 <> 
 <div className="date-picker-basic__wrap">
 <h2>基础</h2>
 <DatePicker
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>带默认值</h2>
 <DatePicker
 style={{ width: 240 }}
 defaultValue={new Date()}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>受控</h2>
 <DatePicker
 style={{ width: 240 }}
 value={controlledValue}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 setControlledValue(date as Date)
 }}
 />

 <h2>禁用</h2>
 <DatePicker
 style={{ width: 240 }}
 disabled
 defaultValue={new Date()}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>限制范围</h2>
 <DatePicker
 style={{ width: 240 }}
 minDate={new Date()}
 maxDate={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 不同UI风格

UI风格包括线性、面性两种


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const Appearance = () => {
 return (
 <> 
 <div className="date-picker-appearance__wrap">
 <h2>Line</h2>
 <DatePicker
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>filled</h2>
 <DatePicker
 style={{ width: 240 }}
 appearance={'filled'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>unset</h2>
 <DatePicker
 appearance={'unset'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>borderless</h2>
 <DatePicker
 style={{ width: 240 }}
 appearance={'borderless'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>contained</h2>
 <DatePicker
 style={{ width: 'auto', marginBottom: 16 }}
 appearance="contained"
 label="日期"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <DatePicker
 appearance="contained"
 label="日期范围"
 type="daterange"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 年份 / 季度 / 月份 / 周

以年份 / 季度 / 月份 / 周为展示粒度


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const YearMonthWeek = () => {
 return (
 <> 
 <div className="date-picker-ymw__wrap">
 <h2>年份</h2>
 <DatePicker
 style={{ width: 238 }}
 type="year"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>季度</h2>
 <DatePicker
 style={{ width: 238 }}
 type="quarter"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>月份</h2>
 <DatePicker
 style={{ width: 238 }}
 type="month"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>周</h2>
 {/* 如果遇到周选择选值问题，尝试手动引入 import 'moment/locale/zh-cn' */}
 <DatePicker
 style={{ width: 238 }}
 type="week"
 defaultValue={new Date()}
 weekOffset={0}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 展示周

仅在日期选择器中生效


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const ShowWeek = () => {
 return (
 <> 
 <div className="date-picker-basic__wrap">
 <h2>展示周</h2>
 <DatePicker
 style={{ width: 240 }}
 showWeek
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />
 <h2>展示周-自定义内容</h2>
 <DatePicker
 style={{ width: 240 }}
 showWeek
 cellRender={(info) => {
 const { value, weekNum } = info
 return weekNum ? 'W' + weekNum : value
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />
 </div>
 </>
 )
}

```


### 自定义单元格内容


```tsx
import React from 'react'
import moment from 'moment'
import DayJs from 'dayjs'
import DatePicker from '@hi-ui/date-picker' 
export const CellRender = () => {
 return (
 <> 
 <div className="date-picker-ymw__wrap">
 <h2>年份</h2>
 <DatePicker
 style={{ width: 238 }}
 type="year"
 cellRender={(info) => {
 const { type, text } = info

 return type === 'today' ? <strong>{text}</strong> : text
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>月份</h2>
 <DatePicker
 style={{ width: 238 }}
 type="month"
 cellRender={(info) => {
 const { type, text } = info
 return type === 'today' ? <strong>{text}</strong> : text
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>周</h2>
 <DatePicker
 style={{ width: 238 }}
 type="week"
 defaultValue={new Date()}
 cellRender={(info) => {
 const { value, weekNum } = info

 return weekNum ? 'W' + weekNum : value
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>周范围</h2>
 <DatePicker
 style={{ width: 560 }}
 type="weekrange"
 defaultValue={[DayJs().subtract(2, 'week').toDate(), new Date()]}
 strideSelectMode="fixed"
 format={(value) => {
 // console.log('format', value)

 const lastDay = value.clone().endOf('month').date()
 const startOfWeek = value.clone().startOf('week')
 const endOfWeek = value.clone().endOf('week')
 const week = value.clone().week()
 const weekYear = value.clone().weekYear()

 // 如果当前日期是当月第一天或者或者小于周一，并且周一不是当月第一天，则该周视为 B 周
 if (
 (value.date() === 1 || startOfWeek.date() > value.date()) &&
 startOfWeek.date() !== 1
 ) {
 return `${weekYear}-${week}B`
 }

 // 如果当前日期是当月最后一天或者大于周日，并且周日不是最后一天，则该周视为 A 周
 if (
 (value.date() === lastDay || value.date() > endOfWeek.date()) &&
 endOfWeek.date() !== lastDay
 ) {
 return `${weekYear}-${week}A`
 }

 return `${weekYear}-${week}`
 }}
 // 自定义渲染出 AB 周，逻辑：
 // 在当前月周选择面板下，如果当月第一天位于第一行并且不是周一，则该周视为B周
 // 如果当前月最后一天位于最后一行并且不是周日，则该周视为A周
 cellRender={(cellInfo) => {
 // console.log('cellInfo', cellInfo)

 const { value, weekNum } = cellInfo

 if (weekNum) {
 // weekStartDate 周一日期
 // renderDate 当前月日期
 const { weekStartDate, renderDate } = cellInfo
 // 当前周最后一天
 const weekEndDate = weekStartDate?.clone().add(6, 'day')

 if (
 weekEndDate &&
 renderDate &&
 (weekEndDate?.month() > renderDate?.month() ||
 weekEndDate?.year() > renderDate?.year()) &&
 weekStartDate?.month() === renderDate?.month()
 ) {
 return weekNum + 'A'
 }

 if (
 weekStartDate &&
 renderDate &&
 (weekStartDate?.month() < renderDate?.month() ||
 weekStartDate?.year() < renderDate?.year()) &&
 weekEndDate?.month() === renderDate?.month()
 ) {
 return weekNum + 'B'
 }

 return weekNum
 } else {
 return value
 }
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)

 const _date = date as Date[]
 const start = moment(_date?.[0])
 const end = moment(_date?.[1])
 const lastDay = end.clone().endOf('month').date()

 // 如果开始日期是当月第一天并且不是周一，则该周视为 B 周
 if (start.date() === 1 && start.clone().startOf('week').date() !== 1) {
 console.log('start week', dateStr?.[0] + 'B')
 }

 // 如果当前日期是当月最后一天并且不是周末，则该周视为 A 周
 if (end.date() === lastDay && end.clone().endOf('week').date() !== lastDay) {
 console.log('end week', dateStr?.[1] + 'A')
 }
 }}
 />
 </div>
 </>
 )
}

```


### 日期时间

以时间点为粒度，展示“YYYY-MM-DD HH:mm:ss”


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const DateTime = () => {
 return (
 <> 
 <div className="date-time__wrap">
 <h2>基础用法</h2>
 <DatePicker
 showTime
 defaultValue={new Date()}
 disabledHours={[2, 3, 4, 5, 6]}
 format="YYYY-MM-DD HH:mm:ss"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>设置选择面板默认展示的时间</h2>
 <DatePicker
 showTime={{ defaultOpenValue: '09:00:00' }}
 format="YYYY-MM-DD HH:mm:ss"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>设置选择面板默认展示的开始和结束时间</h2>
 <DatePicker
 type="daterange"
 showTime={{ defaultOpenValue: ['00:00:00', '23:59:59'] }}
 disabledHours={[2, 3, 4, 5, 6]}
 format="YYYY-MM-DD HH:mm:ss"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 范围

以天、周、月、季度、年等粒度展示一个时间的范围


```tsx
import React, { useState } from 'react'
import DatePicker from '@hi-ui/date-picker'
import DayJs from 'dayjs' 
export const Range = () => {
 const [dynamicSelectedValue, setDynamicSelectedValue] = useState<any>('')
 const [start, setStart] = useState<Date[]>([])

 return (
 <> 
 <div className="range__wrap">
 <h2>日期</h2>
 <DatePicker
 type="daterange"
 style={{ width: 480 }}
 defaultValue={[DayJs().subtract(7, 'day').toDate(), new Date()]}
 format="YYYY-MM-DD"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>年份</h2>
 <DatePicker
 style={{ width: 480 }}
 type="yearrange"
 defaultValue={[DayJs().subtract(2, 'year').toDate(), new Date()]}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>季度</h2>
 <DatePicker
 style={{ width: 480 }}
 type="quarterrange"
 defaultValue={[new Date(`${new Date().getFullYear()}-09-01`), new Date()]}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>月份</h2>
 <DatePicker
 style={{ width: 480 }}
 type="monthrange"
 defaultValue={[DayJs().subtract(2, 'month').toDate(), new Date()]}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>周</h2>
 {/* 如果遇到周范围选择选值问题，尝试手动引入 import 'moment/locale/zh-cn' */}
 <DatePicker
 style={{ width: 480 }}
 type="weekrange"
 defaultValue={[DayJs().subtract(2, 'week').toDate(), new Date()]}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>日期时间范围</h2>
 <DatePicker
 style={{ width: 480 }}
 type="daterange"
 showTime
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />

 <h2>时间段快速选择</h2>
 <DatePicker
 style={{ width: 372 }}
 type="timeperiod"
 onSelect={console.log}
 timeInterval={30}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />

 <h2>动态限制日期范围</h2>
 <DatePicker
 style={{ width: 480 }}
 type="daterange"
 disabledDate={(val) => {
 if (dynamicSelectedValue) {
 const timestampCurrent = new Date(val).getTime()
 const timestampSelect = new Date(dynamicSelectedValue).getTime()
 const range = 7 * 24 * 60 * 60 * 1000
 return !(
 timestampSelect - range < timestampCurrent &&
 timestampCurrent < timestampSelect + range
 )
 }
 return false
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={(val, isCompleted) => {
 console.log(val, isCompleted)
 setDynamicSelectedValue(isCompleted ? '' : val)
 }}
 onClear={() => {
 setDynamicSelectedValue('')
 }}
 />

 <h2>动态限制日期时间范围</h2>
 <DatePicker
 type="daterange"
 style={{ width: 480 }}
 format="YYYY-MM-DD"
 showTime
 onChange={(date, dateStr) => {
 if (!date) {
 setStart([])
 }
 }}
 onSelect={(val, isCompleted, index = 0) => {
 console.log('select', val, isCompleted, index)
 start[index] = val
 setStart([...start])
 }}
 disabledDate={(val, view, index) => {
 // 如果还没有选择开始日期，不禁用任何日期
 if (!start[0]) {
 return false
 }

 const currentTime = new Date(val).getTime()
 const startTime = new Date(start[0]).getTime()
 const sixtyDays = 60 * 24 * 60 * 60 * 1000 // 60天的毫秒数

 // 如果是选择第二个日期
 if (index === 1) {
 // 禁用超过开始日期一周范围的日期
 return currentTime < startTime || currentTime > startTime + sixtyDays
 }

 // 如果是选择第一个日期且已经选择了结束日期
 if (index === 0 && start[1]) {
 const endTime = new Date(start[1]).getTime()
 // 禁用导致日期范围超过一周的日期
 return currentTime > endTime || endTime - currentTime > sixtyDays
 }

 return false
 }}
 />
 </div>
 </>
 )
}

```


### 带快捷选项

将常用的日期或时间提炼成快捷项，节省操作成本


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const Shortcut = () => {
 return (
 <> 
 <div className="shortcut__wrap">
 <h2>内置</h2>
 <DatePicker
 style={{ width: 565 }}
 type="daterange"
 shortcuts={['近一周', '近一月', '近三月', '近一年']}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>自定义选择范围</h2>
 <DatePicker
 style={{ width: 565 }}
 type="daterange"
 shortcuts={[
 {
 title: '近十天',
 range: [new Date().getTime() - 10 * 86400000, new Date()],
 },
 {
 title: '近二十天',
 range: [new Date().getTime() - 20 * 86400000, new Date()],
 },
 {
 title: '近三十天',
 range: [new Date().getTime() - 30 * 86400000, new Date()],
 },
 ]}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 日历面板


```tsx
import React, { useState } from 'react'
import DatePicker from '@hi-ui/date-picker'
import DayJs from 'dayjs' 
export const Lunar = () => {
 const [customValue, setCustomValue] = useState(new Date('2020/4/8'))

 return (
 <> 
 <div className="lunar__wrap">
 <h2>预置农历</h2>
 <DatePicker
 style={{ width: 338 }}
 altCalendarPreset="zh-CN"
 dateMarkPreset="zh-CN"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>自定义日期信息</h2>
 <DatePicker
 style={{ width: 338 }}
 value={customValue}
 altCalendar={[
 {
 date: '2020/4/8',
 content: '十周年',
 highlighted: true,
 },
 ]}
 dateMarkRender={(currentDate, today) => {
 // const date = DatePicker.format(currentDate, 'yyyy/M/D')
 // const yesterday = DatePicker.format(today - 86400000, 'yyyy/M/D')
 // const currentday = DatePicker.format(customValue, 'yyyy/M/D')

 const date = DayJs(currentDate).format('yyyy/M/D')
 const yesterday = DayJs(today - 86400000).format('yyyy/M/D')

 if (date === '2020/4/8') {
 return (
 <span style={{ color: '#ff6900', transform: 'scale(0.6)', fontWeight: 'bold' }}>
 米
 </span>
 )
 } else if (date === yesterday) {
 return (
 <span style={{ color: '#63bbd0', transform: 'scale(0.6)', fontWeight: 'bold' }}>
 昨
 </span>
 )
 } else {
 return ''
 }
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 setCustomValue(date as Date)
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
import DatePicker from '@hi-ui/date-picker' 
export const Size = () => {
 return (
 <> 
 <div className="date-picker-size__wrap">
 <h2>xs</h2>
 <DatePicker
 style={{ width: 240 }}
 size={'xs'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>sm</h2>
 <DatePicker
 style={{ width: 240 }}
 size={'sm'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>md</h2>
 <DatePicker
 style={{ width: 240 }}
 size={'md'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 <h2>lg</h2>
 <DatePicker
 style={{ width: 240 }}
 size={'lg'}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 />
 </div>
 </>
 )
}

```


### 自定义渲染页脚


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button' 
export const FooterRender = () => {
 return (
 <> 
 <div className="date-picker-footer-render__wrap">
 <h2>日期</h2>
 <DatePicker
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 footerRender={(action, onPick) => {
 return (
 <div
 style={{
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 width: '100%',
 }}
 >
 <Button
 type="secondary"
 appearance="link"
 onClick={() => onPick([new Date()], false)}
 >
 今天
 </Button>
 </div>
 )
 }}
 />
 <h2>日期时间</h2>
 <DatePicker
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 showTime
 onSelect={console.log}
 footerRender={(sureActionContent, onPick) => (
 <div
 style={{
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 width: '100%',
 }}
 >
 <Button
 type="secondary"
 appearance="link"
 onClick={() => onPick([new Date()], false)}
 >
 今天
 </Button>
 {sureActionContent}
 </div>
 )}
 />
 <h2>日期范围</h2>
 <DatePicker
 type="daterange"
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 footerRender={(action, onPick) => (
 <div
 style={{
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 width: '100%',
 }}
 >
 <Button
 type="secondary"
 appearance="link"
 onClick={() =>
 onPick([new Date(), new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)], false)
 }
 >
 未来一周
 </Button>
 </div>
 )}
 />
 <h2>日期时间范围</h2>
 <DatePicker
 style={{ width: 240 }}
 type="daterange"
 showTime
 footerRender={(sureActionContent, onPick) => (
 <div
 style={{
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 width: '100%',
 }}
 >
 <Button
 type="secondary"
 appearance="link"
 onClick={() =>
 onPick([new Date(), new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)], false)
 }
 >
 未来一周
 </Button>
 {sureActionContent}
 </div>
 )}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 />
 </div>
 </>
 )
}

```


### 自定义触发器


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker'
import Input from '@hi-ui/input' 
export const CustomRender = () => {
 return (
 <> 
 <div className="date-picker-custom-render__wrap">
 <h2>日期</h2>
 <DatePicker
 style={{ width: 240 }}
 defaultValue={new Date()}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 customRender={(data) => {
 const date = new Date(data[0] ?? new Date())
 const year = date.getFullYear()
 const month = (date.getMonth() + 1).toString().padStart(2, '0')
 const day = date.getDate().toString().padStart(2, '0')
 const formattedDate = `${year}-${month}-${day}`
 return <Input value={formattedDate} readOnly placeholder="请选择" />
 }}
 />
 <h2>日期范围</h2>
 <DatePicker
 style={{ width: 240 }}
 type="daterange"
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 defaultValue={[new Date(), new Date()]}
 customRender={(data) => {
 const date1 = new Date(data[0] ?? new Date())
 const date2 = new Date(data[1] ?? new Date())
 const year1 = date1.getFullYear()
 const year2 = date2.getFullYear()
 const month1 = (date1.getMonth() + 1).toString().padStart(2, '0')
 const month2 = (date2.getMonth() + 1).toString().padStart(2, '0')
 const day1 = date1.getDate().toString().padStart(2, '0')
 const day2 = date2.getDate().toString().padStart(2, '0')
 const formattedDateTime1 = `${year1}-${month1}-${day1}`
 const formattedDateTime2 = `${year2}-${month2}-${day2}`

 return (
 <Input
 value={`${formattedDateTime1} - ${formattedDateTime2}`}
 readOnly
 placeholder="请选择"
 />
 )
 }}
 />
 </div>
 </>
 )
}

```


### 前内置元素


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker'
import { AppStoreOutlined } from '@hi-ui/icons' 
export const Addon = () => {
 return (
 <div className="date-picker-addon__wrap">
 <h2>Addon</h2>
 <DatePicker
 style={{ width: 240 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 }}
 onSelect={console.log}
 prefix={<AppStoreOutlined />}
 />
 </div>
 )
}

```


### 选择确认

为 <code>true</code> 时，只有点击确认按钮才会触发值变化，暂不支持范围选择


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker' 
export const NeedConfirm = () => {
 return (
 <> 
 <div className="need-confirm__wrap">
 <h2>日期选择</h2>
 <DatePicker
 style={{ width: 240 }}
 needConfirm
 onChange={(date, dateStr) => console.log('onChange', date, dateStr)}
 onSelect={(date) => console.log('onSelect', date)}
 onConfirm={(date) => console.log('onConfirm', date)}
 />
 <h2>日期时间选择</h2>
 <DatePicker
 style={{ width: 240 }}
 defaultValue={new Date()}
 showTime
 needConfirm
 disabledHours={[2, 3, 4, 5, 6]}
 format="YYYY-MM-DD HH:mm:ss"
 onChange={(date, dateStr) => console.log('onChange', date, dateStr)}
 onSelect={(date) => console.log('onSelect', date)}
 onConfirm={(date) => console.log('onConfirm', date)}
 />
 </div>
 </>
 )
}

```


### 设置时区偏移

UTC时间偏移量，单位为小时。例如：东八区传入 8，西五区传入 -5


```tsx
import React from 'react'
import DatePicker from '@hi-ui/date-picker'
import moment from 'moment' 
export const UTCOffset = () => {
 const [value, setValue] = React.useState<Date | Date[] | null>(new Date())
 const [utcOffset] = React.useState<number>(1)

 return (
 <> 
 <div className="date-time__wrap">
 <h2>日期时间</h2>
 <DatePicker
 style={{ width: 240 }}
 value={value}
 showTime={true}
 utcOffset={utcOffset}
 format="YYYY-MM-DD HH:mm:ss"
 onSelect={(date) => {
 console.log('onSelect', date)
 }}
 onChange={(date, dateStr) => {
 console.log('onChange', date, dateStr)
 setValue(date)
 }}
 // 禁用小于今天的时间
 disabledDate={(current, view) => {
 // 获取当前系统时区
 const systemTimezone = moment().utcOffset()
 // 获取 UTC 时间
 const utcTime = moment().startOf('day').add(-systemTimezone, 'minutes').clone()
 // 获取对应时区的时间
 const offsetUtcToday = utcTime.add(utcOffset, 'hours').clone()
 const isDisabled = current < offsetUtcToday.toDate()
 // console.log(isDisabled, current, offsetUtcToday.toDate())

 return isDisabled
 }}
 />

 <p>系统时间：{value?.toLocaleString()}</p>
 <p>UTC时间：{(value as Date)?.toUTCString()}</p>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 DatePicker 各元素进行细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import DatePicker, { DatePickerSemanticName } from '@hi-ui/date-picker'
import Button from '@hi-ui/button' 
export const Semantic = () => {
 const [selected, setSelected] = useState<DatePickerSemanticName>()

 return (
 <> 
 <div className="date-picker-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <DatePicker
 style={{ width: 280 }}
 visible
 showTime
 type="daterange"
 // @ts-ignore
 overlay={{ flip: false }}
 classNames={{
 root: 'my-date-picker__root',
 popper: 'my-date-picker__popper',
 picker: 'my-date-picker__picker',
 pickerWrapper: 'my-date-picker__picker-wrapper',
 inputSelector: 'my-date-picker__input-selector',
 input: 'my-date-picker__input',
 triggerIcon: 'my-date-picker__trigger-icon',
 panel: 'my-date-picker__panel',
 footer: 'my-date-picker__footer',
 }}
 styles={{
 ...(selected
 ? { [selected]: { outline: '2px solid #ffbe0a', outlineOffset: 2 } }
 : {}),
 }}
 footerRender={(action, onPick) => {
 return (
 <div
 style={{
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 width: '100%',
 }}
 >
 <Button type="secondary" appearance="link">
 今天
 </Button>
 </div>
 )
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'inputSelector', description: '输入选区' },
 { title: 'triggerIcon', description: '右侧图标' },
 { title: 'panel', description: '日期面板' },
 { title: 'panelLeft', description: '面板左侧' },
 { title: 'panelHeader', description: '面板头部' },
 { title: 'calendar', description: '日历表格' },
 { title: 'calendarHead', description: '表头(周标题)' },
 { title: 'calendarCell', description: '日历单元格' },
 { title: 'panelTimeContainer', description: '时间容器' },
 { title: 'panelTimeHeader', description: '时间头部' },
 { title: 'panelTimeContent', description: '时间内容' },
 { title: 'footer', description: '页脚' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as DatePickerSemanticName)}
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

### DatePicker Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| type | 选择器类型 | DatePickerTypeEnum | "date" \| "daterange" \| "year" \| "month" \| "week" \| "quarter" \| "weekrange" \| "timeperiod" \| "yearrange" \| "monthrange" \| "quarterrange" | - |
| defaultValue | 默认显示的日期 | DatePickerValue \| DatePickerValue\[] | null \| string \| number \| Date \| DatePickerValue\[] | - |
| value | 日期 | DatePickerValue \| DatePickerValue\[] | null \| string \| number \| Date \| DatePickerValue\[] | - |
| minDate | 最小日期 | Date | - | - |
| maxDate | 最大日期 | Date | - | - |
| utcOffset | UTC时间偏移量，单位为小时。例如：东八区传入8，西五区传入-5 | number | - | - |
| disabled | 是否禁用 | boolean | true \| false | "false" |
| inputReadOnly | 设置输入框为只读 | boolean | true \| false | "false" |
| disabledDate | 不可选择的日期(返回true为不可选) | ((currentDate: Date, view: CalendarViewEnum, panelIndex?: number) => boolean) \| undefined | (currentDate: Date, view: CalendarViewEnum, panelIndex?: number \| undefined) => boolean | () => false |
| clearable | 是否可以清空 | boolean | true \| false | true |
| showTime | 是否在日期选择器中显示时间选择器，在使用时请注意 format 的设置。&#xA;传入对象时等价于开启时间选择，且可通过 \`defaultOpenValue\` 在未选择日期时指定时间列的默认展示（与 \`defaultPickerValue\` 独立，仅影响时间滚轮）。 | boolean \| { defaultOpenValue?: TimePickerValue \| TimePickerValue\[]; } \| undefined | false \| true \| { defaultOpenValue?: TimePickerValue \| TimePickerValue\[] \| undefined; } | false |
| timeInterval | 时间段的间隔，以分钟为单位 | number | - | 240 |
| format | 展示的日期格式，配置参考 \[moment.js]\(http\://momentjs.cn/docs/#/displaying/format/) | string \| ((date: Moment) => string) | string \| (date: Moment) => string | - |
| shortcuts | 快捷面板 | string\[] \| { title: string; range: (number \| Date)\[]; }\[] | string\[] \| { title: string; range: (number \| Date)\[]; }\[] | - |
| weekOffset | 周起始，默认周日做为第一列(3.3.0版本后，优化为根据中英文自动设置周起始) | number | - | "0" |
| hourStep | 小时步进 | number | - | 1 |
| minuteStep | 分钟步进 | number | - | 1 |
| secondStep | 秒钟步进 | number | - | 1 |
| placeholder | 输入框占位符 | string \| string\[] | string \| string\[] | - |
| altCalendar | 自定义日期中历法展示信息 | CalendarDataItem\[] | - | - |
| altCalendarPreset | 预置历法信息（支持中国农历和印度节假日） | DatePickerAltCalendarPresetEnum | "zh-CN" \| "id-ID" | - |
| dateMarkRender | 自定义日期的右上角标记 | ((currentDate: number, today: number) => ReactNode) | - | - |
| dateMarkPreset | 预置日期的右上角标记（休 \| 班） | string | - | - |
| disabledHours | 禁止选择的小时，仅在 showTime 开启时生效 | ((panel: TimePickerPanelType) => number\[]) \| number\[] | (panel: TimePickerPanelType) => number\[] \| number\[] | () => \[] |
| disabledMinutes | 禁止选择的分钟，仅在 showTime 开启时生效 | number\[] \| ((selectedHour: number, panel: TimePickerPanelType) => number\[]) | number\[] \| (selectedHour: number, panel: TimePickerPanelType) => number\[] | () => \[] |
| disabledSeconds | 禁止选择的秒数，仅在 showTime 开启时生效 | number\[] \| ((selectedHour: number, selectedMinute: number, panel: TimePickerPanelType) => number\[]) | number\[] \| (selectedHour: number, selectedMinute: number, panel: TimePickerPanelType) => number\[] | () => \[] |
| onSelect | 选择日期的回调函数，(data: 选中的 moment 日期对象, isCompleted: 是否选择完成，仅在范围选择下有效，panelIndex: 当前操作面板索引) => void | ((data: Date, isCompleted: boolean, panelIndex?: number) => void) \| undefined | (data: Date, isCompleted: boolean, panelIndex?: number \| undefined) => void | - |
| onChange | 选择后的回调，(date: 选中的日期，dateStr: 选中的日期字符串) => void | ((date: Date \| Date\[] \| null, dateStr: string \| string\[] \| null) => void) | (date: Date \| Date\[] \| null, dateStr: string \| string\[] \| null) => void | - |
| onPanelChange | 日期面板改变时的回调函数 | ((data: Date) => void) | - | - |
| appearance | 不同 UI 外观 | "line" \| "unset" \| "filled" \| "borderless" \| "contained" | "line" \| "unset" \| "filled" \| "borderless" \| "contained" | "line" |
| label | 设置输入框 label 内容，仅在 appearance 为 contained 时生效 | ReactNode | - | - |
| size | 不同尺寸 | HiBaseSizeEnum | "xs" \| "sm" \| "md" \| "lg" | "'md'" |
| overlay | 自定义控制弹出层 popper | PopperOverlayProps | - | - |
| invalid | 是否非法 | boolean | true \| false | false |
| onOpen | 面板打开时回调 | (() => void) | - | - |
| onClose | 面板关闭时回调 | (() => void) | - | - |
| onClear | 清空时回调 | (() => void) | - | - |
| cellRender | 自定义单元格内容 | ((colInfo: CalendarColInfo, date: Moment) => ReactNode) | - | - |
| footerRender | 自定义渲染页脚 | ((actionContents: ReactElement\<any, string \| JSXElementConstructor\<any>>, onPick: (dates: (Date \| Moment \| null)\[], isShowPanel?: boolean) => void) => ReactNode) \| undefined | (actionContents: ReactElement\<any, string \| JSXElementConstructor\<any>>, onPick: (dates: (Date \| Moment \| null)\[], isShowPanel?: boolean \| undefined) => void) => ReactNode | - |
| strideSelectMode | 跨月选择模式&#xA;'auto' 自动切换模式，跨月选择时自动切换到跨月的日期选择面板；&#xA;'fixed' 固定模式，不自动切换（仅周范围选择下生效） | "auto" \| "fixed" | "auto" \| "fixed" | "auto" |
| customRender | 自定义触发器 | ReactNode \| ((option: (Date)\[]) => ReactNode) | null \| string \| number \| false \| true \| {} \| ReactElement\<any, string \| JSXElementConstructor\<any>> \| ReactNodeArray \| ReactPortal \| (option: (Date \| undefined)\[]) => ReactNode | - |
| prefix | 选择框前置内容 | ReactNode | - | - |
| needConfirm | 是否需要确认按钮，为 \<code>false\</code> 时失去焦点即代表选择。日期时间范围选择默认为 \<code>true\</code> | boolean | true \| false | "false" |
| onConfirm | 点击确认按钮的回调 | ((date: Date \| Date\[]) => void) | (date: Date \| Date\[]) => void | - |
| visible | 是否显示日期选择器 | boolean | true \| false | - |
| defaultPickerValue | 默认面板显示的日期，当用户没有传入或选择日期时，选择面板基于此值来显示日期 | DatePickerValue \| DatePickerValue\[] | null \| string \| number \| Date \| DatePickerValue\[] | - |
| showIndicator | 是否展示指示器 | boolean | true \| false | true |
| showWeek | 是否展示周，仅在 type 为 date 或 daterange 时生效 | boolean | true \| false | - |
| classNames | | DatePickerSemanticClassNames | - | - |
| styles | | DatePickerSemanticStyles | - | - |


## Type

### DatePickerValue

> Date | string | number

### CalendarDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------- | ------------ | --------------- | ------------- | ------ |
| date | 日期 | DatePickerValue | - | - |
| content | 描述内容 | string | - | - |
| highlighted | 是否高亮展示 | boolean | true \| false | false |

## FAQ

### 输入框中出现日期显示异常

如出现选择日期后，在输入框中出现日期显示异常，或者日期格式和原来不同的话，请确认 format 属性的格式是否正确
