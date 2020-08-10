import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Input from '../../../components/input'
import Tooltip from '../../../components/tooltip'
const prefix = 'input-tooltip'
const desc = '结合 Tooltip 组件，实现一个数值输入框，方便内容超长时的全量展现。'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Input from '@hi-ui/hiui/es/input'\n
import Tooltip from '@hi-ui/hiui/es/tooltip'\n
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
      <Tooltip title={value ? value : "请输入" } style={{margin: '0 10px'}}>
      <Input
        value={value}
        style={{ width: 120 }}
        placeholder='请输入'
        onChange={(e)=>{
          this.setState({
            value: e.target.value
          })
        }}
      />
      </Tooltip>
    )
  }
}`

const DemoType = () => (
  <DocViewer
    code={code}
    desc={desc}
    scope={{ Input, Tooltip }}
    prefix={prefix}
  />
)
export default DemoType
