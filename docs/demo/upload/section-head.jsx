import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-head'

const code = `
import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="avatar"
        width={180}
        height={180}
        uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
        headers={{name: 'mi'}}
        param={{id:'uid',channel:'youpin'}}
        onChange = {(file, fileList, response) => {
          console.log('upload callback', file, fileList, response)
        }}
        name='uploadAvatar'
      />
    )
  }
}`
const DemoHead = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoHead
