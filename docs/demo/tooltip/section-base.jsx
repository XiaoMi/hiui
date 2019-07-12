import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Tooltip from '../../../components/tooltip'
const prefix = 'tooltip-base'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Tooltip from '@hi-ui/hiui/es/tooltip'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Tooltip title="tooltip top" style={{margin: '0 10px'}}>
          <Button type="line">Tooltip Top</Button>
        </Tooltip>
        <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right">
          <Button type="success">Tooltip Right</Button>
        </Tooltip>
        <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom">
          <Button type="warning">Tooltip Bottom</Button>
        </Tooltip>
        <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left">
          <Button type="danger">Tooltip Left</Button>
        </Tooltip>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Button, Tooltip }} prefix={prefix} />
export default DemoBase
