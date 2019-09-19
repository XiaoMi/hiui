import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-format'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/time-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <TimePicker
          value={new Date()}
          format="HH:mm:ss"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
        <TimePicker
          value={new Date()}
          format="HH:mm"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
        <TimePicker
          value={new Date()}
          format="HH"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
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
