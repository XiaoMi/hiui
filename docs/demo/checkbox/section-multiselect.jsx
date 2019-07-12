import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-multiselect'
const rightOptions = ['简单数据', '复杂数据']
const code = [
  {
    code: `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: ['手机', '电脑', '智能'],
    }
  }
  render() {
    return (
      <Checkbox.Group data={this.state.list} />
    )
  }
}`,
    opt: ['简单数据']
  },
  {
    code: `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
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
}`,
    opt: ['复杂数据']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBasic
