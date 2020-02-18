import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Counter from '../../../components/counter'
const prefix = 'progress-dash'
const desc = '设置组件和进度条的配合使用'
const code = `import React from 'react'
import Progress from '@hi-ui/hiui/es/progress'
import Counter from '@hi-ui/hiui/es/counter'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      percent: 10
    }
  }

  render() {
    return (
      <div style={{display:'flex',alignItems:'center'}}>
        <div style={{display:'inline-block',marginRight:'77px'}}>
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
    desc={desc}
  />
)
export default DemoDash
