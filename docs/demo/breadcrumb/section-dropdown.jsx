import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Breadcrumb from '../../../components/breadcrumb'
import Dropdown from '../../../components/dropdown'
const prefix = 'breadcrumd-dropdown'
const desc = '面包屑和下拉菜单结合'
const code = `import React from 'react'
import Breadcrumb from '@hi-ui/hiui/es/breadcrumb'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        list:[
          {
            id: 0,
            title: '小米商城',
            href:'https://www.mi.com/index.html'
          }, {
            id: 1,
            title: '小米社区',
            href:'https://www.mi.com/index.html'
          }
        ]
    }
  }
  render () {
    const {list} = this.state
    const contentDrop = (
      <Dropdown data={list} width={100} title={<span style={{fontSize:'12px',color:"#666"}}>分类</span>} onClick={(data)=>{
        console.log('data',data)
      }} />
    )
    const data = [{
      content: '首页',
      path: '/home'
    }, {
      content: '列表',
      path: '/list'
    }, {
      content: contentDrop,
    },{
      content: '手机详情',
      path: '/phone'
    }]
    return (
      <div>
        <Breadcrumb data={data} onClick={(path)=>{
          console.log('go path: ',path)
        }}/>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Breadcrumb, Dropdown }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
