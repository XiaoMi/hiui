import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-aux'
const desc =
  '图标能够明确表达按钮的动作含义，成组使用，与文字搭配，突出按钮的重要性'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" icon='plus'>创建客户</Button>
        <Button type="line" icon='edit'> 编辑</Button>
        <Button type="line" icon="plus" />
        <Button type="success" icon="play" />
        <Button type="danger" icon="delete" />
      </React.Fragment>
    )
  }
}`

const DemoAux = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
export default DemoAux
