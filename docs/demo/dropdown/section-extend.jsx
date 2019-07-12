import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
const prefix = 'dropdown-extend'
const desc = '传入 type 为 group，组件会将 title 执行对应的点击响应，点击箭头打开菜单项'
const code = `
import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
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
          data={this.state.list}
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
  <DocViewer code={code} scope={{ Dropdown, Icon }} prefix={prefix} desc={desc} />
)
export default DemoExtend
