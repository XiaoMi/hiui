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
    <div style={{display:'flex', flexWrap: 'wrap'}}>
      <DatePicker
        value={new Date}
        onChange={(d) => {
          console.log('value 为 Date 实例', DatePicker.format(d, 'YYYY-MM-DD E'))
        }}
      />
    </div>
  )
}
```
:::


### 禁用模式

:::demo

禁用模式（全部禁用）

```js
render () {
  return (
    <DatePicker
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
constructor () {
  super()
  this.state = {
    date: new Date()
  }
}
render () {
  return (
    <DatePicker
      value={this.state.date}
      minDate={new Date()}
      maxDate={new Date(2019, 4, 28)}
      onChange={(date) => {
        this.setState({date})
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
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
     <Row gutter={true}>
        <Col span={6}>
          <p>周一起始</p>
          <DatePicker
            type='week' 
            weekOffset={1}
            onChange={(d) => {
              console.log('周选择', d)
            }}
          />
        </Col>
        <Col span={6}>
          <p>周日起始</p>
          <DatePicker
            type='week' 
            onChange={(d) => {
              console.log('周选择', d)
            }}
          />
        </Col>
      </Row>
    </div>
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
    <DatePicker type='month'  onChange={(d) => {
        console.log('选择月份', d)
      }}/>
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
        format='YYYY-MM-DD HH:mm:ss'
        // value={this.state.rangeDate}
        value={new Date()}
        onChange={(d) => {
          console.log(1, d)
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
      placeholder={['开始日期', '结束日期']}
      type='daterange'
      minDate={new Date()}
      maxDate={new Date(2019, 4, 28)}
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
      value={new Date()}
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

### 日期/时间段选择

:::demo

日期 + 时间

```js
render () {
  return (
    <DatePicker
      type="timeperiod"
      value={new Date()}
      onChange={(d) => {console.log('sec', d)}}
    />
  )
}
```
:::

### 日期/时间（范围选择）

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
            console.log(DatePicker.format(d, 'YYYY-MM E'))
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
| type | 选择器类型  | String   | date 普通日期 <br/> daterange 日期范围<br/> year 年份<br/>  month 月份<br/> week 周<br/> weekrange 周范围 <br/> timeperiod 时间段（1.5新增） |  date |
| value |  默认显示的日期 | Date\|String\|Number\|<br/>Object\|Undefined\|Null | -- | null |
| minDate | 最小日期 | Date | null | null |
| maxDate | 最大日期 | Date | null | null |
| disabled | 是否禁用输入框 | Boolean | true \| false | false |
| showTime |  是否在日期选择器中显示时间选择器 | Boolean | true \| false | false |
| shortcuts | 快捷面板 | Array | 近一周, 近一月, 近三月, 近一年 | null |
| weekOffset | 周起始<br/>默认周日做为第一列 |  Number | 0/1 | 0 |
| placeholder |  自定义占位符<br/>数组用于范围日期 |  String \| Array | - | - |

### Datepicker Events

| 参数      | 说明   | 回调参数 | 说明 |
| -------- | ----- | ---- | ----  |
| onChange | 选中回调函数 | (date: Date) | 普通时间选择返回 date 格式数据、范围选择返回对象{start:开始时间,end:结束时间} |

### Datepicker API

|  方法 | 说明 |  用法
| -------- | ----- | ---- 
| format | 格式化时间 | DatePicker.format(date, format) <br/> date: [Date] 日期对象 format: [String] 格式化字符串 <br/> 

### format

| 单位        | 字符 | 示例                             |
| ----------- | ---- | -------------------------------- |
| 月          | M    | 1, 2, ..., 12                    |
|    &nbsp;   | Mo   | 1st, 2nd, ..., 12th              |
|    &nbsp;   | MM   | 01, 02, ..., 12                  |
|    &nbsp;   | MMM  | Jan, Feb, ..., Dec               |
|    &nbsp;   | MMMM | January, February, ..., December |
| 季度        | Q    | 1, 2, 3, 4                       |
|    &nbsp;   | Qo   | 1st, 2nd, 3rd, 4th               |
| 天/月       | D    | 1, 2, ..., 31                    |
|    &nbsp;   | Do   | 1st, 2nd, ..., 31st              |
|    &nbsp;   | DD   | 01, 02, ..., 31                  |
| 天/年       | DDD  | 1, 2, ..., 366                   |
|    &nbsp;   | DDDo | 1st, 2nd, ..., 366th             |
|    &nbsp;   | DDDD | 001, 002, ..., 366               |
| 天/周       | d    | 0, 1, ..., 6                     |
|    &nbsp;   | do   | 0th, 1st, ..., 6th               |
|    &nbsp;   | dd   | Su, Mo, ..., Sa                  |
|    &nbsp;   | ddd  | Sun, Mon, ..., Sat               |
|    &nbsp;   | dddd | Sunday, Monday, ..., Saturday    |
| 年          | YY   | 00, 01, ..., 99                  |
|    &nbsp;   | YYYY | 1900, 1901, ..., 2099            |
| 上午/下午   | A    | AM, PM                           |
|    &nbsp;   | a    | am, pm                           |
|    &nbsp;   | aa   | a.m., p.m.                       |
| 小时        | H    | 0, 1, ... 23                     |
|    &nbsp;   | HH   | 00, 01, ... 23                   |
|    &nbsp;   | h    | 1, 2, ..., 12                    |
|    &nbsp;   | hh   | 01, 02, ..., 12                  |
| 分钟        | m    | 0, 1, ..., 59                    |
|    &nbsp;   | mm   | 00, 01, ..., 59                  |
| 秒          | s    | 0, 1, ..., 59                    |
|    &nbsp;   | ss   | 00, 01, ..., 59                  |
| 秒（1/10）  | S    | 0, 1, ..., 9                     |
| 秒（1/100） | SS   | 00, 01, ..., 99                  |
| 毫秒        | SSS  | 000, 001, ..., 999               |
| 毫秒时间戳  | x    | 512969520900                     |

