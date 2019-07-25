import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
const prefix = 'grid-block'
const desc = '在 Row 设置 gutter = true 来使水平排列有间隔'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Row gutter={true}>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '20px 0', textAlign: 'center', opacity: '.8', color:'#fff'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#ff6700', width: '100%', padding: '20px 0', textAlign: 'center', opacity: '.8'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '20px 0', textAlign: 'center', opacity: '.8',color:'#fff'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#ff6700', width: '100%', padding: '20px 0', textAlign: 'center', opacity: '.8'}}>col-6</div>
        </Col>
      </Row>
    )
  }
}`
const DemoBlock = () => <DocViewer code={code} scope={{ Grid }} prefix={prefix} desc={desc} />
export default DemoBlock
