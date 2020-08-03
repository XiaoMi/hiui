import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
import HiRequest from '../../../components/_util/hi-request'
const prefix = 'select-dataSource-custom'
const desc = '当搜索问题比较复杂的时候, 可以自定义搜索'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
import {HiRequest} from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['1']
    }
  }
  render () {
    const {value} = this.state
    return (
      <Select
        type='single'
        dataSource={(keyword)=>{
        console.log('HiRequest',keyword)
        const url = 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list?keyword='+keyword
        
        return HiRequest.get(url)
                .then(res=>{
                    if(res.status === 200){
                        return res.data.list
                    } 
                    return []
                })
        }}
        placeholder='请选择'
        style={{ width: 200 }}
        onChange={(item) => {
          console.log('异步单选结果', item)
          this.setState({
            value:item
          })
        }}
      />
    )
  }
}`
const DemoAsync = () => (
  <DocViewer
    code={code}
    scope={{ Select, HiRequest }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoAsync
