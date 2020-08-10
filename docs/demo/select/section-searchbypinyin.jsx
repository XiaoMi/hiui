import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
import Pinyin from 'pinyin-match'
const prefix = 'select-async'
const desc = '通过输入拼音搜索关键字'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
import Pinyin from 'pinyin-match'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['1'],
      data:[ 
        { title:'平板', id:'1' },
        { title:'手机', id:'2' },
        { title:'电脑', id:'3' },
        { title:'音响', id:'4', disabled: true },
        { title:'电视', id:'5' },
        { title:'耳机', id:'6' },
      ]
    }
  }
  render () {
    const {value,data} = this.state
    return (
      <Select
        type='single'
        value={value}
        data={data}
        placeholder='请选择'
        searchable
        style={{ width: 200 }}
        filterOption={(keyword, item) => {
          return !!Pinyin.match(item.title, keyword)
        }}
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
    scope={{ Select, Pinyin }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoAsync
