import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
import HiRequest from '../../../components/hi-request'
const prefix = 'select-fieldNames'
const desc = '数据中的key非title，id或disabled时使用'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['1'],
      data:[
            { content:'电视1',value:'3'},
            { content:'手机2',value:'2' },
            { content:'笔记本3',value:'4'},
            { content:'生活周边4',value:'5' },
            { content:'办公56',value:'6' },
          ]
      }
  }
  render () {
    const {value,data} = this.state
    return (
      <Select
        type='single'
        data={data}
        fieldNames={{
          title:'content',
          id:'value'
        }}
        placeholder='请选择'
        style={{ width: 200 }}
        onChange={(item) => {
          console.log('异步单选结果', item)
          this.setState({
            value:item
          })
        }}
      />
    )
  }
}`
const DemoAsync = () => <DocViewer code={code} scope={{ Select, HiRequest }} prefix={prefix} desc={desc} />
export default DemoAsync
