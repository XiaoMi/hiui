import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Icon from '../../../components/icon'
import Counter from '../../../components/counter'
const prefix = 'progress-operate'
const desc = '结合其它组件实现特殊应用场景'
const code = `import React from 'react'
import Progress from '@hi-ui/hiui/es/progress'
import Counter from '@hi-ui/hiui/es/counter'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      percent: 0,
      status: 'init',
      barStatus: 'primary'
    }
    this.changeEvent = this.changeEvent.bind(this)
    this.closeEvent = this.closeEvent.bind(this)
    this.changeInterval = null
  }

  closeEvent() {
    window.clearInterval(this.changeInterval)
    this.setState({
      status: 'init',
      percent: 0
    })
  }
  changeEvent() {
    const currentStatus = this.state.status
    this.setState({
      status: currentStatus === 'changing' ? 'pause' : 'changing'
    })
    if (currentStatus === 'changing') {
      window.clearInterval(this.changeInterval)
      return
    }
    this.changeInterval = window.setInterval(() => {
      const nVal = this.state.percent + 10
      this.setState({
        percent:nVal
      })
      if (nVal === 100) {
        this.setState({
          status: 'done',
          barStatus: 'success'
        })
        window.clearInterval(this.changeInterval)
      }
    }, 500)
  }

  render() {
    const {status: currentStatus, barStatus} = this.state
    return (
      <div style={{display:'flex',alignItems:'center'}}>
        <Progress percent={this.state.percent} size='large' type={barStatus}/>
        <div style={{marginLeft: 28}}>
          {
            currentStatus === 'done' ? 
            <Icon name='check' style={{color: '#1da653'}}/> :
            <React.Fragment>
              <Icon name={currentStatus === 'changing' ? 'pause' : 'play'} style={{cursor: 'pointer'}} onClick={this.changeEvent}/>
              <Icon name='close' style={{cursor: 'pointer', display: (currentStatus !== 'init' && currentStatus !== 'done') ? 'inline-block' : 'none'}} onClick={this.closeEvent}/>
            </React.Fragment>
          }
          
        </div>
      </div>
    )
  }
}`
const DemoDash = () => (
  <DocViewer
    code={code}
    scope={{ Progress, Counter, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoDash
