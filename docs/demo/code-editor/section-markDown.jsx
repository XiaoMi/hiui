import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import CodeEditor from './code-editor'
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
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
// 引入代码提示
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
// 上边两个是定义提示的前提，下边定义自动提示是哪种模式，此处为sql
import 'codemirror/addon/hint/anyword-hint.js'

const prefix = 'CodeEditor-base'
const desc = ''
const rightOptions = ['高亮行+自动补全', '可折叠+自动提醒']

const code = [
  {
    code: `import React from 'react'

    import * as material from 'codemirror/theme/material.css'
    import * as xml from 'codemirror/mode/xml/xml'
        import { UnControlled as CodeEditor } from 'react-codemirror2'

    // 使用时， 需要将注释的代码解开
    // 高亮行插件
    // import 'codemirror/addon/selection/active-line.js'
    // 自动闭合标签插件
    // import 'codemirror/addon/edit/closetag.js'
    // 自动格式化
    // import 'codemirror/addon/fold/xml-fold.js'
    // import 'codemirror/mode/htmlmixed/htmlmixed.js'
    class Demo extends React.Component {
      constructor(props) {
        super(props)
      }
      render () {
        return (
          <CodeEditor
            value= { \`<h1>
 I ♥ HiUI CodeEditor
</h1>\` }
            options={{
              mode: 'text/html',
              theme: 'material',
              lineNumbers: true,
              styleActiveLine: true,
              autoCloseTags: true
            }}
            onChange={(editor, data, value) => {
              console.log('value',value)
            }}
          />
        )
      }
    }`,
    opt: ['高亮行+自动补全']
  },
  {
    code: `import React from 'react'
        import { UnControlled as CodeEditor } from 'react-codemirror2'
    
     // 使用某个语言的时候 需要 import 'codemirror/mode/{语言}/{语言}'
     // eg: import 'codemirror/mode/xml/xml'
    
    // 使用某个主题的时候 需要 import 'codemirror/theme/{主题名称}.css'
    // eg: import 'codemirror/theme/material.css'
    // 折行
    // import 'codemirror/addon/fold/foldgutter.js'
    // import 'codemirror/addon/fold/foldcode.js'
    // import 'codemirror/addon/fold/foldgutter.css'
    // import 'codemirror/addon/fold/brace-fold.js'
    // import 'codemirror/addon/fold/comment-fold.js'

    // 引入代码提示
    // import 'codemirror/addon/hint/show-hint.css'
    // import 'codemirror/addon/hint/show-hint.js'
    // 上边两个是定义提示的前提，下边定义自动提示是哪种模式
    // import 'codemirror/addon/hint/anyword-hint.js'

    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          mode:'javascript',
          value:\`const codeCallback = () => { 
  console.log('hello CodeEditor') 
}
// 在你开始输入的时候，会默认提醒你原来输入过的关键字
\`,
        }
      }
      render () {
        const {mode,value,modeData} = this.state
        return (
          <div>
          <CodeEditor
            value={value}
            options={{
              mode,
              theme: 'material',
              lineNumbers: true,
              //代码折叠
              lineWrapping: true,
              foldGutter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            }}
            onChange={(editor, data, value) => {
              console.log('value',value,editor)
              // 自动补全的时候，也会触发change事件，所有坐下判断，以免死循环，正则是为了不让空格，换行之类的也提示
              // 通过change对象你可以自定义一些规则去判断是否提示
              if (data.origin !== 'complete' && /\w|\./g.test(data.text[0])) {
                editor.showHint()
              }
            }}
          />
          </div>
        )
      }
    }`,
    opt: ['可折叠+自动提醒']
  }
]

const DemoBase = () => (
  <DocViewer desc={desc} code={code} scope={{ CodeEditor, Select }} prefix={prefix} rightOptions={rightOptions} />
)
export default DemoBase
