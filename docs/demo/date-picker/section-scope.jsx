import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-scope'
const desc = '以天、周、月、年等粒度展示一个时间的范围'
const rightOptions = ['日期', '年份', '月份', '周', '日期时间', '动态限制日期范围']
const code = [
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
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
          format='yyyy-MM-dd'
          defaultValue={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['日期']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      rangeDate: {start: new Date('2020'), end: new Date('2030')} // 或 rangeDate: new Date()
    }
  }
  render () {
    return (
      <div>
        <DatePicker
          type='yearrange'
          defaultValue={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['年份']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      rangeDate: {start: new Date(2020, 9), end: new Date(2030, 10)} // 或 rangeDate: new Date()
    }
  }
  render () {
    return (
      <div>
        <DatePicker
          type='monthrange'
          defaultValue={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['月份']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
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
          type='weekrange'
          defaultValue={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['周']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
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
          type="timeperiod"
          timeInterval={30}
          value={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['日期时间']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state={
      selectDate: ''
    }
  }
  render () {
    const { selectDate } = this.state
    return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
        <DatePicker
          type='daterange'
          disabledDate={(val)=>{
            if(selectDate){
              const timestampCurrent = new Date(val).getTime()
              const timestampSelect = new Date(selectDate).getTime()
              const range = 7 * 24 * 60 * 60 * 1000
              return !(timestampSelect - range < timestampCurrent && timestampCurrent < timestampSelect + range)
            }
            return false
          }}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
          onSelect={(val, isCompleted)=>{
            console.log(val, isCompleted)
            this.setState({
              selectDate: isCompleted ? '' : val
            })
          }}
        />
      </div>
    )
  }
}`,
    opt: ['动态限制日期范围']
  }
]
const DemoScopeBan = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoScopeBan
