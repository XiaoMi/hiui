import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Popover from '../../../components/popover'
import Button from '../../../components/button'
const prefix = 'Popover-base'
const code = `
import React from 'react'
<<<<<<< HEAD
import Button from '@hi-ui/hiui/es/button'
import Popover from '@hi-ui/hiui/es/popover'\n
=======
import Button from '@hi-ui/hiui/es/button'
import Popover from '@hi-ui/hiui/es/popover'\n
>>>>>>> 96193778cf65d94b39118960f8b50c323cf9ca4d
class Demo extends React.Component {
  render() {
    const title = <span>Popover Title</span>
    const content = (
      <div>
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
      </div>
    )

    return (
      <div>
        <Popover title={title} content={content} style={{margin: '10px 10px'}}>
          <Button type="line">Top & click触发</Button>
        </Popover>
        <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="right" trigger="hover">
          <Button type="success">Right & hover触发</Button>
        </Popover>
        <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="bottom" trigger="focus">
          <Button type="warning">Bottom & focus触发</Button>
        </Popover>
        <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="left" trigger="click">
          <Button type="danger">Popover Left</Button>
        </Popover>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Popover, Button }}
    prefix={prefix}
  />
)
export default DemoBase
