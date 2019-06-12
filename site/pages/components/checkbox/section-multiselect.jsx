import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Checkbox from '../../../../components/checkbox'
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
    this.onChange = this.onChange.bind(this)
  }
  onChange(list, value, isChecked) {
    console.log(list, value, isChecked)
  }
  render() {
    return (
      <Checkbox list={this.state.list} onChange={this.onChange} name="c1"/>
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
        text: '手机',
        value: 'Phone',
        checked: true
      },{
        text: '电脑',
        value: 'Computer'
      },{
        text: '智能'
      },{
        text: '出行',
        disabled: true,
        checked: true
      }]
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange(list, value, isChecked) {
    console.log(list, value, isChecked)
  }
  render() {
    return (
      <Checkbox list={this.state.list} onChange={this.onChange} name="c2"/>
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
