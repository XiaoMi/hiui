import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-basic'
const desc = '展示所有备选项，数量不宜超出10个'
const code = `import React from 'react'
import Checkbox from '@hi-ui/hiui/es/checkbox'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        content: '手机',
        id: 'Phone'
      },{
        content: '电脑',
        id: 'Computer'
      },{
        content: '智能',
        id: 'Intelli'
      },{
        content: '出行',
        id: 'Transfer',
        disabled: true
      }],
      value: ['Phone']
    }
  }
  render() {
    return (
      <Checkbox.Group data={this.state.list} defaultValue={this.state.value} />
    )
  }
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBasic
