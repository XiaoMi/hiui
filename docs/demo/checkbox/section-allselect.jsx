import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-allselect'
const code = `import React from 'react'
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
        id: 'Transfer'
      }],
      value: ['Phone']
    }
    this.handleCheckAllClick = () => {
      this.setState(({ value, list }) => {
        return {
          value: value.length < 4 ? list.map(({ id }) => id) : []
        }
      })
    }
    this.getIndeterminate = () => {
      return this.state.value.length > 0 && this.state.value.length < 4
    }
  }
  render() {
    const { value, list } = this.state
    return (
      <React.Fragment>
        <Checkbox
          indeterminate={this.getIndeterminate()}
          checked={value.length === 4}
          onChange={this.handleCheckAllClick}>
          全选
        </Checkbox>
        <p />
        <Checkbox.Group value={value} data={list} onChange={value => {
          this.setState({ value })
        }} />
      </React.Fragment>
    )
  }
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
  />
)
export default DemoBasic
