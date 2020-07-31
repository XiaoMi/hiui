import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async'
const desc =
  '备选项数量较大时，通过搜索选项关键词调取存储于服务端数据备选项的一个或多个'
const rightOptions = ['单选', '多选']
const code = [
  {
    code: `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  render () {
    return (
      <Select
        type='single'
        dataSource={{
          method: 'GET',
          key: 'id',
          url: 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list',
          transformResponse: (res) => {
            if(res.status === 200){
              return res.data.list
            }
            return []
          }
        }}
        placeholder='请选择'
        style={{ width: 200 }}
        onChange={(item) => {
          console.log('异步单选结果', item)
        }}
      />
    )
  }
}`,
    opt: ['单选']
  },
  {
    code: `import React from 'react'
import { Select } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  render () {
    return (
      <Select
      type='multiple'
      style={{width: '300px'}}
      placeholder='请选择'
      dataSource={keyword => {
        return ({
          type: 'GET',
          url: 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list',
          params:{id: keyword},
          transformResponse: (res) => {
            if(res.status === 200){
              return res.data.list
            }
            return []
          }
        })

      }}
      onChange={(item) => {
        console.log('多选结果', item)
      }}
      />
    )
  }
}`,
    opt: ['多选']
  }
]
const DemoAsync = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoAsync
