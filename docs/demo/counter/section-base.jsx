import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Counter from '../../../components/counter'
const prefix = 'counter-base'
const code = `
import React from 'react'
import Counter from '@hi-ui/hiui/es/counter'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false
    }
  }
  render() {
    return (
      <div>
        <Counter
          value='4'
          step='1'
          min='-10'
          max='10'
          onChange={(val) => console.log('变化后的值：', val)}
        />

        <Counter
          value='8888'
          step='2'
          min='2'
          max='8'
          disabled={this.state.disabled}
          onChange={(e, val) => {console.log('----val', e, val)}}
        />
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Counter }}
    prefix={prefix}
  />
)
export default DemoBase
