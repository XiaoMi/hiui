import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Search from '../../../components/search'
import Button from '../../../components/button'
const prefix = 'search-base'
const leftOptions = ['基础用法', '自定义按钮', '禁用']
const desc = '按搜索关键字直接请求结果'
const code = [
  {
    code: `import React from 'react'
import Search from '@hi-ui/hiui/es/Search'

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Search 
        style={{ width: 260 }}
        placeholder='搜索关键字'
        onSearch = {(keyword) => {
          console.log('Input Value', keyword)
          keyword && alert('Input Value: '+ keyword)
        }}
      />
      </div>
      
    )
  }
}`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
import Search from '@hi-ui/hiui/es/Search'

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Search 
        style={{ width: 260 }}
        placeholder='搜索关键字'
        append={<Button type="line">搜索</Button>}
        onSearch = {(keyword) => {
          console.log('Input Value', keyword)
          keyword && alert('Input Value: '+ keyword)
        }}
      />
      </div>
      
    )
  }
}`,
    opt: ['自定义按钮']
  },

  {
    code: `import React from 'react'
import Search from '@hi-ui/hiui/es/Search'
class Demo extends React.Component {
  render() {
    return (
      <Search 
        style={{ width: 250 }}
        placeholder='搜索关键字'
        disabled
        onSearch = {(title) => {
          console.log('Input Value', title)
        }}
      />
    )
  }
}`,
    opt: ['禁用']
  }
]
const DemoBase = () => (
  <DocViewer
    code={code}
    leftOptions={leftOptions}
    scope={{ Search, Button }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
