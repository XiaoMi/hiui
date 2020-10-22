import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-range'
const desc = '选择时间范围，可与日期搭配使用，也可用于展示当天时间范围'
const code = `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
        defaultValue={{start: new Date(), end: new Date()}}
        type="timerange"
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
  />
)
export default DemoBase
