import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-multiselect'
const rightOptions = ['简单数据', '复杂数据']
const code = [
  {
    code: `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render() {
    return (
      <Checkbox.Group
        name='strategy'
        data={['手机', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={console.log}
      />
    )
  }
}`,
    opt: ['简单数据']
  },
  {
    code: `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.data = [{
      content: '手机',
      id: 0,
      disabled: true
    }, {
      content: 'AI',
      id: 1
    }, {
      content: 'IOT',
      id: 2
    }]
  }

  render() {
    return (
      <React.Fragment>
        <Checkbox.Group
          data={this.data}
          defaultValue={[0]}
          onChange={console.log} />
      </React.Fragment>
    )
  }
}`,
    opt: ['复杂数据']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc='使用 Checkbox.Group 进行多选组合'
  />
)
export default DemoBasic
