## 日期选择器

日期选择器


### 普通模式

:::demo

普通模式

```js
constructor() {
  super()
  this.state = {
    date: new Date(),
  }
}
render () {
  return (
    <div>
      <DatePicker
        value={this.state.date}
        onChange={(d) => {
          console.log('含有默认值是，会触发一次', DatePicker.format(d, 'yyyy-MM-dd E'))
        }}
      />
      <span style={{color: 'red', fontSize: '14px', cursor: 'pointer', marginLeft:'5px'}} onClick={() => {this.setState({date: new Date()})}}>重置</span>
    </div>
  )
}
```
:::


### 禁用模式（全部禁用）

:::demo

禁用模式（全部禁用）

```js
render () {
  return (
    <DatePicker
      value={new Date()}
      disabled={true}
    />
  )
}
```
:::


### 禁用模式（禁用日期）

:::demo

禁用日期

```js
render () {
  return (
    <DatePicker
      minDate={new Date()}
      maxDate={new Date(2018, 4, 28)}
      onChange={(d) => {
        console.log(d)
      }}
    />
  )
}
```
:::


### 周选择

:::demo

周选择

```js
render () {
  return (
    <DatePicker
      type='week' 
      onChange={(d) => {
        console.log(d)
      }}
    />
  )
}
```
:::


### 年选择

:::demo

年选择

```js
render () {
  return (
    <DatePicker
      type='year'
      onChange={(d) => {
        console.log('选择年份', d)
      }}
    />
  )
}
```
:::


### 月选择

:::demo

月选择

```js
render () {
  return (
    <DatePicker type='month'/>
  )
}
```
:::


### 范围选择

:::demo

范围选择

```js
constructor() {
  super()
  this.state = {
    rangeDate: {start: new Date(), end: new Date()} // 或 rangeDate: new Date()
  }
}
render () {
  return (
    <div>
      <DatePicker 
        type='daterange'
        value={this.state.rangeDate}
        onChange={(d) => {
          console.log(d)
        }}
      />
      <span style={{color: 'red', fontSize: '14px', cursor: 'pointer', marginLeft:'5px'}} onClick={() => {this.setState({rangeDate: ''})}}>重置</span>
    </div>
  )
}
```
:::


### 范围选择（禁选日期）

:::demo

范围选择（禁选日期）

```js
render () {
  return (
    <DatePicker 
      type='daterange'
      minDate={new Date()}
      maxDate={new Date(2018, 4, 28)}
    />
  )
}
```
:::


### 周范围选择

:::demo

周范围选择

```js
render () {
  return (
    <DatePicker 
      value=''
      type='weekrange'
      onChange={(d) => {
        console.log(d)
      }}
    />
  )
}
```
:::


### 日期选范围选择（快捷选项）

:::demo

日期选范围选择

```js
render () {
  return (
    <DatePicker 
      type='daterange'
      shortcuts={['近一周','近一月','近三月','近一年']}
      onChange={(d) => {console.log(d)}}
    />
  )
}
```
:::


### 日期 + 时间

:::demo

日期 + 时间

```js
render () {
  return (
    <DatePicker
      value={new Date()}
      showTime={true}
      onChange={(d) => {console.log('sec', d)}}
    />
  )
}
```
:::


### 日期 + 时间（范围选择）

:::demo

日期 + 时间（范围选择）

```js
render () {
  return (
    <DatePicker
      type='daterange'
      value={new Date()}
      showTime={true}
      onChange={(d) => {console.log('last', d)}}
    />
  )
}
```
:::


### 嵌入 Modal

:::demo

嵌入 Modal

```js
constructor () {
  super()
  this.state = {
    show: false,
    date: new Date(),
    rangeDate: {start: new Date(), end: new Date()}
  }
}
cancelEvent () {
  this.setState({
    show: false
  })
  console.log("自定义关闭事件")
}
render () {
  return (
    <div style={{width:'100%'}}>
      <Button type="primary" onClick={() => this.setState({show: true})}>在 Modal 中打开</Button>
     {
        this.state.show && <Modal 
        title="提示消息"
        show={this.state.show}
        backDrop={true}
        onConfirm={()=>{console.log('自定义确定事件')}}
        onCancel={this.cancelEvent.bind(this)}
      >
        <DatePicker
          value={this.state.date}
          onChange={(d) => {
            console.log(DatePicker.format(d, 'yyyy-MM E'))
          }}
        />
        <DatePicker 
          type='daterange'
          value={this.state.rangeDate}
          onChange={(d) => {
            console.log(d)
          }}
        />
      </Modal>
     }
    </div>
  )
}
```
:::


### Datepicker Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| type | 选择器类型  | string   | date 普通日期 <br/> daterange 日期范围<br/> year 年份<br/>  month 月份<br/> week 周<br/> weekrange 周范围 |  date |
| value |  默认显示的日期 | Date/String/Object/Undefined | 可选值参见示例<br/> 用于范围选择时，可传入单个 Date 对象或{start: Date, end: Date}<br/> 可传入空字符串，效果与不传入一致 | null |
| minDate | 最小日期 | date | null | null |
| maxDate | 最大日期 | date | null | null |
| disabled | 是否禁用输入框 | boolean | true false | false |
| showTime |  是否在日期选择器中显示时间选择器 | boolean | true false | false |
| shortcuts | 快捷面板 | array | 近一周, 近一月, 近三月, 近一年 | null |
| weekOffset | 周起始<br/>默认周日做为第一列 |  number | 0/1 | 0 |

### Datepicker Events

| 参数      | 说明   | 回调参数 | 说明 |
| -------- | ----- | ---- | ----  |
| onChange | 选中回调函数 | (date: Date) | 普通时间选择返回 date 格式数据、范围选择返回对象{start:开始时间,end:结束时间} |

### Datepicker API

|  方法 | 说明 |  用法
| -------- | ----- | ---- 
| format | 格式化时间 | DatePicker.format(date, format) <br/> date: [Date] 日期对象 format: [String] 格式化字符串 <br/> 

### format

| 格式 |          说明/（长度）           |         示例          |         结果       |
| :--: | :------------------------------: | ------------------- | ------------------- |
|  y   |             年/(1~4)             |        yyyy         |2018|
|  M   |             月/(1~2)             |       yyyy-MM       |2018-06|
|  d   |             日/(1~2)             |       yyyy-dd        |2018-29|
|  h   |          12小时制/(1~2)          |       dd : hh       |29:03|
|  H   |          24小时制/(1~2)          |       dd : HH       |29:15|
|  m   |            分钟/(1~2)            |      dd hh-mm       |29 15-30|
|  s   |             秒/(1~2)             | yyyy-MM-dd hh:mm:ss |2018-06-29 03:30:00|
|  S   |             毫秒/(1)             |  MM-dd: HH:mm:ss:S  |06-29: 15:30:00|
|  E   | 周/(1~3) 分别对应 一/周一/星期一 |     yy-MM-dd EE     |18-06-29 18|
|  q   |            季度/(1~2)            |      yyyy-MM q      |2018-06 2|

