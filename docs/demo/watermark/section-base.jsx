import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Watermark from '../../../components/watermark'
import logo from '../../../site/static/img/logo.png'
const prefix = 'watermark-base'
const desc = ''
const code = `import React from 'react'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.boxRef1 = React.createRef()
    this.boxRef2 = React.createRef()
  }
  componentDidMount() {
    Watermark(this.boxRef1.current, {id: 'first', logo: logo, rotate: -30, contents: ['HIUI', '做中台，就用 HIUI']})
  }
  render () {
    return (
      <div style={{width: '100%', height: 400, border: '1px solid rgb(230, 231, 232)'}} ref={this.boxRef1} />
    )
  }
}`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ Watermark, logo }} prefix={prefix} />
export default DemoBase
