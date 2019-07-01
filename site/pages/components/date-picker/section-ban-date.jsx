import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import DatePicker from '../../../../components/date-picker'
const prefix = 'date-picker-date'
const code = `
import React from 'react'
import DatePicker from '@hiui/hiui/es/date-picker'\n
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
        minDate={new Date()}
        maxDate={new Date(2019, 4, 28)}
        onChange={(date) => {
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
