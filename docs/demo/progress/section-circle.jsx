import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Counter from '../../../components/counter'
const prefix = 'progress-circle'

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
      <div>
        <div style={{display:'inline-block'}}>
          <Progress percent={this.state.percent} apperance='circle'/>
        </div>
        <div style={{display:'inline-block',marginLeft: '50px'}}>
          <Progress percent={this.state.percent} apperance='circle' type='warn' content={<i className='hi-icon icon-close' style={{fontSize: '18px'}}/>}/>
        </div>
        <div style={{display:'inline-block',marginLeft: '50px'}}>
          <Progress percent={this.state.percent} apperance='circle' type='error' content={<i className='hi-icon icon-alarm' style={{fontSize: '18px'}}/>}/>
        </div>
        <div style={{display:'inline-block',marginLeft: '50px'}}>
          <Progress percent={this.state.percent} apperance='circle' type='success' content={<i className='hi-icon icon-check' style={{fontSize: '18px'}}/>}/>
        </div>
        <div style={{display:'inline-block',marginLeft: '50px'}}>
          <Progress percent={this.state.percent} apperance='circle' type='success' radius={60} content={<i className='hi-icon icon-check' style={{fontSize: '25px'}}/>}/>
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
const DemoCircle = () => (
  <DocViewer
    code={code}
    scope={{ Progress, Counter }}
    prefix={prefix}
  />
)
export default DemoCircle
