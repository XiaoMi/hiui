import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-basic'
const desc = '面型直角标签 重要提示所处状态，如“已通过”、“审批中”'

const code = `import Tag from '@hiui/hiui/es/tag'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    
  }
  render () {
    return (
      <div>
        <Tag type="warning">待审批</Tag>
        <Tag>审批中</Tag>
        <Tag type="success">已通过</Tag>
        <Tag type="danger">未通过</Tag>
      </div>
    )
  }
}`

const Demo = () => <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
export default Demo
