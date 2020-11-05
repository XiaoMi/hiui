import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Loading from '../../../components/loading'
const prefix = 'loading-base'
const desc = '耐心等待，正拼力加载…'
const code = `import React from 'react'
import Loading from '@hi-ui/hiui/es/loading'\n
class Demo extends React.Component {
  render () {
    return <div style={{display:'flex', height: 100, alignItems:'center', justifyContent:'space-around' }}>
      <Loading size="small"  duration={3000} />
      <Loading />
      <Loading size="large"/>
    </div>
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Loading }} prefix={prefix} desc={desc} />
export default DemoBase
