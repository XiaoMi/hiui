import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-size'
const code = `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card hoverable style={{width: 200,height: 200}} title='标题内容-标题内容-标题内容'>
          <p>自定义宽度：200px</p>
          <p>自定义高度：200px</p>
          <p>其它额外内容</p>
        </Card>
        <br />
        <Card hoverable size='small'>
          <p>size = small</p>
          <p>无标题</p>
          <p>其它额外内容</p>
        </Card>
        <br />
        <Card hoverable size='default'>
          <p>size = default</p>
          <p>无标题</p>
          <p>其它额外内容</p>
        </Card>
        <br />
        <Card hoverable size='large'>
          <p>size = large</p>
          <p>无标题</p>
          <p>其它额外内容</p>
        </Card>
      </React.Fragment>
    )
  }
}`
const DemoSize = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} />
export default DemoSize
