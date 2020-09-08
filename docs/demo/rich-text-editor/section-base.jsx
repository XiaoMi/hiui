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
  }
  render () {
    return (
        <RichTextEditor modules={this.modules}/>
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
