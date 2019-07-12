import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const prefix = 'pagination-shrink'

const code = `
import React from 'react'
import Pagination from '@hi-ui/hiui/es/pagination'\n
class Demo extends React.Component {
  constructor () {
    super()

    this.state = {
      current: 2
    }
  }
  render() {
    return (
      <div>

        <Pagination
          mode='shrink'
          defaultCurrent={this.state.current}
          showQuickJumper={true}
          total={250}
          pageSize={30}
          onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
        />
      </div>
    )
  }
}`
const DemoCloseable = () => <DocViewer code={code} scope={{ Pagination }} prefix={prefix} />
export default DemoCloseable
