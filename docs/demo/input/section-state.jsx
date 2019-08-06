import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-state'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        style={{ width: 250 }}
        placeholder='请输入'
        disabled
      />
    )
  }
}`
const DemoState = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input, Radio }}
    prefix={prefix}
  />
)
export default DemoState
