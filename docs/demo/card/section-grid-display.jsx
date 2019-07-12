import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Grid from '../../../components/grid'
const prefix = 'card-grid-display'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'
import Card from '@hiui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    const {Row, Col} = Grid
    return (
      <React.Fragment>
        <Row gutter={true}>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
          <Col span={4}>
            <Card
              hoverable
              type='simple'
            >
              简易卡片
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}`

const DemoGridDisplay = () => <DocViewer code={code} scope={{ Card, Grid }} prefix={prefix} />
export default DemoGridDisplay
