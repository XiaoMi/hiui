import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const rightOptions = ['默认', '受控']
const prefix = 'pagination-base'
const desc = '数据量庞大，分页数较多时使用'
const code = [
  {
    code: `import React from 'react'
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
        defaultCurrent={this.state.current}
        total={150}
        pageSize={30}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    )
  }
}`,
    opt: ['默认']
  },
  {
    code: `import React from 'react'
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
        current={this.state.current}
        total={150}
        pageSize={30}
        onChange={(page, prevPage, pageSize) => {
          this.setState({ current: page })
        }}
      />
    )
  }
}`,
    opt: ['受控']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Pagination }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoBase
