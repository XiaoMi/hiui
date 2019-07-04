import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-allselect'
const code = `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.data = ['手机', 'AI', 'IOT']
    this.state = {
      value: ['AI'],
      checkAll: false
    }
    this.getIndeterminate = () => {
      const len = this.state.value.length
      return len < 3 && len > 0
    }
    this.handleCheckAllChange = () => {
      const len = this.state.value.length
      if (len < 3) {
        this.setState({
          checkAll: true,
          value: this.data
        })
      } else {
        this.setState({
          checkAll: false,
          value: []
        })
      }
    }
    this.handleGroupChange = (value) => {
      this.setState({
        value,
        checkAll: value.length === 3
      })
    }
  }

  render() {
    const CheckboxGroup = Checkbox.Group
    return (
      <React.Fragment>
        <Checkbox
          indeterminate={this.getIndeterminate()}
          onChange={this.handleCheckAllChange}
          checked={this.state.checkAll}>全选</Checkbox>
        <p />
        <CheckboxGroup
          value={this.state.value}
          data={this.data}
          onChange={this.handleGroupChange} />
      </React.Fragment>
    )
  }
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
    desc='用 `indeterminate` 属性控制不全选的状态'
  />
)
export default DemoBasic
