import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Drawer from '../../../components/drawer'
import Radio from '../../../components/radio'
const desc = '设置抽屉拉出的方向'
const prefix = 'drawer-placement'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Drawer from '@hi-ui/hiui/es/drawer'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  cancelEvent () {
    this.setState({
      visible: false
    })
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Drawer
          title="提示消息"
          visible={this.state.visible}
          onClose={this.cancelEvent.bind(this)}
          placement="left"
        >
          <span>一些消息....</span><br/>
          <span>一些消息...</span><br/>
          <span>一些消息...</span>
        </Drawer>
      </div>
    )
  }
}`
const DemoPlacement = () => (
  <DocViewer code={code} scope={{ Button, Drawer, Radio }} prefix={prefix} desc={desc} />
)
export default DemoPlacement
