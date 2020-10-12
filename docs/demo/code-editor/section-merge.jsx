import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import CodeEditor, { CodeMirror } from '../../../components/code-editor'
import Select from '../../../components/Select'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/brace-fold' // 折叠js
import 'codemirror/addon/fold/xml-fold' // 折叠xml和html
import 'codemirror/addon/fold/markdown-fold' // 折叠md
import 'codemirror/addon/fold/comment-fold' // 折叠注释，但是测试一下只能折叠html的注释；
import './diff_match_patch.js'
const prefix = 'CodeEditor-merge'
const desc = ''

const code = `import React from 'react'
    import { CodeMirror } from '@hi-ui/hiui/es/code-editor'

    // 正常使用的时候需要将注释代码解开
    // import 'codemirror/theme/material.css'
    // import 'codemirror/mode/xml/xml'
    // import 'codemirror/mode/javascript/javascript'
    // import 'codemirror/mode/htmlmixed/htmlmixed.js'
    // import 'codemirror/mode/css/css.js'
    // import 'codemirror/addon/merge/merge.js'
    // import 'codemirror/addon/merge/merge.css'
    // import 'codemirror/addon/selection/active-line'
    // import 'codemirror/addon/fold/foldgutter.css'
    // import 'codemirror/addon/fold/foldcode'
    // import 'codemirror/addon/fold/brace-fold' // 折叠js
    // import 'codemirror/addon/fold/xml-fold' // 折叠xml和html
    // import 'codemirror/addon/fold/markdown-fold' // 折叠md
    // import 'codemirror/addon/fold/comment-fold' // 折叠注释，但是测试一下只能折叠html的注释；
    // import './diff_match_patch.js'

    class Demo extends React.Component {
      constructor(props) {
        super(props);
          this.state= {
            FileContentData: props.FileContentData,
          }
          this.value = \`<head><title>CodeMirror: merge view demo</title>
<meta charset="utf-8">
<link rel="stylesheet" href="../doc/docs.css">

<link rel="stylesheet" href="../lib/codemirror.css">
<link rel="stylesheet" href="../addon/merge/merge.css">
<script src="../lib/codemirror.js"></script>
<script src="../mode/xml/xml.js"></script>
<script src="../mode/css/css.js"></script>
<script src="../mode/javascript/javascript.js"></script>
<script src="../mode/htmlmixed/htmlmixed.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js"></script>
<script src="../addon/merge/merge.js"></script>
<style>
    .CodeMirror { line-height: 1.2; }
    @media screen and (min-width: 1300px) {
      article { max-width: 1000px; }
      #nav { border-right: 499px solid transparent; }
    }
    span.clicky {
      cursor: pointer;
      background: #d70;
      color: white;
      padding: 0 3px;
      border-radius: 3px;
    }
  </style>
</head><body>
</body>
\`
          this.orig = \`<head><title>CodeMirror: merge view demo</title>
<meta charset="utf-8">
<link rel="stylesheet" href="../doc/docs.css">

<link rel="stylesheet" href="../lib/codemirror.css">
<link rel="stylesheet" href="../addon/merge/merge.css">
<script type=text/javascript  src="../lib/codemirror.js"></script>
<script type=text/javascript  src="../mode/xml/xml.js"></script>
<script type=text/javascript  src="../mode/css/css.js"></script>
<script type=text/javascript  src="../mode/javascript/javascript.js"></script>
<script type=text/javascript  src="../mode/htmlmixed/htmlmixed.js"></script>
<script type=text/javascript  src="https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js"></script>
<script type=text/javascript  src="../addon/merge/merge.js"></script>
<style>
    .CodeMirror { line-height: 1.2; }
    @media screen and (min-width: 1300px) {
      article { max-width: 1000px; }
      #nav { border-right: 499px solid transparent; }
    }
    span.clicky {
      cursor: pointer;
      background: #d70;
      color: white;
      padding: 0 3px;
      border-radius: 3px;
    }
  </style>
</head><body>
</body>
\`
      }
      componentDidMount(){
        const {FileContentData} = this.props
          this.initUI(FileContentData)
      }
      componentWillReceiveProps(nextProps){
          this.initUI(nextProps.FileContentData);
      }
      initUI(data) {
        let target = this.refs['react-diff-code-view'];//获取dom元素
        const {value,orig} = this
        console.log(target)
        target.innerHTML = "";//每次dom元素的内容清空
        CodeMirror.MergeView(target, Object.assign({}, {
          readOnly: false,//只读
          lineNumbers: true, // 显示行号
          value: value,//左边的内容（新内容）
          orig:orig,//右边的内容（旧内容）
          mode: "xml",//代码模式为js模式，这里还可以是xml，python，java，等等，会根据不同代码模式实现代码高亮
          highlightDifferences: "highlight",//有差异的地方是否高亮
          connect: null,
          revertButtons: false,//revert按钮设置为true可以回滚
          styleActiveLine: true,//光标所在的位置代码高亮
          lineWrap:true,// 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
          smartIndent: true, // 智能缩进
          matchBrackets: true, // 括号匹配
          foldGutter:true,//代码折叠
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        }, this.props.options || {}));
      }
      render () {
        return (
          <div className="react-diff-code-view" style={{height: '100%'}}>
            <div ref="react-diff-code-view" style={{height: '100%'}} />
          </div>
        )
      }
    }`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ CodeEditor, Select, CodeMirror }} prefix={prefix} />
export default DemoBase
