import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-custom'

const code = `
import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      singleList: [
        { name:'平板', id:'1' },
        { name:'较长的一段描述文本', id:'2' },
        { name:'手机', id:'3' },
        { name:'笔记本', id:'4', disabled: true },
        { name:'生活周边', id:'5' },
        { name:'生态链', id:'6' },
      ]
    }
  }

  render () {
    return (
      <div>
        <Select
          placeholder='请选择种类'
          style={{width: '200px'}}
          value={'3'}
          list={this.state.singleList}
          searchable={true}
          onChange={(item) => {
              console.log('单选结果', item)
          }}
          dropdownRender={(item, isSelected) => {
            return (
              <React.Fragment>
                <span style={{float: 'left'}}>{item.name}</span>
                <span style={{float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
              </React.Fragment>
            )
          }}
        />
      </div>
    )
  }
}`
const DemoCustom = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoCustom
