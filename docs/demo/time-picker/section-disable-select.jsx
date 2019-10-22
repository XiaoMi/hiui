import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-disable-select'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
        value={new Date()}
        format="HH:mm:ss"
        disabledHours={[2, 3, 4, 5, 6]}
        disabledMinutes={(selectedHour) => {
          if (selectedHour > 12) {
            const arr = []
            for (let i=0; i<12; i++) {
              arr.push(i)
            }
            return arr
          }
        }}
        disabledSeconds={(selectedHour, selectedMinute) => {
          if (selectedHour > 12 && selectedMinute > 12) {
            return [30, 31, 32, 33, 34, 35]
          }
          return [0, 1, 2, 3]
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
