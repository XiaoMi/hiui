import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Panel from '../../../components/panel'
const prefix = 'loading-api'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Panel from '@hiui/hiui/es/panel'
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false
    }
    this.el = null
  }

  demoEvent1 () {
    const l = Loading.open()
    setTimeout(() => {
      l.close()
    }, 3000)
  }
  demoEvent2 () {
    const l = Loading.open({
      target: this.el,
      tip: '加载中'
    })
    setTimeout(() => {
      l.close()
    }, 3000)
  }
  render () {
    return <div>
      <Button type="primary" onClick={this.demoEvent1.bind(this)}>整页，3秒后关闭</Button>
      <Button type="primary" onClick={this.demoEvent2.bind(this)}>指定目标，3秒后关闭</Button>
      <div ref={(el) => {this.el = el}} style={{margin: 20}}>
        <Panel
          title={
            <div>
              <i className="hi-icon icon-user" style={{marginRight: '5px'}}></i>
              我是标题
            </div>
          }
        >
          <p>Panel content</p>
        </Panel>
      </div>
    </div>
  }
}`
const DemoApi = () => (
  <DocViewer
    code={code}
    scope={{ Button, Panel }}
    prefix={prefix}
  />
)
export default DemoApi
