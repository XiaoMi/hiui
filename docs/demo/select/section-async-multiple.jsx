import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async-multiple'
const code = `import React from 'react'
import { Select } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  render () {
    return (
      <Select
      type='multiple'
      style={{width: '300px'}}
      placeholder='请选择...'
      dataSource={keyword => {
        return ({
          type: 'GET',
          url: 'http://yapi.demo.qunar.com/mock/26534/hiui/select',
          params:{id: keyword},
          transformResponse: (res) => {
            return res.list
          }
        })

      }}
      onChange={(item) => {
        console.log('多选结果', item)
      }}
      />
    )
  }
}`
const DemoSingleMultiple = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoSingleMultiple
