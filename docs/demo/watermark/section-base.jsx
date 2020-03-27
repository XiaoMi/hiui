import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Watermark from '../../../components/watermark'
import logo from '../../../site/static/img/logo.png'
const prefix = 'watermark-base'
const desc = ''
const code = `import React from 'react'
import Watermark from '@hi-ui/hiui/es/Watermark'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.options = {logo: logo, content: ['HIUI', '做中台，就用 HIUI'],density:'high'}
  }
  render () {
    return (
      <Watermark
        {...this.options}
      >
      <div id="watermark-box" 
        style={{width: '100%', height: 400, border: '1px solid rgb(230, 231, 232)'}} ref={this.boxRef1} 
        />
      </Watermark>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ Watermark, logo }}
    prefix={prefix}
  />)
export default DemoBase
