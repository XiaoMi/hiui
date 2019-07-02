import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-block'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Row gutter={true}>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
      </Row>
    )
  }
}`
const DemoBlock = () => <DocViewer code={code} scope={{ Grid }} prefix={prefix} />
export default DemoBlock
