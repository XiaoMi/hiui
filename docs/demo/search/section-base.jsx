import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Search from '../../../components/search'
const prefix = 'search-base'
const leftOptions = ['基础', '禁用']
const desc = '按搜索关键字直接请求结果'
const code = [
  {
    code: `import React from 'react'
import Search from '@hi-ui/hiui/es/Search'

class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      data: [
        {
          id:'hot',
          title:'热门搜索',
          children :[
            {
              id: 1,
              title: '手机'
            },
            {
              id: 2,
              title: '电视'
            },
            {
              id: 3,
              title: '小爱音响'
            },
            {
              id: 4,
              title: '电脑'
            },
            {
              id: 5,
              title: '冰箱'
            },
          ]
        },
        {
          id:'more',
          title:<a style={{textAlign: 'center', display: 'block'}} href="https://www.mi.com/" target="_blank">查看更多</a>,
        }
      ],
      loading:false
    }
  }

  searchData(keyword){
    this.setState({
      loading:true,
      data:[]
    })
    setTimeout(()=>{
      this.setState({
        loading:false,
        data:[
          {
            id: 1,
            title: '手机'
          },
          {
            id: 2,
            title: '电视'
          },
        ]
      })
    },2000)
  }
  render() {
    const {data,loading} = this.state
    return (
      <Search 
        style={{ width: 260 }}
        placeholder='搜索关键字'
        loading={loading}
        data={data}
        onChange = {(keyword) => {
          console.log('onChange Value', keyword)
          this.searchData(keyword)
        }}
        onSearch = {(keyword) => {
          console.log('Input Value', keyword)
          
        }}
      />
    )
  }
}`,
    opt: ['基础']
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
    scope={{ Search }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
