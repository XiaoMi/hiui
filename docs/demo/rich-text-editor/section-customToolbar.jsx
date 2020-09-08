import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import RichTextEditor, {
  QuillBarTooltip
} from '../../../components/rich-text-editor'
import Upload from '../../../components/upload'
import Message from '../../../components/message'
import Icon from '../../../components/icon'
import * as Quill from 'quill'
const Delta = Quill.import('delta')
import ReactQuill from 'react-quill'
const prefix = 'RichTextEditor-customToolbar'
const desc = '自定义工具栏，方便快捷操作'
const code = `import React from 'react'
import * as Quill from 'quill'

import RichTextEditor, {
  QuillBarTooltip
} from '@hi-ui/hiui/es/rich-text-editor'\n
import Upload from '@hi-ui/hiui/es/upload'
import Message from '@hi-ui/hiui/es/message'
import Icon from '@hi-ui/hiui/es/icon'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.modules = {
      toolbar: {
        container: '#hiui-quill-toolbar_custom',
        handlers:{
          redo: value => {
            this.quillRef.history.redo()
          },
          undo: value => {
            this.quillRef.history.undo()
          },
          scissor: value => {
            const { index, length } = this.quillRef.getSelection()
            this.quillRef.deleteText(index, length, 'user')
          }
        }
      }
    }
    this.state = {
      value:'小米的使命是，始终坚持做“感动人心，价格厚道”的好产品，让全球每个人都能享受科技带来的美好生活'
    }
    this.reactQuillRef = React.createRef()
  }
  
  componentDidMount() {
    this.attachQuillRefs()
    const Delta = Quill.import('delta')

    this.quillRef.clipboard.addMatcher(Node.ELEMENT_NODE, (
      node,
      delta
    ) => {
      if(node.tagName === 'IMG') {
        Message.open({
          type:'warning',
          title:'请使用工具栏中按钮插入图片'
        })
        return {ops:[]}
      } else {
        return delta.compose(new Delta().retain(delta.length()))
      }
    })
  }

  insertImg(url){
    console.log('插入图片',url)
    const { value } = this.state
    this.quillRef.setContents([
      { insert: '提醒：',attributes: { bold: true, color: "#f63" } },
      { insert: '请将上传接口改为自己可用的接口地址!', attributes: { color: "#f63" } }
    ])
    this.quillRef.insertEmbed(value.length, 'image', url, 'user')
  }

  attachQuillRefs() {
    if (typeof this.reactQuillRef.current.getEditor !== 'function') return
    this.quillRef = this.reactQuillRef.current.getEditor()
  }

  onValueChange(value) {
    this.setState({
        value
    })
  }

  render () {
    const { value } = this.state
    return (
      <div>
        <div id='hiui-quill-toolbar_custom' style={{borderBottom:'none',marginTop:'10px'}}>
          <QuillBarTooltip  tooltipTitle='撤销' toolbarsName='undo'>
           <button class='ql-undo' style={{lineHeight: '22px'}}><Icon name="caret-left" style={{ fontSize: '16px'}} /></button>
          </QuillBarTooltip>
          <QuillBarTooltip tooltipTitle='重做' toolbarsName='redo'>
            <button class='ql-redo' style={{lineHeight: '22px'}}><Icon name="caret-right" style={{ fontSize: '16px'}} /> </button>
          </QuillBarTooltip>

          <QuillBarTooltip tooltipTitle='切除' toolbarsName='scissor'>
            <button class='ql-scissor' style={{lineHeight: '22px'}}><Icon name="scissor" style={{ fontSize: '16px'}} /> </button>
          </QuillBarTooltip>
          <QuillBarTooltip tooltipTitle='加粗' toolbarsName='bold' />
          <QuillBarTooltip tooltipTitle='斜体' toolbarsName='italic' />
          <QuillBarTooltip tooltipTitle='下划线' toolbarsName='underline' />
      </div>
        <RichTextEditor 
          value={value}
          ref={this.reactQuillRef}
          modules={this.modules}
        />
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{
      RichTextEditor,
      ReactQuill,
      QuillBarTooltip,
      Upload,
      Message,
      Quill,
      Delta,
      Icon
    }}
    prefix={prefix}
  />
)
export default DemoBase
