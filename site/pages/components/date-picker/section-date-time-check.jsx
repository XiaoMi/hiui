import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import DatePicker from '../../../../components/date-picker'
const prefix = 'date-picker-date-time-check'
const code = `
import React from 'react'
import DatePicker from '@hiui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        type="timeperiod"
        value={new Date()}
        onChange={(d) => {console.log('sec', d)}}
      />
    )
  }
}`

const DemoDateTimeCheck = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
  />
)
export default DemoDateTimeCheck
