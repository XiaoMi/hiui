import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-multi'
const rightOptions = ['简单数据', '复杂数据']

const code = [
  {
    code: `import React from 'react'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  render() {
    return <React.Fragment>
      <Radio.Group defaultValue='AI' data={['手机', 'AI', 'IOT']} onChange={console.log} />
    </React.Fragment>
  }
}`,
    opt: ['简单数据']
  },
  {
    code: `import React from 'react'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.data = [{
      id: 0,
      content: '手机',
      disabled: true
    }, {
      id: 1,
      content: 'AI'
    }, {
      id: 2,
      content: 'IOT'
    }]
    this.state = {
      value: 1
    }
  }

  render() {
    return <React.Fragment>
      <Radio.Group value={this.state.value} data={this.data} onChange={(value) => {
        this.setState({ value })
      }} />
    </React.Fragment>
  }
}`,
    opt: ['复杂数据']
  }
]

const DemoNormal = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc='使用 Checkbox.Group 进行单选组合'
  />
)
export default DemoNormal
