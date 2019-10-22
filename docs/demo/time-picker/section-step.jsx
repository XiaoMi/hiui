import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-step'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
        value={new Date()}
        format="HH:mm:ss"
        hourStep={2}
        minuteStep={10}
        secondStep={10}
        onChange={(date, dateString) => console.log('时间', date, dateString)}
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
