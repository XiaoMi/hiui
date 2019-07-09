import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-group'
const desc = '注意：按钮组中每个按钮应触发一个独立动作。如果是一组关联的选项，则应该使用按钮模式的单选按钮。'
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <Button.Group>
        <Button type="default">固定</Button>
        <Button type="default">高亮</Button>
        <Button type="default">求和</Button>
        <Button type="default">求平均值</Button>
        <Button type="default">删除</Button>
      </Button.Group>
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
      <Button.Group>
        <Button type="default">固定</Button>
        <Button type="default" disabled>高亮</Button>
        <Button type="default">求和</Button>
        <Button type="default">求平均值</Button>
        <Button type="default" disabled>删除</Button>
      </Button.Group>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoGroup = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoGroup
