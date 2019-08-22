import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Breadcrumb from '../../../components/breadcrumb'
const prefix = 'breadcrumb-base'
const code = `import React from 'react'
import Breadcrumb from '@hi-ui/hiui/es/Breadcrumb'\n
class Demo extends React.Component {
  render () {
    const data = [{
      content: '首页',
      path: '/home'
    }, {
      icon: 'document',
      path: '/product'
    }, {
      icon: 'component',
      content: '手机',
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
        <Breadcrumb data={data} separator=">"/>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Breadcrumb }} prefix={prefix} />
export default DemoBase
