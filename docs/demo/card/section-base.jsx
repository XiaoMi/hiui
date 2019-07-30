import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Grid from '../../../components/grid'
const prefix = 'card-base'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Card title="标题">
          <span>普通 Card</span>
        </Card>
        <br />
        <Card hoverable>
          <p>无标题</p>
          <p>鼠标移入悬浮效果</p>
          <p>其它额外内容</p>
        </Card>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Card, Grid }} prefix={prefix} />
export default DemoBase
