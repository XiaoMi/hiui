import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-date-time-scope'
const code = `
import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        type='daterange'
        value={new Date()}
        showTime={true}
        onChange={(d) => {console.log('last', d)}}
      />
    )
  }
}`

const DemoDateTimeScope = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} />
export default DemoDateTimeScope
