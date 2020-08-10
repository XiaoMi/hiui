import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Popover from '../../../components/popover'
import Button from '../../../components/button'
const prefix = 'Popover-mix'
const desc = '显示如何创建可悬停和单击的弹出窗口'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Popover from '@hi-ui/hiui/es/popover'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      hoverVisible: false,
      clickVisible: false
    }
  }
  render() {
    const {hoverVisible,clickVisible} = this.state
    const title = <span>Popover Title</span>
    const contentHover = (
      <div>
        <p>This is hover content.</p>
      </div>
    )
    const contentClick = (
      <div>
        <p>This is click content</p>
        <span 
          style={{
            color:'#4285f4',
            fontSize:'12px',
            cursor:'pointer',
            marginTop: '10px',
          }}
          onClick={()=>{
            this.setState({
              clickVisible: false,
            })
          }}
          >
          Close
        </span>
      </div>
    )
    
    return (
      <div>
        <Popover title={title} content={contentHover} style={{margin: '10px 10px'}} visible={hoverVisible}>
          <Popover title={title} content={contentClick} style={{margin: '10px 10px'}} visible={clickVisible}>
            <Button type="line" 
              onMouseEnter={()=>{
                this.setState({
                  hoverVisible: true,
                  clickVisible: false,
                })
              }}
              onMouseOut={()=>{
                this.setState({
                  hoverVisible: false,
                })
              }}
              onClick={()=>{
                this.setState({
                  hoverVisible: false,
                  clickVisible: !clickVisible,
                })
            }}
            > 
            Hover and click / 悬停并单击
            </Button>
          </Popover>
        </Popover>
       
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Popover, Button }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
