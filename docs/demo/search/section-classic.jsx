import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Search from '../../../components/search'
import Select from '../../../components/select'
const prefix = 'search-classic'
const desc = '按不同的类别划分搜索范围；可减少搜索成本'
const code = `import React from 'react'
import Search from '@hi-ui/hiui/es/Search'

class Demo extends React.Component {
  constructor () {
    super()
    
  }
  render() {
    const prepend = <Select
      type='single'
      clearable={false}
      style={{ width: 90 }}
      onChange = {(selectedIds, changedItem)=>{
        console.log(selectedIds, changedItem)
      }}
      data={[
        { title:'订单号', id:'1' },
        { title:'用户名', id:'2' },
      ]}
      defaultValue='1'
    />
    return (
      <Search 
        style={{ width: 360 }}
        placeholder='搜索关键字'
        prepend={prepend}
        
        onSearch = {(title) => {
          console.log('Input Value', title)
        }}
      />
    )
  }
}`
const DemoClassic = () => (
  <DocViewer
    code={code}
    scope={{ Search, Select }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoClassic
