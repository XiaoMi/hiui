import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Pagination from '../../../components/pagination'
const rightOptions = ['默认值', '受控']
const prefix = 'pagination-base'
const desc = '常见的分页用法，用于数据量或分页数适中的场景，进行基础翻页操作'
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
        total={200}
        pageSize={10}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    )
  }
}`,
    opt: ['默认值']
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
