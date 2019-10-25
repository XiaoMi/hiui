import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async-multiple'
const code = `import React from 'react'
import { Select } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      multipleList: [

      ]
    }
  }
  render () {
    return (
      <Select
      type='multiple'
      style={{width: '300px'}}
      data={this.state.multipleList}
      placeholder='请选择...'
      onSearch={(value) => {
        return Promise.resolve(value).then((value)=>{
          this.setState({multipleList:[
            { title:'手机', id:'2' },
            { title:'小米2', id:'2-1' },
            { title:'小米3', id:'2-2' },
            { title:'小米4', id:'2-3' },
            { title:'小米5', id:'2-4' },
            { title:'电脑', id:'3' },
            { title:'笔记本', id:'4' },
            { title:'生活周边', id:'5' },
            { title:'其它', id:'6' }
          ].splice(0,value)})
        })
      }}
      onChange={(item) => {
        console.log('多选结果', item)
      }}
      />
    )
  }
}`
const DemoSingleMultiple = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoSingleMultiple
