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
        { title:'平板', id:'1' },
        { title:'较长的一段描述文本', id:'2' },
        { title:'手机', id:'3' },
        { title:'笔记本', id:'4', disabled: true },
        { title:'生活周边', id:'5' },
        { title:'生态链', id:'6' },
      ]
    }
  }

  render () {
    return (
      <Select
        placeholder='请选择种类'
        style={{ width: 200 }}
        defaultValue={3}
        data={this.state.singleList}
        searchable
        onChange={(item) => {
          console.log('单选结果', item)
        }}
        render={(item, isSelected) => {
          return (
            <React.Fragment>
              <span style={{ float: 'left' }}>{item.title}</span>
              <span style={{ float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
            </React.Fragment>
          )
        }}
      />
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
