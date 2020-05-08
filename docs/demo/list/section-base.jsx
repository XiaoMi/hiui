import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import List from '../../../components/list'
const prefix = 'list-base'
const desc = '常用在数据管理、信息展示等领域'
const code = `import React from 'react'
import List from '@hi-ui/hiui/es/list'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.data = [
      {
        title: '设备采购申请',
        titleTag: '已通过',
        extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11','申请部门：信息部-用户体验组']
      },
      {
        title: '2019年第一季度考核统计表',
        extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11']
      }
    ]
  }
  render () {
    return (
      <List
        data={this.data}
        key='12'
        renderItem={dataItem => {
          const { Item } = List
          return <Item {...dataItem} />
        }}
      />
    )
  }
}`

const DemoBase = () => (
  <DocViewer desc={desc} code={code} scope={{ List }} prefix={prefix} />
)
export default DemoBase
