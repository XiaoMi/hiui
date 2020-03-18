import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-nest'
const desc = '嵌套栅格来完成布局'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Row gutter={true}>
        <Col span={16} >
          <div style={{textAlign:'center', background:'#ff6700',opacity: '0.8', padding:16, color:'#fff' }}>
            col-16
            <Row gutter={true}>
              <Col span={12}>
                <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', textAlign: 'center', opacity: '1', color:'#fff'}}>col-12</div>
              </Col>
              <Col span={12}>
                <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', textAlign: 'center', opacity: '1', color:'#fff'}}>col-12</div>
              </Col>
            </Row>
          </div>
      </Col>
      <Col span={8}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '16px 0', textAlign: 'center', opacity: '0.8', color:'#fff'}}>col-8</div>
      </Col>
      </Row>
    )
  }
}`
const DemoNest = () => (
  <DocViewer code={code} scope={{ Grid }} prefix={prefix} desc={desc} />
)
export default DemoNest
