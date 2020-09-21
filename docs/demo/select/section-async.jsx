import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async'
const desc = '备选项数量较大时，通过搜索选项关键词调取存储于服务端数据备选项的一个或多个'
const rightOptions = ['异步简易用法', '异步函数用法', '异步受控']
const code = [
  {
    code: `import React from 'react'
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
        dataSource={{
          method: 'GET',
          key: 'id',
          url: 'https://mife-gallery.test.mi.com/hiui/stores',
          transformResponse: (res) => {
            if(res.status === 200){
              return res.data.data
            }
            return []
          }
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
}`,
    opt: ['异步简易用法']
  },
  {
    code: `import React from 'react'
import { Select } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:['1','2']
    }
  }
  render () {
    const {value} = this.state
    return (
      <Select
      type='multiple'
      style={{width: '300px'}}
      placeholder='请选择'
      dataSource={keyword => {
        return ({
          type: 'GET',
          url: 'https://mife-gallery.test.mi.com/hiui/stores',
          params:{id: keyword},
          transformResponse: (res) => {
            if(res.status === 200){
              return res.data.data
            }
            return []
          }
        })

      }}
      onChange={(item) => {
        console.log('多选结果', item)
        this.setState({
          value:item
        })
      }}
      />
    )
  }
}`,
    opt: ['异步函数用法']
  },
  {
    code: `import React from 'react'
import { Select } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value:[],
      data: []
    }
    setTimeout(()=>{this.setState({
      value:['1','2'],
      data:[
        {
          id:'1',
          title:'固定值1'
        },
        {
          id:'2',
          title:'固定值2'
        }
      ]
    })},200)
  }
  render () {
    const {value, data} = this.state
    return (
      <Select
      // type='multiple'
      style={{width: '300px'}}
      placeholder='请选择'
      value={value}
      data={data}
      dataSource={keyword => {
        return ({
          type: 'GET',
          url: 'https://mife-gallery.test.mi.com/hiui/stores',
          params:{id: keyword},
          transformResponse: (res) => {
            if(res.status === 200){
              return res.data.data
            }
            return []
          }
        })

      }}
      onChange={(item) => {
        console.log('多选结果', item)
        this.setState({
          value:item
        })
      }}
      />
    )
  }
}`,
    opt: ['异步受控']
  }
]
const DemoAsync = () => (
  <DocViewer code={code} scope={{ Select }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoAsync
