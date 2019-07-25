import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
const prefix = 'progress-type'
const code = `import React from 'reac
import Progress from '@hi-ui/hiui/es/progress'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Progress percent={10} size='large'/>
        <br/>
        <Progress percent={10} showInfo={false} size='large'/>
        <br/>
        <Progress  type='success' content='成功' percent={40}/>
        <br/>
        <Progress size='small' type='warn' content='错误' percent={50}/>
        <br/>
        <Progress size='small' type='error' content='警示' percent={100}/>
      </div>
    )
  }
}`

const DemoType = () => <DocViewer code={code} scope={{ Progress }} prefix={prefix} />
export default DemoType
