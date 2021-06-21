import Tag from '../../../components/tag/'
import React from 'react'
import Grid from '../../../components/grid/index'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tag-line'
const desc = '一种基础标签，识别度一般，在深色背景里常用'

const code = `import Tag from '@hi-ui/hiui/es/tag'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    
  }
  render () {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <>
      <Tag type="warning" appearance="line" >原创</Tag>
      <Tag appearance="line" >活动</Tag>
      <Tag type="success" appearance="line"  style={{marginRight:10}}>聚焦</Tag>
      <Tag type="danger" appearance="line" >最新</Tag>
      <Tag type="default" appearance="line" >最新</Tag>
     </>
    )
  }
}`
const Demo = () => (
  <DocViewer code={code} scope={{ Tag, Grid }} desc={desc} prefix={prefix} />
)
export default Demo
