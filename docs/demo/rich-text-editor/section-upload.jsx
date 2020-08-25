import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import RichTextEditor, {
  QuillBarTooltip
} from '../../../components/rich-text-editor'
import Upload from '../../../components/upload'
import Message from '../../../components/message'
import * as Quill from 'quill'
const Delta = Quill.import('delta')
import ReactQuill from 'react-quill'
const prefix = 'RichTextEditor-upload'
const desc = '结合Uplaod组件, 方便进行图片数据的处理'
const code = `import React from 'react'

import RichTextEditor, {
  QuillBarTooltip
} from '@hi-ui/hiui/es/rich-text-editor'\n
import Upload from '@hi-ui/hiui/es/upload'
import Message from '@hi-ui/hiui/es/message'

import * as Quill from 'quill'
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.modules = {
      toolbar: {
        container: '#hiui-quill-toolbar_upload',
      }
    }
    this.state = {
      value:''
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
        
        <div id='hiui-quill-toolbar_upload' style={{borderBottom:'none',marginTop:'10px'}}>
          <QuillBarTooltip tooltipTitle='加粗' toolbarsName='bold' />
          <QuillBarTooltip tooltipTitle='斜体' toolbarsName='italic' />
          <QuillBarTooltip tooltipTitle='下划线' toolbarsName='underline' />
          <QuillBarTooltip tooltipTitle='图片' toolbarsName='image' showTooltip={false}>
            <Upload
              className='richEditor-upload' 
              type='normal'
              uploadAction='https://jsonplaceholder.typicode.com/posts/'
              headers={{ name: 'mi' }}
              content={'插入图片'}
              showUploadList={false}
              beforeUpload={() => {
                this.setState({
                  loading: true
                })
                return true
              }}
              loading={this.state.loading}
              name={'files[]'}
              onChange={(file, fileList, response) => {
                console.log('upload callback', file, fileList, response)
                this.setState(
                  {
                    loading: false
                  },
                  () => {
                    this.insertImg(response.data || 'https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1560238127.40319869.png')
                  }
                )
                Message.open({
                  title: '上传成功'
                })
              }}
          />
          </QuillBarTooltip>
      </div>
        <RichTextEditor 
          ref={this.reactQuillRef}
          value={value}
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
      Delta
    }}
    prefix={prefix}
  />
)
export default DemoBase
