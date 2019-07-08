import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Grid from '../../../components/grid'
const prefix = 'card-grid-image'
const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    const {Row, Col} = Grid
    return (
      <React.Fragment>
         <Row gutter={true}>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
              title='图片展示'
              description='这是图片描述'
            ></Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}`

const DemoGridImage = () => <DocViewer code={code} scope={{ Card, Grid }} prefix={prefix} />
export default DemoGridImage
