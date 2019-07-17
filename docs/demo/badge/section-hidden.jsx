import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const prefix = 'badge-hidden'
const desc = '设置 hidden 属性隐藏气泡'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content={90} hidden>
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`
const DemoHidden = () => (
  <DocViewer code={code} scope={{ Button, Badge }} prefix={prefix} desc={desc} />
)
export default DemoHidden
