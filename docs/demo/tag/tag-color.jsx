import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-basic'
const desc = '标签的信息重要级别高，识别度较高'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    
  }
  render () {
    return (
      <>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span> <Tag type="warning" onClick={()=>{console.log('待审批')}}>待审批</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span> <Tag>审批中</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="success">已通过</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="danger">未通过</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="default">未通过</Tag>
      </div>
      </>
    )
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
)
export default Demo
