import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async-multiple'
const code = `
import React from 'react'
import Select from '@hiui/hiui/es/select'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Select
          type='multiple'
          autoload
          style={{width: '300px'}}
          multipleWrap="nowrap"
          value="1"
          dataSource={{
            type: 'get',
            key: 'text',
            keyword: 'xiaomi',
            url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
            func: (res) => {
              console.log('----', res)
              return res.data
            },
            error: err => console.log('error:', err)
          }}
          onChange={(item) => {
            console.log('异步多选结果', item)
          }}
        />
      </div>
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
