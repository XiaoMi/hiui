import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-base'
const desc = '用卡片封装独立的信息实体，如模块、功能、项目、应用等，或还原实际生活中的卡片应用'
const code = `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Card title="标题" style={{width: 400,height: 200}}>
          <span>普通 Card</span>
        </Card>
        <br />
        <Card hoverable style={{width: 400,height: 200}}>
          <p>无标题</p>
          <p>鼠标移入悬浮效果</p>
          <p>其它额外内容</p>
        </Card>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} desc={desc} />
export default DemoBase
