import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Icon from '../../../components/icon'
import Input from '../../../components/input'
import Tooltip from '../../../components/tooltip'
const prefix = 'tag-group'
const desc = '以标签为信息实体进行编辑操作，如品类、频道等管理'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import Icon from '@hi-ui/hiui/es/icon'
import Input from '@hi-ui/hiui/es/input'
import Tootip from '@hi-ui/hiui/es/tootip'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      tags: [{
        title:'电视',
        tagId:'1',
        editable:false,
        closable:false
      }, {
        title:'智能',
        tagId:'2'
      },{
        title:'笔记本',
        tagId:'3'
      },{
        title:'文案超长测试文案超长测试文案超长测试文案超长测试',
        tagId:'4'
      }], 
    }
  }
  onAdd(item,index){
    const {tags} = this.state
    this.setState({
      tags:[...tags,item]
    })
  }

  onEdit(item,index){
    const {tags} = this.state
    const data = [...tags]
    if(item){
      data.splice(index,1,item)
    }else{
      data.splice(index,1)
    }
    this.setState({
      tags:data
    })
  }

  onDelete(item,index){
    const {tags} = this.state
    const data = [...tags]
    data.splice(index,1)
    this.setState({
      tags:data
    })
  }
  render () {
    const {tags} = this.state
    return (
      <Tag.Group data={tags} editable onAdd={(item,index)=>this.onAdd(item,index)} onDelete={(item,index)=>this.onDelete(item,index)} onEdit={(item,index)=>{this.onEdit(item,index)}}>
      </Tag.Group>
    )
  }
}`
const Demo = () => (
  <DocViewer code={code} scope={{ Tag, Icon, Input, Tooltip }} desc={desc} prefix={prefix} />
)
export default Demo
