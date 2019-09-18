import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'time-picker-base'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/time-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
        <div style={{margin: '10px'}}>
          <p>时间选择</p>
          <TimePicker
            value={new Date()}
            format="HH:mm"
            hourStep={1}
            minuteStep={1}
            secondStep={1}
            disabledHours={() => {
              return [1, 2, 3]
            }}
            disabledMinutes={(sHour) => {
              return [1, 2, 3]
            }}
            onChange={(date, dateString) => console.log('时间', date, dateString)}
          />
        </div>
        <div style={{margin: '10px'}}>
          <p>时间范围选择</p>
          <TimePicker
            value={{start: new Date(), end: new Date()}}
            type="timerange"
            format="HH:mm"
            onChange={date => console.log('时间范围', date)}
          />
        </div>
      </div>
    )
  }
}`
const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ TimePicker }}
    prefix={prefix}
  />
)
export default DemoBase
