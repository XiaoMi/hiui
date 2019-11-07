import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-ban'

const code = `import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="normal"
        uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
        buttonText="上传文件"
        params={{id:'uid',channel:'youpin'}}
        disabled={true}
      />
    )
  }
}`
const DemoBan = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoBan
