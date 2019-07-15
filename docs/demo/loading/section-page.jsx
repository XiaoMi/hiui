import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Loading from '../../../components/loading'
const prefix = 'loading-page'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Loading from '@hi-ui/hiui/es/loading'
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false
    }
  }
  clickEvent () {
    this.setState({open: true})
    setTimeout(() => {
      this.setState({open: false})
    }, 3000)
  }
  render () {
    return <div>
      <Button type="primary" onClick={this.clickEvent.bind(this)}>整页遮罩，3秒自动关闭</Button>
      {this.state.open && <Loading full visible size='large' tip='加载中' />}
    </div>
  }
}`
const DemoPage = () => <DocViewer code={code} scope={{ Button, Loading }} prefix={prefix} />
export default DemoPage
