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
        autoload
        style={{ width: 300 }}
        defaultValue={1}
        dataSource={{
          type: 'get',
          key: 'text',
          keyword: 'xiaomi',
          url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
          transformResponse: (res) => {
            console.log('----', res)
            return res.data
          },
          error: err => console.log('error:', err)
        }}
        onChange={(item) => {
          console.log('异步多选结果', item)
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
