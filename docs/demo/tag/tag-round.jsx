import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-round'
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
        <Tag type="warning" onClick={()=>{console.log('待审批')}} shape="square">待审批</Tag>
        <Tag shape="square">审批中</Tag>
        <Tag type="success" shape="square">已通过</Tag>
        <Tag type="danger" shape="square"  appearance="line">未通过</Tag>
        <Tag type="default" shape="square"  appearance="line">未通过</Tag>
      </>
    )
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
)
export default Demo
