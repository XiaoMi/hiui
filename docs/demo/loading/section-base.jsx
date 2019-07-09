import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Loading from '../../../components/loading'
const prefix = 'loading-base'
const code = `
import React from 'react'
import Loading from '@hiui/hiui/es/loading'\n
class Demo extends React.Component {
  render () {
    return <div style={{display:'flex', height: 100}}>
      <Loading size="small"/>
      <Loading />
      <Loading size="large"/>
    </div>
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Loading }} prefix={prefix} />
export default DemoBase
