import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-allselect'
const rightOptions = ['单个', '组合']
const code = [
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
      <React.Fragment>
        <Checkbox all='one' onChange={this.onChange}>全选</Checkbox>
        <div><Checkbox list={this.state.list} name='one'/></div>
      </React.Fragment>
    )
  }
}`,
    opt: ['单个']
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
        value: 'phone'
      },{
        text: '电脑',
        value: 'computer'
      },{
        text: '智能',
        checked: true
      },{
        text: '出行',
        disabled: true,
        checked: true
      }]
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange() {

  }
  render() {
    return (
      <React.Fragment>
        <Checkbox all='two' onChange={this.onChange}>全选</Checkbox>
        <div><Checkbox name='two' text='手机'/></div>
        <div><Checkbox name='two' value='computer'>电脑</Checkbox></div>
        <div><Checkbox name='two' text='智能'/></div>
        <div><Checkbox name='two' checked={true} text='出行'/></div>
      </React.Fragment>
    )
  }
}`,
    opt: ['组合']
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
