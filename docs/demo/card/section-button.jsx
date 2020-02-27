import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Icon from '../../../components/icon'
const prefix = 'card-button'
const desc = '可对卡片进行编辑、删除等操作'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <Card
          hoverable
          size='default'
          extra={[<Icon name='edit' key={1}/>, <Icon name='delete' key={2}/>]}
          title='这里是标题这里是标题这里是标题'
        >
        <p>包含额外扩展按钮</p>
        <p>扩展按钮常驻</p>
      </Card>
    )
  }
}`
const DemoButton = () => (
  <DocViewer desc={desc} code={code} scope={{ Card, Icon }} prefix={prefix} />
)
export default DemoButton
