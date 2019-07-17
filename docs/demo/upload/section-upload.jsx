import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'upload-upload'
const code = `
import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
import Icon from '@hi-ui/hiui/es/icon'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state={param:{id:'uid',channel:'youpin'}}
  }
  render () {
    const param = this.state.param
    return (
      <div>
        <Upload
          type="normal"
          uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
          headers={{name: 'mi'}}
          content='选择文件'
          param={param}
          name={'files[]'}
          onChange = {(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
            // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
          }}
          disabled={false}
        />
      </div>
    )
  }
}`

const DemoUpload = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoUpload
