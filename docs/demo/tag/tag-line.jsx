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
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="warning" appearance="line" >原创</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag appearance="line" >活动</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="success" appearance="line"  style={{marginRight:10}}>聚焦</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="danger" appearance="line" >最新</Tag>
      </div>
      <div style={{marginBottom:28}}>
      <span style={{marginRight:10}}>加班申请</span><Tag type="default" appearance="line" >最新</Tag>
      </div>
     </>
    )
  }
}`
const Demo = () => (
  <DocViewer code={code} scope={{ Tag, Grid }} desc={desc} prefix={prefix} />
)
export default Demo
