import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
const prefix = 'input-textarea'

const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Input
          value=""
          type="textarea"
          placeholder="多行文本"
          style={{width: '540px', height: '300px'}}
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
  />
)
export default DemoTextarea
