import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Counter from '../../../components/counter'
const prefix = 'progress-active'
const code = `
import React from 'react'
import Progress from '@hiui/hiui/es/select'
import Counter from '@hiui/hiui/es/counter'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      percent: 10
    }
  }

  render() {
    return (
      <div>
        <Progress percent={this.state.percent} size='large' />
        <br/>
        <Counter
            value={this.state.percent}
            step={10}
            min={0}
            max={100}
            onChange={(e,percent) => this.setState({percent})}
          />
      </div>
    )
  }
}`
const DemoActive = () => <DocViewer code={code} scope={{ Progress, Counter }} prefix={prefix} />
export default DemoActive
