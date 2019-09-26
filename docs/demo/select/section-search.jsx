import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-search'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      singleList: [
        { title: '小米1', id: 1 },
        { title: '小米2', id: 2, disabled: true },
        { title: '小米3', id: 3, disabled: true },
        { title: '小米4', id: 4 },
        { title: '小米5', id: 5 },
        { title: '小米6', id: 6 },
        { title: '小米8', id: 8 },
        { title: '小米9', id: 9 },
      ]
    }
  }

  render () {
    return (
      <Select
        type='single'
        data={this.state.singleList}
        placeholder='搜索多大于等于某个版本'
        style={{ width: 200 }}
        onChange={(item) => {
          console.log('单选结果', item)
        }}
        searchable
        filterOption={(keyword, item) => {
          keyword = parseInt(keyword)
          return item.id >= keyword
        }}
      />
    )
  }
}`

const DemoBan = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoBan
