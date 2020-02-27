import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-size'
const desc = '为卡片定义了大中小三种尺寸，根据页面的实际空间选用'
const code = `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card title='小号卡片'  size='small'>
          <p>这是一个小号卡片</p>
        </Card>
        <br />
        <Card title='中号卡片'  size='default'>
          <p>这是一个中号卡片</p>
        </Card>
        <br />
        <Card title='大号卡片'  size='large'>
          <p>这是一个大号卡片</p>
        </Card>
      </React.Fragment>
    )
  }
}`
const DemoSize = () => (
  <DocViewer desc={desc} code={code} scope={{ Card }} prefix={prefix} />
)
export default DemoSize
