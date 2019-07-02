import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-nest'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Row gutter={true}>
        <Col span={16} style={{outline: '1px dotted #999'}}>
          <Row gutter={true}>
            <Col span={24}>
              <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-16</div>
            </Col>
          </Row>
          <Row gutter={true}>
            <Col span={12}>
              <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '0.8'}}>col-12</div>
            </Col>
            <Col span={12}>
              <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '0.8'}}>col-12</div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-8</div>
        </Col>
      </Row>
    )
  }
}`
const DemoNest = () => <DocViewer code={code} scope={{ Grid }} prefix={prefix} />
export default DemoNest
