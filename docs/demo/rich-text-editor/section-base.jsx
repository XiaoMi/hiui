import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import RichTextEditor from '../../../components/rich-text-editor'
import ReactQuill from 'react-quill'
const prefix = 'RichTextEditor-base'
const desc = ''
const code = `import React from 'react'
import RichTextEditor from '@hi-ui/hiui/es/rich-text-editor'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [('blockquote', 'code-block')], // toggled buttons
        ['link', 'image'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme

        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

        [{ font: [] }],
        [{ align: [] }],

        ['clean'] // remove formatting button
      ]
    }
    this.state = {
      value: '小米公司正式成立于2010年4月, 是一家以手机 智能硬件和 IoT 平台为核心的互联网公司, 创业仅7年时间，小米的年收入就突破了千亿元人民币。 截止2018年，小米的业务遍及全球80多个国家和地区。 目前，小米是全球第四大智能手机制造商，在30余个国家和地区的手机市场进入了前五名， 特别是在印度，连续5个季度保持手机出货量第一。通过 独特的“生态链模式”， 小米投资、带动了更多志同道合的创业者，同时建成了连接超过1.3亿台智能设备的IoT平台。'
    }

  }
  onValueChange(value) {
    this.setState({
      value
    })
  }
  render () {
    const {value} = this.state
    return (
        <RichTextEditor modules={this.modules}  value={value} onChange={this.onValueChange.bind(this)}/>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ RichTextEditor, ReactQuill }}
    prefix={prefix}
  />
)
export default DemoBase
