import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-aux'
const rightOptions = ['正常', '禁用']
const desc =
  '辅助按钮用于对产品的开启、停止等操作，不同颜色对用户的警示作用不同。红色：停止等警示性操作；绿色：开启等操作'
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="success">通过</Button>
        <Button type="danger">驳回</Button>
        <Button type="success" icon="play" />
        <Button type="danger" icon="delete" />
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
        <Button type="success" disabled>通过</Button>
        <Button type="danger" disabled>驳回</Button>
        <Button type="success" icon="play" disabled />
        <Button type="danger" icon="delete" disabled />
      </React.Fragment>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoAux = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoAux
