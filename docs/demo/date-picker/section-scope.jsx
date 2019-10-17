import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-scope'
const code = `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      rangeDate: {start: new Date(), end: new Date()} // 或 rangeDate: new Date()
    }
  }
  render () {
    return (
      <div>
        <DatePicker
          type='daterange'
          format='yyyy-MM-dd'
          defaultValue={this.state.rangeDate}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`
const DemoScopeBan = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
  />
)
export default DemoScopeBan
