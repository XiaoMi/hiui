import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-ban'
const code = `
import React from 'react'
import Select from '@hiui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      singleList: [
        { title:'手机', id:'2' },
        { title:'电视', id:'3', disabled: true },
        { title:'笔记本', id:'4', disabled: true },
        { title:'生活周边', id:'5' },
        { title:'办公', id:'6' },
      ]
    }
  }

  render () {
    return (
      <div>
        <Select
          type='single'
          data={this.state.singleList}
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
