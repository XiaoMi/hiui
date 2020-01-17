import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-normal'
const desc = '以天为粒度，展示“YYYYMMDD”'
const code = `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
    }
  }
  render () {
    return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
        <DatePicker
          value={this.state.date}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`
const DemoNormal = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} desc={desc} />
export default DemoNormal
