import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Drawer from '../../../components/drawer'
const prefix = 'drawer-btn'
const desc = '通过 footers 自定义底部的按钮，并执行对应自定义事件，通过 closeBtn 取消右上角关闭按钮'

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
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Drawer
          title="提示消息"
          closeBtn={false}
          visible={this.state.visible}
          onClose={this.cancelEvent.bind(this)}
          footer={<div style={{textAlign:'right'}}>
              <Button type="primary" key={0} onClick={() => console.log(1)}>确认</Button>
              <Button type="line" key={1} onClick={() => console.log(2)}>取消</Button>
            </div>
          }
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Drawer>

      </div>
    )
  }
}`
const DemoBtn = () => (
  <DocViewer code={code} scope={{ Button, Drawer }} prefix={prefix} desc={desc} />
)
export default DemoBtn
