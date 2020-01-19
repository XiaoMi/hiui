import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const desc = '标识是否有新消息'
const prefix = 'badge-dot'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Badge type='dot' content='88' style={{marginRight: '32px'}}>最新报表</Badge>
        <Badge type='dot'>
          <Button type='default'>最新报表</Button>
        </Badge>
      </div>
    )
  }
}`
const DemoDot = () => (
  <DocViewer code={code} scope={{ Button, Badge }} prefix={prefix} desc={desc} />
)
export default DemoDot
