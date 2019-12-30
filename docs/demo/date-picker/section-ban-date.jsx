import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-date'
const desc = '以天、周、月、年等粒度展示一个时间的范围'
const code = `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      date: new Date()
    }
  }
  render () {
    return (
      <DatePicker
        value={this.state.date}
        min={new Date()}
        max={new Date().getTime() + 30 * 24 * 60 * 60 * 1000}
        onChange={(date, dateStr) => {
          console.log(date, dateStr)
          this.setState({date})
        }}
      />
    )
  }
}`

const DemoBanDate = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBanDate
