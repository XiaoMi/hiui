import Tag from '../../../components/tag/'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-basic'
const desc = '标签的信息重要级别高，识别度较高,建议使用HIUI主题色'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    
  }
  render () {
    return (
      <>
        <Tag color="#4285F4">#4285F4</Tag>
        <Tag color="#46BC99">#46BC99</Tag>
        <Tag color="#FF5975">#FF5975</Tag>
        <Tag color="#B450DE">#B450DE</Tag>
        <Tag color="#3DA8F5">#3DA8F5</Tag>
     </>
    )
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tag }} desc={desc} prefix={prefix} />
)
export default Demo
