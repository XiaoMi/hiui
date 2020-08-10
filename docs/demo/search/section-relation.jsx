import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Search from '../../../components/search'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
const prefix = 'search-relation'
const leftOptions = ['基础用法', '分组用法']
const desc = '输入搜索关键词时，可以自动联想匹配的关键字，提高检索效率'
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
            onChange = {(keyword) => {
              console.log('onChange Value', keyword)
              this.searchData(keyword)
            }}
            data={data}
            onSearch = {(keyword) => {
              console.log('Input Value', keyword)
            }}
          />
        )
      }
    }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
import Search from '@hi-ui/hiui/es/search'
import Button from '@hi-ui/hiui/es/Button'

class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
        data: []
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
            id:'miphone',
            title:'手机',
            children :[
              {
                id: 1,
                title: '小米9 Pro'
              },
              {
                id: 2,
                title: '小米9 探索版'
              },
              {
                id: 3,
                title: '小米9 CC 美图定制版'
              },
            ]
          },
          {
            id:'live',
            title:'智能生活',
            children:[
              {
                id: 4,
                title: '小米 手环'
              },
              {
                id: 5,
                title: '小米 净水器'
              },
              {
                id: 6,
                title: '小米 小爱音响'
              },
            ]
          },
          {
            id:'more',
            title:<a style={{textAlign: 'center', display: 'block'}} href="https://www.mi.com/" target="_blank">查看更多</a>,
          }
        ]
      })
    },2000)
  }
  render() {
    const { data,loading } = this.state
    return (
      <Search 
        style={{ width: 260 }}
        placeholder='搜索关键字'
        loading={loading}
        onChange = {(keyword) => {
          console.log('onChange Value', keyword)
          this.searchData(keyword)
        }}
        data = {data}
        onSearch = {(title) => {
          console.log('Input id', title)
        }}
      />
    )
  }
}`,
    opt: ['分组用法']
  }
]
const DemoRelation = () => (
  <DocViewer
    code={code}
    leftOptions={leftOptions}
    scope={{ Search, Icon, Button }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRelation
