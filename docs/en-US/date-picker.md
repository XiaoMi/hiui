## Datepicker


### Basic

:::demo

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
          console.log('Default', DatePicker.format(d, 'yyyy-MM-dd E'))
        }}
      />
      <span style={{color: 'red', fontSize: '14px', cursor: 'pointer', marginLeft:'5px'}} onClick={() => {this.setState({date: new Date()})}}>Reset</span>
    </div>
  )
}
```
:::


### Disabled

:::demo

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


### Disabled (Disable Date)

:::demo

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


### Week

:::demo


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


### Year

:::demo


```js
render () {
  return (
    <DatePicker
      type='year'
      onChange={(d) => {
        console.log('Select Year', d)
      }}
    />
  )
}
```
:::


### Month

:::demo

```js
render () {
  return (
    <DatePicker type='month'/>
  )
}
```
:::


### Range

:::demo

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
      <span style={{color: 'red', fontSize: '14px', cursor: 'pointer', marginLeft:'5px'}} onClick={() => {this.setState({rangeDate: ''})}}>Reset</span>
    </div>
  )
}
```
:::


### Range (Disable Date)

:::demo

```js
render () {
  return (
    <DatePicker 
      type='daterange'
      minDate={new Date()}
      maxDate={new Date(2019, 4, 28)}
    />
  )
}
```
:::


### Week Range

:::demo

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


### Date Range（shortcuts）

:::demo

```js
render () {
  return (
    <DatePicker 
      type='daterange'
      shortcuts={['The most recent week','The most recent month','The last three months','The most recent year']}
      onChange={(d) => {console.log(d)}}
    />
  )
}
```
:::


### Date + Time

:::demo

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


### Date + Time (Range Select)

:::demo

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


### Open in Modal

:::demo

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
  console.log("Customer Event")
}
render () {
  return (
    <div style={{width:'100%'}}>
      <Button type="primary" onClick={() => this.setState({show: true})}>Open in Modal</Button>
     {
        this.state.show && <Modal 
        title="Tips"
        show={this.state.show}
        backDrop={true}
        onConfirm={()=>{console.log('customer')}}
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

| Attribute | Description | Type | Options | Default |
| --------   | -----  | ----  |    ----  |   ----  |
| type | type  | string   | date:normal <br/> daterange: date range<br/> year: year<br/>  month: month<br/> week: week<br/> weekrange: week range |  date |
| value |  Default date | Date/String/Object/Undefined | null | null |
| minDate | minDate | date | null | null |
| maxDate | maxDate | date | null | null |
| disabled | disabled | boolean | true false | false |
| showTime |  showTime | boolean | true false | false |
| shortcuts | shortcuts | array | 近一周, 近一月, 近三月, 近一年 | null |
| weekOffset | weekOffset<br/> |  number | 0/1 | 0 |

### Datepicker Events

| Attribute      | Description   | Callback param | 
| -------- | ----- | ---- | 
| onChange | Callback | (date: Date) | Date | {start: Date,end: Date}

### Datepicker API

|  Method | Description |  Usage
| -------- | ----- | ---- 
| format | Format Date | DatePicker.format(date, format) <br/> date: [Date] Date format: [String] Format String <br/> 

### format

| Format |          Description/(length)           |         Example          |         Result       |
| :--: | :------------------------------: | ------------------- | ------------------- |
|  y   |             year/(1~4)             |        yyyy         |2018|
|  M   |             month/(1~2)             |       yyyy-MM       |2018-06|
|  d   |             day/(1~2)             |       yyyy-dd        |2018-29|
|  h   |          12-hour/(1~2)          |       dd : hh       |29:03|
|  H   |          24-hour/(1~2)          |       dd : HH       |29:15|
|  m   |            minute/(1~2)            |      dd hh-mm       |29 15-30|
|  s   |             second/(1~2)             | yyyy-MM-dd hh:mm:ss |2018-06-29 03:30:00|
|  S   |             millisecond/(1)             |  MM-dd: HH:mm:ss:S  |06-29: 15:30:00|
|  E   | week/(1~3) |     yy-MM-dd EE     |18-06-29 18|
|  q   |            quarter/(1~2)            |      yyyy-MM q      |2018-06 2|

