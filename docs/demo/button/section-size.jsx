import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-size'
const leftOptions = ['大按钮', '默认按钮', '小按钮']
const rightOptions = ['正常', '禁用']
const desc = '不同的展示区域选择相应尺寸的按钮'
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
      <Button type="primary" size="default">提交</Button>
    )
  }
}`,
    opt: ['默认按钮', '正常']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" size="small">确认</Button>
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
      <Button type="primary" size="default" disabled>提交</Button>
    )
  }
}`,
    opt: ['默认按钮', '禁用']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" size="small" disabled>确认</Button>
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
    desc={desc}
  />
)
export default DemoAux
