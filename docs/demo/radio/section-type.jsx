import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-type'
const code = `
import React from 'react'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      disableNum : 2
    }
  }
  render() {
    return (
      <div>
          <Radio
            list={['手机类', '电脑类', '生活类', '其它']}
            mode='button'
            checked={0}
            disabled={this.state.disableNum}
            onChange={(data) => console.log(data)}
          />
          <br/>

      </div>
    )
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
  />
)
export default DemoType
