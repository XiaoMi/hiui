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
              groupId:'redmi',
              groupTitle:'红米手机',
              children:[
                { title:'红米 5A', id:'3'},
                { title:'红米 6A', id:'2' },
                { title:'红米 note', id:'4'},
                { title:'红米 note8', id:'5' },
              ]
          },
          {
            groupId:'mi',
            groupTitle:'小米电视',
            children:[
              { title:'小米电视4A 60寸', id:'10'},
              { title:'小米电视E55A', id:'11' },
              { title:'小米电视E65A', id:'12'},
              { title:'小米电视4S', id:'13' },
              { title:'小米电视4C', id:'14' },
            ]
        }
      ]
    }
  }
  render () {
    const {value,data} = this.state
    return (
      <Select
        type='multiple'
        data={data}
        value={this.state.value}
        placeholder='请选择'
        showCheckAll
        style={{ width: 200 }}
        onChange={(item) => {
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
