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
        <Tag color="#FF845B">#FF845B</Tag>
        <Tag color="#A7D7FA">#A7D7FA</Tag>
        <Tag appearance="line" color="#B450DE">#B450DE</Tag>
        <Tag appearance="line" color="#DB9B0F">#DB9B0F</Tag>
        <Tag appearance="line" color="#F44141">#F44141</Tag>
     </>
    )
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
)
export default Demo
