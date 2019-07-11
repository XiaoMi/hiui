import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Counter from '../../../components/counter'
const prefix = 'progress-dash'
const code = `
import React from 'react'
import Progress from '@hiui/hiui/es/progress'
import Counter from '@hiui/hiui/es/Counter'\n
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
        <div style={{display:'inline-block'}}>
          <Progress percent={this.state.percent} apperance='dashboard' radius={50}/>
        </div>
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
const DemoDash = () => (
  <DocViewer
    code={code}
    scope={{ Progress, Counter }}
    prefix={prefix}
  />
)
export default DemoDash
