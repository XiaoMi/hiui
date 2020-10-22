import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Switch from '../../../components/switch'
import Icon from '../../../components/icon'
const desc = ''
const prefix = 'switch-ban'
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
    this.setState({checked: status})
  }
  render () {
    return (
      <div>
        <p>
          <Button onClick={() => {this.setState({disabled: !this.state.disabled})}}>切换禁用</Button>
          <Button onClick={() => {this.setState({checked: !this.state.checked})}}>切换开启</Button>
        </p >
        <Switch checked={this.state.checked} disabled={this.state.disabled} content={['开', '关']} onChange={this.onChange.bind(this)}/>
      </div>
    )
  }
}`

const DemoBan = () => (
  <DocViewer
    code={code}
    scope={{ Button, Switch, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBan
