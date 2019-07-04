import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const desc = '小红点将优先于其他显示'
const prefix = 'badge-dot'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Badge from '@hiui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Badge dot value='88' style={{marginRight: '32px'}}>最新报表</Badge>
        <Badge dot>
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
