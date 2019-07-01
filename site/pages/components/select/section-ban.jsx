import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Select from '../../../../components/select'
const prefix = 'select-ban'
const code = `
import React from 'react'
import Select from '@hiui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      singleList: [
        { name:'手机', id:'2' },
        { name:'电视', id:'3', disabled: true },
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
          list={this.state.singleList}
          placeholder='请选择品类'
          style={{width: '200px'}}
          onChange={(item) => {
              console.log('单选结果', item)
          }}
          disabled
        />
      </div>
    )
  }
}`

const DemoBan = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoBan
