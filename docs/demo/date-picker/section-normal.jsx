import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-normal'
const rightOptions = ['基础', '带农历']
const code = [
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
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
          value={this.state.date}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`,
    opt: ['基础']
  },
  {
    code:
  `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      value: new Date('2020/4/8')
    }
  }
  render () {
    return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
        <DatePicker
          value={this.state.value}
          altCalendarPreset='zh-CN'
          dateMarkPreset='zh-CN'
          altCalendar = {[
              {
                date:'2020/4/8',
                text:'十周年'
              },
          ]}
          dateMarkRender = {
              (currentDate,today) => {
                const date = DatePicker.format(currentDate, 'yyyy/M/D')
                const yesterday = DatePicker.format(today-86400000, 'yyyy/M/D')
                const currentday = DatePicker.format(this.state.value, 'yyyy/M/D')
                
                if(date === '2020/4/8'){
                    return (
                      <span style={{color: currentday === '2020/4/8' ? '#fff' : '#f63' }}>米</span> 
                    )
                } else if (date === yesterday){
                    return (
                      <span>昨</span>
                    )
                } else {
                    return null
                }
              }
          }
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
            this.setState({
              value: date
            })
          }}
        />
      </div>
    )
  }
}`,
    opt: ['带农历']
  }

]
const DemoNormal = () => <DocViewer code={code} rightOptions={rightOptions} scope={{ DatePicker }} prefix={prefix} />
export default DemoNormal
