import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-normal'
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
          showLunar
          altCalendarPreset='PRCLunar'
          dataMarkPreset='PRCHoliday'
          value={this.state.date}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      </div>
    )
  }
}`
const DemoNormal = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} />
export default DemoNormal
