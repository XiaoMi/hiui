import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Counter from '../../../components/counter'
const prefix = 'counter-base'
const code = `import React from 'react'
import Counter from '@hi-ui/hiui/es/counter'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      value:4
    }
  }
  render() {
    return (
      <div>
        <Counter
          defaultValue='4'
          step='1'
          min='-10'
          max='10'
        />
        <p />
        <Counter
          value={this.state.value}
          step='2'
          min='2'
          max='8'
          onChange={(val) => {this.setState({value:val})}}
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
