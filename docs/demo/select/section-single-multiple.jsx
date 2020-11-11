import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-single-multiple'
const desc = '展示从全部备选项选出的部分选项'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      multipleList: [
        { title: '小米2', id: '2-1' },
    { title: '小米3', id: '2-2' },
    { title: '小米4', id: '2-3' },
    { title: '小米5', id: '2-4' },
    { title: '电脑', id: '3' },
    { title: '笔记本', id: '4' },
    { title: '生活周边', id: '5q' },
    { title: '生活周边', id: '5w' },
    { title: '生活周边', id: '5d' },
    { title: '生活周边', id: '5f' },
    { title: '生活周边', id: '5g' },
    { title: '生活周边', id: '5h' },
    { title: '生活周边', id: '5j' },
    { title: '生活周边', id: '59' },
    { title: '生活周边', id: '5c' },
    { title: '生活周边', id: '5x' },
    { title: '生活周边', id: '5b' },
    { title: '生活周边', id: '5-' },
    { title: '生活周边', id: '5z' },
    { title: '生活周边', id: '5p' },
    { title: '生活周边', id: '5n' },
    { title: '生活周边', id: '5m' },
    { title: '生活周边', id: 'o5' },
    { title: '其它', id: '6' }
      ]
    }
  }

  render () {
    return (
      <Select
        type='multiple'
        style={{width: '300px'}}
        data={this.state.multipleList}
        defaultValue={['4', '5','2','3']}
        searchable
        showCheckAll
        placeholder='请选择'
        emptyContent='无匹配数据'
        onChange={(item) => {
          console.log('多选结果', item)
        }}
      />
    )
  }
}`
const DemoSingleMultiple = () => <DocViewer code={code} scope={{ Select }} prefix={prefix} desc={desc} />
export default DemoSingleMultiple
