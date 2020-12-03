import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-date-time'
const desc = '以时间点为粒度，展示“YYYY-MM-DD HH:mm:ss”'
const code = `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state={
      value: new Date()
    }
  }
  render () {
    return (
      <DatePicker
        value={this.state.value}
        showTime={true}
        format='YYYY-MM-DD HH:mm:ss'
        onChange={(date, dateStr) => { 
          console.log('onChange', date, dateStr) 
          this.setState({value: dateStr})
        }}
      />
    )
  }
}`

const DemoDateTime = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} desc={desc} />
export default DemoDateTime
