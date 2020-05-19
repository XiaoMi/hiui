import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import List, { IconText } from '../../../components/list'
const prefix = 'list-flow'
const desc = '常用在搜索、动态发布信息流、附件等场景'
const code = `import React from 'react'
import List,{ IconText } from '@hi-ui/hiui/es/list'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          title: '下单量-指标',
          description: '下单量在交易环节中整体用户下单的数量',
          extra: '最新使用：2019.12.23 下午07:07',
  
        },
        {
          title: '下单量-指标',
          description: '下单量在交易环节中整体用户下单的数量',
          extra: '最新使用：2019.12.23 下午07:07',
        },
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
        action={dataItem => {
          return (
            <div style={{ height: '100%' }}>
              <IconText name='star' text='123' />
              <IconText
                name='thumbs-up'
                text='8'
                style={{ marginLeft: '24px' }}
              />
              <IconText name='step-on' style={{ marginLeft: '24px' }} />
            </div>
          )
        }}
      />
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ List, IconText }}
    prefix={prefix}
  />
)
export default DemoBase
