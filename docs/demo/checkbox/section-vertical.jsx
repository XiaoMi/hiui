import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-vertical'
const desc = '选项的另一种布局形式，视页面空间选用'
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
      <Checkbox.Group value={value} placement='vertical' data={list} onChange={value => {
        this.setState({ value })
      }} />
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
