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
        title: '电视'
      },{
        title: '手机'
      },{
        title: '电脑'
      }]
    }
  }
  render() {
    return (
      <div>
        <Dropdown data={this.state.list} title="电子产品" onClick={(val) => console.log(val)}></Dropdown>
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
