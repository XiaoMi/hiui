import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-loading'
const desc =
  '加载中状态可用来设置点击按钮后的等待'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      loading: false
    }
    this.handleLoadingClick = () => {
      this.setState({
        loading: true
      }, () => {
        setTimeout(() => {
          this.setState({
            loading: false
          })
        }, 3000)
      })
    }
  }
  render () {
    const { loading } = this.state
    return (
      <React.Fragment>
        <Button loading type="primary">通过</Button>
        <Button loading type="line">驳回</Button>
        <Button loading type="danger" icon="delete" />
        <p />
        <Button loading={loading} onClick={this.handleLoadingClick} type="primary">
          {loading ? '加载中...' : '点击进入 loading'}
        </Button>
      </React.Fragment>
    )
  }
}`

export default () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
