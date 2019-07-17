import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-image'
const code = `
import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card
          hoverable
          cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
          title='图片展示'
          description='图片信息描述：size=small;width:276px'
          size='small'
        ></Card>
        <br />
        <Card
          hoverable
          cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
          title='图片展示'
          description='图片信息描述：size=middle;width:376px'
          size='middle'
        ></Card>

        <br />
        <Card
          hoverable
          cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
          title='图片展示'
          description='图片信息描述：size=large;width:576px'
          size='large'
        ></Card>
      </React.Fragment>
    )
  }
}`
const DemoImage = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} />
export default DemoImage
