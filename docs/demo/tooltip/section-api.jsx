import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'tooltip-api'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
class Demo extends React.Component {
  constructor() {
    super()
    Object.assign(this, {
      state: {
        showTooltip: false,
      },
      closure: undefined,
      toggleTooltip: () => {
        !this.state.showTooltip ?
          this.closure = Tooltip.open({ target: this.node, title: 'Click again to hide me.',  placement: 'right' }) :
          this.closure.close()
        this.setState(({ showTooltip }) => ({
          showTooltip: !showTooltip
        }))
      }
    })
  }

  render() {
    return (
      <div>
        <Button type="line" onClick={this.toggleTooltip}>{this.state.showTooltip ? 'Hide' : 'Show'} tooltip</Button>
        <p />
        <span ref={node => this.node = node}>
          <Button disabled>Show tooltip on me</Button>
        </span>
      </div>
    )
  }
}`

const DemoApi = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
  />
)
export default DemoApi
