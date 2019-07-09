import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const prefix = 'badge-max'

const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Badge from '@hiui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content={88} max={44}>
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`
const DemoMax = () => <DocViewer code={code} scope={{ Button, Badge }} prefix={prefix} />
export default DemoMax
