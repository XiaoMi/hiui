import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'time-picker-base'
const code = `
import React from 'react'
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
            onChange={date => console.log('时间', date)}
          />
        </div>
        <div style={{margin: '10px'}}>
          <p>时间范围选择</p>
          <TimePicker
            value={new Date()}
            type="timerange"
            format="HH:mm"
            onChange={date => console.log('时间范围', date)}
          />
        </div>
      </div>
    )
  }
}`
const DemoBase = () => <DocViewer code={code} scope={{ TimePicker }} prefix={prefix} />
export default DemoBase
