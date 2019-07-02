import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const prefix = 'pagination-base'
const desc = '分页组件会根据项目数量自己处理翻页数量。'
const code = `
import React from 'react'
import Pagination from '@hiui/hiui/es/pagination'\n
class Demo extends React.Component {
  constructor () {
    super()

    this.state = {
      current: 1
    }
  }
  render() {
    return (
      <div>
        <Pagination
          defaultCurrent={this.state.current}
          total={150}
          pageSize={30}
          onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
        />
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Pagination }} prefix={prefix} desc={desc} />
export default DemoBase
