import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Popover from '../../../components/popover'
import Button from '../../../components/button'
import Overlay from '../../../components/overlay/Overlay'
const prefix = 'Popover-DemoOverlay'
const desc = '用于信息描述、辅助信息等'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Popover from '@hi-ui/hiui/es/popover'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      show:false
    }
    this.triggerRef = React.createRef();
    this.containerRef = React.createRef();
    console.log(Overlay)
  }
  render() {
    return (
      <div
      style={{height:'120px'}}
      ref={this.containerRef}
    >
    <button
        type="button"
        ref={this.triggerRef}
        onClick={()=>{
          this.setState({
            show:!this.state.show
          })
        }}
      >
        I am an Overlay target
      </button>
      <Overlay
        show={this.state.show}
        rootClose
        placement={'left'}
        onHide={()=>{
         console.log(123)
        }}
        container={this.containerRef}
        target={this.triggerRef}
      >
      {() => (
        <p>123</p>
      )}
    </Overlay>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Popover, Button, Overlay }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
