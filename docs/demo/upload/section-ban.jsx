import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-ban'

const code = `
import React from 'react'
import Upload from '@hiui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="normal"
        uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
        buttonText="上传文件"
        param={{id:'uid',channel:'youpin'}}
        disabled={true}
      />
    )
  }
}`
const DemoBan = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoBan
