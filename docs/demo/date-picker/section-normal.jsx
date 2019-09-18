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
          value={this.state.date}
          onChange={(d) => {
            console.log('返回值', d)
          }}
        />
        <button onClick={() => {this.setState({date: new Date().getTime()+24*3560*1000*7})}}>Click</button>
      </div>
    )
  }
}`
const DemoNormal = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} />
export default DemoNormal
