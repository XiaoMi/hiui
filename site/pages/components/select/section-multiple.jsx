import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Select from '../../../../components/select'
const prefix = 'select-multiple'
const code = `
import React from 'react'
import Select from '@hiui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      multipleList: [
        { name:'手机', id:'2' },
        { name:'小米2', id:'2-1' },
        { name:'小米3', id:'2-2' },
        { name:'小米4', id:'2-3' },
        { name:'小米5', id:'2-4' },
        { name:'电脑', id:'3' },
        { name:'笔记本', id:'4', disabled: true },
        { name:'生活周边', id:'5' },
        { name:'其它', id:'6' }
      ]
    }
  }
  
  render () {
    return (
      <React.Fragment>
        <Select
          mode='multiple'
          style={{width: '300px'}}
          list={this.state.multipleList}
          value={['5']}
          searchable={true}
          placeholder='请选择...'
          noFoundTip='无匹配数据'
          onChange={(item) => {
              console.log('多选结果', item)
          }}
        />
      </React.Fragment>
    )
  }
}`
const DemoMultiple = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoMultiple
