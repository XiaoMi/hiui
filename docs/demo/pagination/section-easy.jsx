import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const prefix = 'pagination-easy'
const code = `
import React from 'react'
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
        type='simple'
        defaultCurrent={this.state.current}
        total={150}
        pageSize={30}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    )
  }
}`
const DemoEasy = () => (
  <DocViewer
    code={code}
    scope={{ Pagination }}
    prefix={prefix}
  />
)
export default DemoEasy
