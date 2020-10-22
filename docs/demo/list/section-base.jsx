import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import List from '../../../components/list'
const prefix = 'list-base'
const desc = '常用在数据管理、信息展示等领域'
const rightOptions = ['基础用法', '不带分割线']
const code = [
  {
    code: `import React from 'react'
    import List from '@hi-ui/hiui/es/list'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          data: [
            {
              title: '设备采购申请',
              titleTag: '已通过',
              titleTagType: 'success',
              extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11','申请部门：信息部-用户体验组']
            },
            {
              title: '2019年第一季度考核统计表',
              titleTag: '已驳回',
              titleTagType: 'danger',
              extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11']
            }
          ]
        }
      }
      render () {
        const {data} = this.state
        return (
          <List
            data={data}
            key='12'
            renderItem={dataItem => {
              const { Item } = List
              return <Item {...dataItem} />
            }}
          />
        )
      }
    }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
    import List from '@hi-ui/hiui/es/list'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          data: [
            {
              title: '设备采购申请',
              titleTag: '已通过',
              titleTagType: 'success',
              extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11','申请部门：信息部-用户体验组']
            },
            {
              title: '2019年第一季度考核统计表',
              titleTag: '已驳回',
              titleTagType: 'danger',
              extra:['申请编号：YH7290121','申请人：张某某','申请时间：2019-02-11']
            }
          ]
        }
      }
      render () {
        const {data} = this.state
        return (
          <List
            data={data}
            split={false}
            key='12'
            renderItem={dataItem => {
              const { Item } = List
              return <Item {...dataItem} />
            }}
          />
        )
      }
    }`,
    opt: ['不带分割线']
  }
]

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    rightOptions={rightOptions}
    scope={{ List }}
    prefix={prefix}
  />
)
export default DemoBase
