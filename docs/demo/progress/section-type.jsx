import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
const prefix = 'progress-type'
const code = `
import React from 'reac
import Progress from '@hiui/hiui/es/progress'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Progress percent={10}/>
        <br/>
        <Progress percent={10} withOutText/>
        <br/>
        <Progress size='middle' status='success' text='成功' percent={40}/>
        <br/>
        <Progress size='small' status='warn' text='错误' percent={50}/>
        <br/>
        <Progress size='small' status='error' text='警示' percent={100}/>
      </div>
    )
  }
}`

const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Progress }}
    prefix={prefix}
  />
)
export default DemoType
