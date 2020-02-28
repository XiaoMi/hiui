import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Grid from '../../../components/grid'
const desc = '标识是否有新消息'
const prefix = 'badge-dot'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <Row gutter={true}>
        <Col span={4}>
          <Badge type='dot'>
            <Button type='default'>最新报表</Button>
          </Badge>
        </Col>
        <Col span={4}>
          <Badge type='dot'>
          <span>最新报表</span>
          </Badge>
        </Col>
        <Col span={4}>
          <Badge type='dot'>
            <Icon name='list'/>
          </Badge>
        </Col>
      </Row>
    )
  }
}`
const DemoDot = () => (
  <DocViewer
    code={code}
    scope={{ Button, Badge, Icon, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoDot
