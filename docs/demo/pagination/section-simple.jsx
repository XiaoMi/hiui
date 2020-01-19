import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const prefix = 'pagination-simple'
const desc = '数据分批展示的形式，弱化页码'
const code = `import React from 'react'
import Pagination from '@hi-ui/hiui/es/pagination'\n
class Demo extends React.Component {
  constructor () {
    super()

    this.state = {
      current: 1
    }
  }
  render() {
    return (
      <Pagination
        type='shrink'
        defaultCurrent={this.state.current}
        total={200}
        pageSize={10}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    )
  }
}`

const DemoSimple = () => (
  <DocViewer code={code} scope={{ Pagination }} prefix={prefix} desc={desc} />
)
export default DemoSimple
