import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-standard'
const desc = [
  '主要按钮：主操作按钮，对用户有强烈的引导作用。',
  '普通按钮：次级操作按钮，表示一般性动作，不具备较强的引导性。',
  '安全按钮：与危险按钮搭配使用，属于安全操作按钮。',
  '危险按钮：用于警示用户操作可能带来风险，可单独使用或与安全按钮搭配使用',
  '幽灵按钮：常用在设置属性、调整参数等场景，常与深色背景搭配。'
]
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary">主要按钮</Button>
        <Button type="line">普通按钮</Button>
        <Button type="success">安全按钮</Button>
        <Button type="danger">危险按钮</Button>
        <Button type="default">幽灵按钮</Button>
      </React.Fragment>
    )
  }
}`

const DemoStandard = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
export default DemoStandard
