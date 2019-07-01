import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Dropdown from '../../../../components/dropdown'
import Icon from '../../../../components/icon'
const prefix = 'dropdown-extend'
const code = `
import React from 'react'
import Icon from '@hiui/hiui/es/icon'
import Dropdown from '@hiui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: 'one'
      },{
        title: 'two',
        prefix: <Icon name='add'/> // 此 prefix 将会被替换为外部的 prefix
      },{
        title: 'three',
        suffix: <Icon name='truck'/>
      }]
    }
  }
  render() {
    return (
      <div>
        <Dropdown 
          list={this.state.list}
          title="按钮菜单"
          type="group"
          // trigger={['click']}
          onClick={(val) => console.log(val)}
          prefix={<Icon name='list'/>}
        />
      </div>
    )
  }
}`
const DemoExtend = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown, Icon }}
    prefix={prefix}
  />
)
export default DemoExtend
