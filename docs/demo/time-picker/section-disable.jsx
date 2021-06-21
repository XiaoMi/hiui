import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-disable'
const desc = '自定义禁选的时、分、秒数据'
const code = `import React from 'react'
    import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
    class Demo extends React.Component {
      render() {
        return (
          <TimePicker
            defaultValue={new Date()}
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
    desc={desc}
    rightOptions={[]}
  />
)
export default DemoBase
