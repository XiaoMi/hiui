import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
const desc = '自定义前缀、后缀'
const prefix = 'dropdown-button'

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
          list={this.state.list}
          title="按钮菜单"
          type="button"
          // trigger={['click']}
          onClick={(val) => console.log(val)}
          prefix={<Icon name='list'/>}
        />
      </div>
    )
  }
}`
const DemoButton = () => (
  <DocViewer code={code} scope={{ Dropdown, Icon }} prefix={prefix} desc={desc} />
)
export default DemoButton
