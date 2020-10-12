import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import CodeEditor from '../../../components/code-editor'
import Select from '../../../components/Select'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/go/go'
import 'codemirror/mode/css/css'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/shell/shell'
import 'codemirror/theme/colorforth.css'
import 'codemirror/theme/seti.css'
import 'codemirror/theme/eclipse.css'

const prefix = 'CodeEditor-base'
const desc = ''
const rightOptions = ['基础用法', '语言切换', '主题切换']

const code = [
  {
    code: `import React from 'react'
    // 正常使用的时候需要将注释代码解开
    // import 'codemirror/theme/material.css'
    // import 'codemirror/mode/xml/xml'
    import CodeEditor from '@hi-ui/hiui/es/code-editor'
    
    class Demo extends React.Component {
      constructor(props) {
        super(props)
      }
      render () {
        return (
          <CodeEditor
            value='<h1>I ♥ HiUI CodeEditor</h1>'
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
              console.log('value',value)
            }}
          />
        )
      }
    }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
    import CodeEditor from '@hi-ui/hiui/es/code-editor'
    // 使用某个语言的时候 需要 import 'codemirror/mode/{语言}/{语言}'
    // eg: import 'codemirror/mode/xml/xml'
    
    // 使用某个主题的时候 需要 import 'codemirror/theme/{主题名称}.css'
    // eg: import 'codemirror/theme/material.css'

    // 正常使用的时候需要将注释代码解开
    // import 'codemirror/theme/material.css'
    // import 'codemirror/mode/xml/xml'
    // import 'codemirror/mode/javascript/javascript'
    // import 'codemirror/mode/go/go'
    // import 'codemirror/mode/css/css'
    // import 'codemirror/mode/sql/sql'
    // import 'codemirror/mode/shell/shell'

    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          mode:'xml',
          value:'<h1>I ♥ HiUI CodeEditor</h1>',
          modeData:[
            {title:'xml',id:'xml'},
            {title:'javascript',id:'javascript'},
            {title:'css',id:'css'},
            {title:'sql',id:'sql'},
            {title:'go',id:'go'},
            {title:'shell',id:'shell'},
          ]
        }
      }
      defaultCode(mode) {
        let value = ''
        switch(mode){
          case 'xml':
            value = '<h1>I ♥ HiUI CodeEditor</h1>'
            break;
          case 'javascript':
            value = "const codeCallback = () => { console.log('hello CodeEditor') }"
            break;
          case 'css':
            value = \` .hi-code-editor {
  width:'500px';
  height:'500px'
} \`
            break;
          case 'sql':
            value = "SELECT LastName,FirstName FROM Persons"
            break;
          case 'go':
            value = \`package main 
import "fmt" 
func main() { fmt.Println("Hello, World!") } \`
            break;
          case 'shell':
            value = 'echo "Hello World !"'
            break;
          default:
            value = 'pleace select mode'
        }
        return value
      }
      render () {
        const {mode,value,modeData} = this.state
        return (
          <div>
          <div style={{marginBottom:'10px'}}>
            <Select
              type='single'
              placeholder='pleace select mode'
              style={{ width: 200 }}
              data={modeData}
              onChange={(mode)=>{
                const _mode = mode[0]
                this.setState({
                  mode:_mode,
                  value: this.defaultCode(_mode)
                })
              }}
            />
          </div>
         
          <CodeEditor
            value={value}
            options={{
              mode,
              theme: 'material',
              lineNumbers: true,
            }}
            onChange={(editor, data, value) => {
              console.log('value',value,editor)
            }}
          />
          </div>
        )
      }
    }`,
    opt: ['语言切换']
  },
  {
    code: `import React from 'react'
    // 使用某个语言的时候 需要 import 'codemirror/mode/{语言}/{语言}'

    import CodeEditor from '@hi-ui/hiui/es/code-editor'

    // 正常使用的时候需要将注释代码解开
    // import 'codemirror/theme/material.css'
    // import 'codemirror/mode/xml/xml'
    // import 'codemirror/theme/colorforth.css'
    // import 'codemirror/theme/seti.css'
    // import 'codemirror/theme/eclipse.css'

    // 使用某个语言的时候 需要 import 'codemirror/mode/{语言}/{语言}'
    // eg: import 'codemirror/mode/xml/xml'

   // 使用某个主题的时候 需要 import 'codemirror/theme/{主题名称}.css'
   // eg: import 'codemirror/theme/material.css'

    // 更多请参考 https://codemirror.net/demo/theme.html
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          theme:'material',
          themeData:[
            {title:'material',id:'material'},
            {title:'seti',id:'seti'},
            {title:'colorforth',id:'colorforth'},
            {title:'eclipse',id:'eclipse'},
          ]
        }
      }
      render () {
        const {themeData,theme} = this.state
        return (
          <div>
            <div style={{marginBottom:'10px'}}>
              <Select
                type='single'
                placeholder='pleace select theme'
                style={{ width: 200 }}
                data={themeData}
                onChange={(theme)=>{
                  this.setState({
                    theme:theme[0],
                  })
                }}
              />
            </div>
            <CodeEditor
              value= "const codeCallback = () => { console.log('hello CodeEditor') }"
              options={{
                mode: 'javascript',
                theme: theme,
                lineNumbers: true
              }}
              onChange={(editor, data, value) => {
                console.log('value',value)
              }}
            />
          </div>
        
        )
      }
    }`,
    opt: ['主题切换']
  }
]

const DemoBase = () => (
  <DocViewer desc={desc} code={code} scope={{ CodeEditor, Select }} prefix={prefix} rightOptions={rightOptions} />
)
export default DemoBase
