import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Watermark from '../../../components/watermark'
import logo from '../../../site/static/img/logo.png'
const prefix = 'watermark-js'
const desc = ''
const code = `import React from 'react'
import Watermark from '@hi-ui/hiui/es/watermark'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.boxRef = React.createRef()
    this.options = {logo: logo, contents: ['HIUI', '做中台，就用 HIUI']}
  }
  componentDidMount() {
    Watermark.generate(this.boxRef.current, this.options)
  }
  render () {
    return (
      <div
        style={{width: '100%', height: 400, border: '1px solid rgb(230, 231, 232)'}} 
        ref={this.boxRef} 
      />
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ Watermark, logo }}
    prefix={prefix}
  />
)
export default DemoBase
