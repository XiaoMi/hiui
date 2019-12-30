import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
const prefix = 'progress-word'
const desc = '突出加载的百分比，适用在有加载等待的场景'
const code = `import React from 'react'
import Progress from '@hi-ui/hiui/es/progress'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Progress percent={20} placement='inside' height={20} size='large'/>
        <br/>
        <Progress percent={30} placement='inside' type='success' content='成功' height={20} size='large'/>
        <br/>
        <Progress percent={10} placement='inside' type='warn' height={20} size='large'/>
      </div>
    )
  }
}`
const DemoWord = () => <DocViewer code={code} scope={{ Progress }} prefix={prefix} desc={desc} />
export default DemoWord
