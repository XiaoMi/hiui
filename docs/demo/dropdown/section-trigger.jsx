import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
const prefix = 'dropdown-trigger'
const code = `
import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '小米手机',
        onClick: () => {
          console.log('one')
        }
      },{
        title: '小米电视',
        prefix: <Icon name='list'/>,
        disabled: true
      },{
        title: '小米生态链相关产品',
        prefix: <Icon name='list'/>,
        suffix: <Icon name='truck'/>
      },{
        title: '-'
      },{
        title: '其它',
        value: 'other'
      }]
    }
  }
  render() {
    return (
      <div>
        <Dropdown
          data={this.state.list}
          trigger={['click', 'contextmenu']}
          onClick={(val) => {console.log(val)}}
          title="左键或右键点击"
          width={160}
        >
        </Dropdown>
      </div>
    )
  }
}`
const DemoTrigger = () => <DocViewer code={code} scope={{ Dropdown, Icon }} prefix={prefix} />
export default DemoTrigger
