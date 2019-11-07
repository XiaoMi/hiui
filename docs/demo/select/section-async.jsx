import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async'
const code = `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  render () {
    return (
      <Select
        type='single'
        dataSource={{
          type: 'GET',
          key: 'id',
          url: 'http://yapi.demo.qunar.com/mock/26534/hiui/select',
          transformResponse: (res) => {
            console.log('----', res)
            return res.list
          }
        }}
        placeholder='请选择种类'
        style={{ width: 200 }}
        onChange={(item) => {
          console.log('异步单选结果', item)
        }}
      />
    )
  }
}`
const DemoAsync = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
  />
)
export default DemoAsync
