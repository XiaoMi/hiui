import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'button-loading'
const desc =
  '加载中状态可用来设置点击按钮后的状态，点击示例中最后的「确认」按钮来预览效果'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Message from '../../../components/message'\n
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
        // 三秒后自动恢复
        setTimeout(() => {
          Message.open({ type: 'success', title: '提交成功', duration: 2000 })
          this.setState({
            loading: false
          })
        }, 2000)
      })
    }
  }
  render () {
    const { loading } = this.state
    return (
      <React.Fragment>
        <Button loading type="primary">通过</Button>
        <Button loading type="line">查看</Button>
        <Button loading type="danger" icon="delete" />
        <Button loading={loading} onClick={this.handleLoadingClick} type="primary">
          {loading ? '提交中...' : '确认'}
        </Button>
      </React.Fragment>
    )
  }
}`

export default () => (
  <DocViewer code={code} scope={{ Button, Message }} prefix={prefix} desc={desc} />
)
