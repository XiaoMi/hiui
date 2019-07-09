import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'alert-autoClose'
const code = `
import React from 'react'
import Select from '@hiui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '3',
      singleList: [
        { name:'电视', id:'3', disabled: true },
        { name:'手机', id:'2' },
        { name:'笔记本', id:'4', disabled: true },
        { name:'生活周边', id:'5' },
        { name:'办公', id:'6' },
      ]
    }
  }

  render () {
    return (
      <div>
        <Select
          mode='single'
          clearable={false}
          style={{width: '200px'}}
          list={this.state.singleList}
          value={this.state.value}
          onChange={(item) => {
            console.log('单选结果', item)
            item[0] && this.setState({value: item[0].id})
          }}
        />
      </div>
    )
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoType
