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
        autoload
        dataSource={{
          type: 'GET',
          key: 'id',
          url: 'https://mife-gallery.test.mi.com/hiui/stores',
          transformResponse: (res) => {
            console.log('----', res)
            return res.data
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
          url: 'https://mife-gallery.test.mi.com/hiui/stores',
          params:{id: keyword},
          transformResponse: (res) => {
            return res.data
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
