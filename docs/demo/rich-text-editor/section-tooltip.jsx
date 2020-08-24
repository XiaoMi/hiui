import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import RichTextEditor, {
  QuillBarTooltip
} from '../../../components/rich-text-editor'
import ReactQuill from 'react-quill'
const prefix = 'RichTextEditor-tooltip'
const desc = '结合Tooltip, 方便理解使用工具栏中选项'
const code = `import React from 'react'
import Charts from '@hi-ui/hiui/es/charts'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.modules = {
      toolbar: {
        container: '#hiui-quill-toolbar',
      }
    }
  }
  render () {
    return (
      <div>
        <div id='hiui-quill-toolbar' style={{borderBottom:'none'}}>
          <QuillBarTooltip title='加粗' toolbarsName='bold' />
          <QuillBarTooltip title='斜体' toolbarsName='italic' />
          <QuillBarTooltip title='下划线' toolbarsName='underline' />
          <QuillBarTooltip title='图片' toolbarsName='image' />

          <QuillBarTooltip title='下标'>
            <button class="ql-script" value="sub" />
          </QuillBarTooltip>
          <QuillBarTooltip title='字号' >
            <select class='ql-size'>
              <option value='small'></option>
              <option selected></option>
              <option value='large'></option>
              <option value='huge'></option>
            </select>
          </QuillBarTooltip>
      </div>
        <RichTextEditor modules={this.modules}/>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ RichTextEditor, ReactQuill, QuillBarTooltip }}
    prefix={prefix}
  />
)
export default DemoBase
