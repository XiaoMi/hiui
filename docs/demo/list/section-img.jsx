import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import List, { IconText } from '../../../components/list'
import Button from '../../../components/button'
import Icon from '../../../components/Icon'
const prefix = 'list-img'
const desc = '常用在功能、模块、话题、实体信息等使用'
const code = `import React from 'react'
import List,{ IconText } from '@hi-ui/hiui/es/list'
import Button from '@hi-ui/hiui/es/button'
import Icon from '@hi-ui/hiui/es/icon'
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.data = [
      {
        title: '设备采购申请',
        description: '下单量在交易环节中整体用户下单的数量',
        extra: '最新使用：2019.12.23 下午07:07',
        avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png'
      },
      {
        title: '设备采购申请',
        description: '下单量在交易环节中整体用户下单的数量',
        extra: '最新使用：2019.12.23 下午07:07',
        avatar: 'http://infra.mioffice.cn/hiui/static/img/logo.png'
      }
    ]
  }
  render () {
    return (
      <List
          data={this.data}
          type='card'
          hoverable
          actionPosition='center'
          renderItem={dataItem => {
            const { Item } = List
            return <Item {...dataItem} />
          }}
          action={() => {
            return (
              <Button type='line'>
                <Icon name='edit' /> 编辑
              </Button>
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
    scope={{ List, IconText, Button, Icon }}
    prefix={prefix}
  />
)
export default DemoBase
