import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Switch from '../../../components/switch'
import Icon from '../../../components/icon'
const prefix = 'switch-base'
const code = `
import React from 'react'
import Switch from '@hi-ui/hiui/es/switch'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: true,
      disabled: true
    }
  }
  onChange (status) {
    console.log(status)
  }
  render () {
    return (
      <div>
        <p>默认</p>
        <Switch />
        <p>自定义内容</p>
        <Switch content={['ON', 'OFF']} onChange={() => console.log('change')}/>
        <Switch content={[<Icon name='check' />, <Icon name='close' />]} onClick={() => {return false}}/>
        <p>禁用状态</p>
        <p>
          <Button onClick={() => {this.setState({disabled: !this.state.disabled})}}>切换禁用</Button>
          <Button onClick={() => {this.setState({checked: !this.state.checked})}}>切换开启</Button>
        </p>
        <Switch checked={this.state.checked} disabled={this.state.disabled} content={['开', '关']} onChange={this.onChange.bind(this)}/>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Button, Switch, Icon }}
    prefix={prefix}
  />
)
export default DemoBase
