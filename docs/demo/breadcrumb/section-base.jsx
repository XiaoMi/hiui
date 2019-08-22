import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Breadcrumb from '../../../components/breadcrumb'
const prefix = 'alert-base'
const code = `import React from 'react'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    const data = [{
      content: '首页',
      path: '/home'
    }, {
      content: '产品类',
      icon: 'document',
      path: '/product'
    }, {
      icon: 'component',
      path: '/phone'
    }, {
      content: '红米系列',
      path: '/redmi'
    }, {
      content: 'Note7',
      path: '/note7'
    }]
    return (
      <div>
        <Breadcrumb data={data}/>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Breadcrumb }} prefix={prefix} />
export default DemoBase
