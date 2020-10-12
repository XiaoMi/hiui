import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import CodeEditor from '../../../components/code-editor'
import Select from '../../../components/Select'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'

const prefix = 'CodeEditor-preview'
const desc = ''

const code = `import React from 'react'
    import CodeEditor from '@hi-ui/hiui/es/code-editor'

    // 正常使用的时候需要将注释代码解开
    // import 'codemirror/theme/material.css'
    // import 'codemirror/mode/xml/xml'
    // import 'codemirror/mode/javascript/javascript'
    // import 'codemirror/mode/htmlmixed/htmlmixed.js'
    // import 'codemirror/mode/css/css.js'

    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.value = \`<H1>welcome to HiUI</H1>
<img 
class="logo__img" 
src="https://xiaomi.github.io/hiui/static/img/logo.png" 
alt="HiUI" 
height="40"> \`
        this.delay = ''
      }
      componentDidMount() {
        setTimeout(()=>{this.updatePreview()}, 300);
      }
      updatePreview() {
        const {value} = this
        const previewFrame = document.getElementById('preview');
        const preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
        preview.open();
        preview.write(value);
        preview.close();
      }
      render () {
        const {value} = this
        return (
          <div style={{height:'300px'}}>
            <div style={{float: 'left', width: '50%', border: '1px solid black'}}>
              <CodeEditor
                value={value}
                style={{width:'100%'}}
                options={{
                  mode: 'xml',
                  theme: 'material',
                  lineNumbers: true
                }}
                onChange={(editor, data, value) => {
                  console.log('value',value,editor)
                    this.value = value
                    clearTimeout(this.delay)
                    setTimeout(()=>{this.updatePreview()}, 300)
                }}
              />
            </div>
            <iframe id='preview' style={{ width: '49%', float: 'left',height: '300px', border: '1px solid black', borderLeft: '0px'}}></iframe>
          </div>
        )
      }
    }`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ CodeEditor, Select }} prefix={prefix} />
export default DemoBase
