import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-base'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'\n
class Demo extends React.Component {
  render(){
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '.8',}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '.8',}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
          </Col>
        </Row>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Grid }} prefix={prefix} />
export default DemoBase
