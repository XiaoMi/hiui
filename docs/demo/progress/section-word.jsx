import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
const prefix = 'progress-word'
const code = `
import React from 'react'
import Progress from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Progress percent={20} inside height={20}/>
        <br/>
        <Progress percent={30} inside status='success' text='成功' height={20}/>
        <br/>
        <Progress percent={10} inside status='warn' height={20}/>
      </div>
    )
  }
}`
const DemoWord = () => (
  <DocViewer
    code={code}
    scope={{ Progress }}
    prefix={prefix}
  />
)
export default DemoWord
