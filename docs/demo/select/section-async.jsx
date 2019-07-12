import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async'
const code = `
import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Select
          type='single'
          dataSource={{
            type: 'GET',
            headers: {token: 'tokenXXXXXXX'},
            mode: 'cors',
            credentials: 'same-origin',
            url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
            func: (res) => {
              console.log('----', res)
              return res.data
            }
          }}
          placeholder='请选择种类'
          style={{width: '200px'}}
          onChange={(item) => {
            console.log('异步单选结果', item)
          }}
        />
      </div>
    )
  }
}`
const DemoAsync = () => <DocViewer code={code} scope={{ Select }} prefix={prefix} />
export default DemoAsync
