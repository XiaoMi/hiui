import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-date'
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
        onChange={(date) => {
          console.log(date)
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
  />
)
export default DemoBanDate
