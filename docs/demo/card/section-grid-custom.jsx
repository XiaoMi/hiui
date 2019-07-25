import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Grid from '../../../components/grid'
const prefix = 'card-grid-custom'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    const {Row, Col} = Grid
    const colors = ['#46bc99', '#37d5fa', '#b450de', '#fadb14']
    const cols = colors.map((color, index) => {
      return (
        <Col span={6} key={index}>
          <Card hoverable style={{borderLeft: \`2px solid \${color}\`,}}>
            <p>无标题</p>
            <p>鼠标移入悬浮效果</p>
            <p>其它额外内容</p>
          </Card>
        </Col>
      )
    })
    return (
      <React.Fragment>
        <Row gutter={true}>
          {cols}
        </Row>
      </React.Fragment>
    )
  }
}`

const DemoGridCustom = () => <DocViewer code={code} scope={{ Card, Grid }} prefix={prefix} />
export default DemoGridCustom
