import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import CodeEditor from './code-editor'
import Select from '../../../components/select'
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
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/show-hint.js'
// // 上边两个是定义提示的前提，下边定义自动提示是哪种模式，此处为sql
// import 'codemirror/addon/hint/anyword-hint.js'

import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/json-lint.js'
import 'codemirror/addon/lint/css-lint.js'

// lint
const jsonlint = require('jsonlint-mod')
window.jsonlint = jsonlint

const prefix = 'CodeEditor-json'
const desc = '该示例中添加了jsonlint，示例中有个错误，已经被很明显的标识出来了。'

const code = `import React from 'react'
import { UnControlled as CodeEditor } from 'react-codemirror2'
// 使用某个语言的时候 需要 import 'codemirror/mode/{语言}/{语言}'
// eg: import 'codemirror/mode/xml/xml'

// 使用某个主题的时候 需要 import 'codemirror/theme/{主题名称}.css'
// eg: import 'codemirror/theme/material.css'
// 正常使用的时候需要将注释代码解开
// 折行
// import 'codemirror/addon/fold/foldgutter.js'
// import 'codemirror/addon/fold/foldcode.js'
// import 'codemirror/addon/fold/foldgutter.css'
// import 'codemirror/addon/fold/brace-fold.js'
// import 'codemirror/addon/fold/comment-fold.js'

// 引入代码提示
// import 'codemirror/addon/lint/lint.js'
// import 'codemirror/addon/lint/lint.css'
// import 'codemirror/addon/lint/json-lint.js'
// import 'codemirror/addon/lint/css-lint.js'
// lint 需要安装 npm install jsonlint-mod --save
// const jsonlint = require('jsonlint-mod')
// window.jsonlint = jsonlint

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode:'javascript',
      value:\`"menu": {
"id": "file",
"value": "File",
"popup": {
"menuitem": [
  {"value": "New", "onclick": "CreateNewDoc()"},
  {"value": "Open", "onclick": "OpenDoc()"},
  {"value": "Close", "onclick": "CloseDoc()"}
]
}
}
}
\`,
    }
  }
  render () {
    const {value} = this.state
    return (
      <div>
      <CodeEditor
        value={value}
        options={{
          mode: 'application/json',
          theme: 'material',
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          styleActiveLine: true,
          //代码折叠
          lineWrapping: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          lineNumbers: true,

        }}
        onChange={(editor, data, value) => {
          console.log('value',value,editor)
        }}
      />
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ CodeEditor, Select }} prefix={prefix} />
export default DemoBase
