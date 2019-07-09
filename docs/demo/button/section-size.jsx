import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-size'
const leftOptions = ['大按钮', '小按钮']
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <Button type="primary" size="large">提交</Button>
    )
  }
}`,
    opt: ['大按钮', '正常']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" size="small">确认</Button>
        <Button type="line" size="small">取消</Button>
        <Button type="success" size="small" icon="plus">添加</Button>
        <Button type="line" size="small" icon="edit">编辑</Button>
        <Button type="danger" size="small" icon="delete">删除</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['小按钮', '正常']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <Button type="primary" size="large" disabled>提交</Button>
    )
  }
}`,
    opt: ['大按钮', '禁用']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" size="small" disabled>确认</Button>
        <Button type="line" size="small" disabled>取消</Button>
        <Button type="success" size="small" icon="plus" disabled>添加</Button>
        <Button type="line" size="small" icon="edit" disabled>编辑</Button>
        <Button type="danger" size="small" icon="delete" disabled>删除</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['小按钮', '禁用']
  }
]

const DemoAux = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    leftOptions={leftOptions}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoAux
