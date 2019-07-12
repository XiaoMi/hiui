import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-scope'
const code = `
import React from 'react'
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
          format='YYYY-MM-DD HH:mm:ss'
          // value={this.state.rangeDate}
          value={new Date()}
          onChange={(d) => {
            console.log(1, d)
          }}
        />
        <span style={{color: 'red', fontSize: '14px', cursor: 'pointer', marginLeft:'5px'}} onClick={() => {this.setState({rangeDate: ''})}}>重置</span>
      </div>
    )
  }
}`
const DemoScopeBan = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} />
export default DemoScopeBan
