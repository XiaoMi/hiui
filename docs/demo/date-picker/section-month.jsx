import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-month'
const code = `
import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker type='month'  onChange={(d) => {
          console.log('选择月份', d)
        }}/>
    )
  }
}`
const DemoMonth = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
  />
)
export default DemoMonth
