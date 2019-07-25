import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const prefix = 'badge-custom'
const desc = '小红点将优先于其他显示'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content="hot">
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`
const DemoCustom = () => (
  <DocViewer code={code} scope={{ Button, Badge }} prefix={prefix} desc={desc} />
)
export default DemoCustom
