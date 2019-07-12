import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Icon from '../../../components/icon'
const prefix = 'card-button'

const code = `
import React from 'react'
import Icon from '@hiui/hiui/es/icon'
import Card from '@hiui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card
          hoverable
          extra={[<Icon name='edit' key={1}/>, <Icon name='delete' key={2}/>]}
          title='这里是标题这里是标题这里是标题'
        >
          <p>包含额外扩展按钮</p>
          <p>扩展按钮常驻</p>
        </Card>
        <br />
        <Card
          hoverable
          extra={[<Icon name='edit' key={1} />, <Icon name='delete' key={2}/>]}
          extraType='hover'
        >
          <p>有扩展按钮，无标题</p>
          <p>扩展按钮移入后显示</p>
          <p>其它剩余内容；其它剩余内容；其它剩余内容；其它剩余内容；其它剩余内容；</p>
        </Card>
      </React.Fragment>
    )
  }
}`
const DemoButton = () => <DocViewer code={code} scope={{ Card, Icon }} prefix={prefix} />
export default DemoButton
