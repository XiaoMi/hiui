import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
import HiRequest from '../../../components/_util/hi-request'
const prefix = 'select-group'
const desc = '类型分组'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['1'],
      data:[
          {
              id:'label1',
              title:'电视',
              children:[
                { title:'电视1', id:'3'},
                { title:'手机2', id:'2' },
                { title:'笔记本3', id:'4'},
                { title:'生活周边4', id:'5' },
                { title:'办公56', id:'6' },
              ]
          },
          {
            id:'label2',
            title:'电视2',
            children:[
              { title:'电视', id:'10'},
              { title:'手机', id:'11' },
              { title:'笔记本', id:'12'},
              { title:'生活周边', id:'13' },
              { title:'办公', id:'14' },
            ]
        }
      ]
    }
  }
  render () {
    const {value,data} = this.state
    return (
      <Select
        type='single'
        data={data}
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
const DemoAsync = () => (
  <DocViewer
    code={code}
    scope={{ Select, HiRequest }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoAsync
