import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-offset'
const desc = '设置 offset 来指定左右的偏移量'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <div>
        <Row gutter={true}>
          <Col span={8}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-8</div>
          </Col>
          <Col span={6} offset={6}>
            <div style={{backgroundColor: '#ff6700', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-6-offset-6</div>
          </Col>
          <Col span={4}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-4</div>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={4}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-4</div>
          </Col>
          <Col span={6} offset={4}>
            <div style={{backgroundColor: '#ff6700', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-6-offset-4</div>
          </Col>
          <Col span={4}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-4</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', color: '#fff', opacity:'0.8', textAlign: 'center'}}>col-6</div>
          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoOffset = () => (
  <DocViewer code={code} scope={{ Grid }} prefix={prefix} desc={desc} />
)
export default DemoOffset
