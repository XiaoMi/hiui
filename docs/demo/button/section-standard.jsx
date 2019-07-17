import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-standard'
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary">突出按钮</Button>
        <Button type="primary" icon="plus">创建客户</Button>
        <Button type="line">普通按钮</Button>
        <Button type="line" icon="plus">新建</Button>
        <Button type="line" icon="synchronize" />
        <Button type="default">默认按钮</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['正常']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button disabled type="primary">突出按钮</Button>
        <Button disabled type="primary" icon="plus">创建客户</Button>
        <Button disabled type="line">普通按钮</Button>
        <Button disabled type="line" icon="plus">新建</Button>
        <Button disabled type="line" icon="synchronize" />
        <Button disabled type="default">默认按钮</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoStandard = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} rightOptions={rightOptions} />
)
export default DemoStandard
