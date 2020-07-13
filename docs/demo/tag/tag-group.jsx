import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Icon from '../../../components/icon'
import Input from '../../../components/input'
const prefix = 'tag-group'
const desc = '以标签为信息实体进行编辑操作，如品类、频道等管理'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import Icon from '@hi-ui/hiui/es/icon'
import Input from '@hi-ui/hiui/es/input'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state ={
      tags: ['电视', '智能', '笔记本','手机'],
      inputVisible:false,
      inputValue:''
    }
  }
  handleClose(removedTag){
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  showInput(){
    this.setState({
      inputVisible:true
    },()=>{
      // this.input.focus()
    })
  }

  handleInputChange(e){
    this.setState({
      inputValue:e.target.value
    })
  }

  saveInputRef(input){
    this.input = input;
  };

  handleInputConfirm(){
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  render () {
    const {tags,inputVisible,inputValue} = this.state
    return (
      <div>
      {tags.map((tag, index)=><Tag
        type="hasIcon"
        key={tag}
        closable
        onClose={(tag) => this.handleClose(tag)}
      >
        {tag}
      </Tag>)}
      {inputVisible && (
        <input
          ref={(node)=>this.saveInputRef(node)}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={(e)=>this.handleInputChange(e)}
          onBlur={(e)=>this.handleInputConfirm(e)}
          onKeyDown={(e)=>{
            if(event.keyCode==13){
              this.handleInputConfirm(e)
            }
          }}
        />
      )}
      {
      !inputVisible && <span  style={{width:50,borderRadius:11,border:'1px dashed rgba(230,231,232,1)',display:'inline-block',lineHeight: '20px',textAlign:'center',marginLeft:10,boxSizing:'border-box',cursor:'pointer'}} onClick={()=>this.showInput()}>
        <Icon name="plus" />
        </span>
      }
     
      </div>
    )
  }
}`
const Demo = () => (
  <DocViewer code={code} scope={{ Tag, Icon, Input }} desc={desc} prefix={prefix} />
)
export default Demo
