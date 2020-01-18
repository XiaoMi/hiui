import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Input from '../../../components/input'
const leftOptions = ['身份证', '手机号', '金额', '银行卡']
const prefix = 'input-type'
const desc = '在特定业务场景中使用'
const code = [{code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        type='id'
        style={{ width: 250 }}
        placeholder='请输入'
      />
    )
  }
}`,
opt: ['身份证']}, {code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        type='tel'
        style={{ width: 250 }}
        placeholder='请输入'
      />
    )
  }
}`,
opt: ['手机号']}, {code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        type='amount'
        style={{ width: 250 }}
        placeholder='请输入'
      />
    )
  }
}`,
opt: ['金额']}, {code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        type='card'
        style={{ width: 250 }}
        placeholder='请输入'
      />
    )
  }
}`,
opt: ['银行卡']}]

const DemoType = () => (
  <DocViewer
    leftOptions={leftOptions}
    code={code}
    desc={desc}
    scope={{ Input }}
    prefix={prefix}
  />
)
export default DemoType
