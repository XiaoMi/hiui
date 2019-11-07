import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
const prefix = 'select-async-multiple'
const rightOptions = ['使用DataSource', '使用onSearch']
const code = [{
  code: `import React from 'react'
    import { Select } from '@hi-ui/hiui'\n
    class Demo extends React.Component {
      render () {
        return (
          <Select
          type='multiple'
          style={{width: '300px'}}
          placeholder='请选择...'
          dataSource={{
            type: 'GET',
            url: 'http://yapi.demo.qunar.com/mock/26534/hiui/select',
            key: 'id',
            transformResponse: (res) => {
              return res.list
            }
          }}
          onChange={(item) => {
            console.log('多选结果', item)
          }}
          />
        )
      }
    }`,
  opt: ['使用DataSource']
}, {
  code: `import React from 'react'
    import { Select } from '@hi-ui/hiui'\n
    class Demo extends React.Component {
      constructor () {
        super()
        this.state = {
          multipleList: []
        }
      }
      render () {
        return (
          <Select
          type='multiple'
          style={{width: '300px'}}
          data={this.state.multipleList}
          placeholder='请选择...'
          onSearch={(value) => {
            return fetch('http://yapi.demo.qunar.com/mock/26534/hiui/select?id='+value+'')
            .then(res => res.json())
            .then(res => {
              this.setState({
                multipleList: res.list
              })
            })
          }}
          onChange={(item) => {
            console.log('多选结果', item)
          }}
          />
        )
      }
    }`,
  opt: ['使用onSearch']
}]
const DemoSingleMultiple = () => (
  <DocViewer
    code={code}
    scope={{ Select }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoSingleMultiple
