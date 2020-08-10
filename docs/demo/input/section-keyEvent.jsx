import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Input from '../../../components/input'
const prefix = 'input-keyEvent'
const desc = '调用键盘事件,方便操作'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor(){
    super()
    this.state = {
      value:''
    }
  }
  render() {
    const {value} = this.state
    return (
      <Input
        value={value}
        style={{ width: 240 }}
        placeholder='请输入'
        onKeyUp={(e)=>{
          const evt = window.event || e
          console.log('keyboard key:',evt.key, 'keyCode:',evt.keyCode)
        }}
        onChange={(e)=>{
          this.setState({
            value: e.target.value
          })
        }}
      />
    )
  }
}`

const DemoType = () => (
  <DocViewer code={code} desc={desc} scope={{ Input }} prefix={prefix} />
)
export default DemoType
