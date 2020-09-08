import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Watermark from '../../../components/watermark'
import logo from '../../../site/static/img/logo.png'
const prefix = 'watermark-base'
const desc = ''
const code = `import React from 'react'
import logo from '本地图片路径或者base64'
import Watermark from '@hi-ui/hiui/es/watermark'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
      logo: logo, // 本地图片路径或者base64
      content: ['HIUI', '做中台，就用 HIUI'],
    }
  }
  render () {
    return (
      <Watermark
        {...this.options}
      >
      <div id="watermark-box"
        style={{width: '100%', height: 400, border: '1px solid rgb(230, 231, 232)'}}
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
  />
)
export default DemoBase
