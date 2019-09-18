import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'time-picker-base'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/time-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
        value={new Date()}
        format="HH:mm:ss"
        disabledHours={() => {
          return [1, 2, 3, 4, 5, 6]
        }}
        disabledMinutes={(selectedHour) => {
          console.log('hour:'+ selectedHour)
          if (selectedHour > 12) {
            return [1, 2, 3]
          }
        }}
        disabledSeconds={(selectedHour, selectedMinute) => {
          console.log('hour:'+ selectedHour, 'minute:'+selectedMinute)
          if (selectedHour > 12 && selectedMinute > 12) {
            return [30, 31, 32, 33, 34, 35]
          }
          return [1, 2, 3]
        }}
        onChange={(date, dateString) => console.log(date, dateString)}
      />
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
