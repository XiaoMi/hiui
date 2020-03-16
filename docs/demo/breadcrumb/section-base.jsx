import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Breadcrumb from '../../../components/breadcrumb'
const prefix = 'alert-base'
const desc = '明确访问路径的每一个节点'
const code = `import React from 'react'
import Breadcrumb from '@hi-ui/hiui/es/breadcrumb'\n
class Demo extends React.Component {
  render () {
    const data = [{
      content: '首页',
      path: '/home'
    }, {
      content: '列表',
      path: '/list'
    }, {
      content: '手机详情',
      path: '/phone'
    }]
    return (
      <div>
        <Breadcrumb data={data}/>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Breadcrumb }} prefix={prefix} desc={desc} />
export default DemoBase
