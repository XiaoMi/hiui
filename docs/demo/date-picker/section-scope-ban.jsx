import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-scope-ban'
const code = `
import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        placeholder={['开始日期', '结束日期']}
        type='daterange'
        minDate={new Date()}
        maxDate={new Date(2019, 4, 28)}
      />
    )
  }
}`
const DemoScope = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
  />
)
export default DemoScope
