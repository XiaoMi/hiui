import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
const prefix = 'input-textarea'
const desc = '可获取有限长度的字符串，在限定宽度里折行显示'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Input
          type="textarea"
          placeholder="请输入"
        />
      </div>
    )
  } 
}`
const DemoTextarea = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoTextarea
