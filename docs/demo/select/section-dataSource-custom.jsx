import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-dataSource-custom'
const desc = '当搜索问题比较复杂的时候, 可以自定义搜索'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
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
        value={value}
        dataSource={(keyword)=>{
        console.log('HiRequest',keyword)
        const url = 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list?keyword='+keyword
        return fetch(url)
            .then((response)=> {
              return response.json();
            }).then(function(res) {
              return res.list
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
  <DocViewer code={code} scope={{ Select }} prefix={prefix} desc={desc} />
)
export default DemoAsync
