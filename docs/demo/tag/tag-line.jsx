import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-line'
const desc = '线型直角标签 一般提示内容，如“原创”、“活动”'

const code = `import Tag from '@hiui/hiui/es/tag'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    
  }
  render () {
    return (
      <div>
        <Tag type="warning" appearance="line">原创</Tag>
        <Tag appearance="line">活动</Tag>
        <Tag type="success" appearance="line">聚焦</Tag>
        <Tag type="danger" appearance="line">最新</Tag>
      </div>
    )
  }
}`

const Demo = () => <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
export default Demo
