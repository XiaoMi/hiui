import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
const prefix = 'dropdown-base'
const code = `import React from 'react'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '移动至…'
      },{
        title: '复制至…'
      },{
        title: '删除'
      }]
    }
  }
  render() {
    return (
      <div>
        <Dropdown data={this.state.list} title="将选中项…" onClick={(val) => console.log('Go to ' + val)}></Dropdown>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown }}
    prefix={prefix}
  />
)
export default DemoBase
