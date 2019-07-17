import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'upload-drag'
const code = `
import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="drag"
        uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
        headers={{name: 'mi'}}
        onChange = {(file, fileList, response) => {
          console.log('upload callback', file, fileList, response)
        }}
        hasBorder={true}
        param={{id:'uid',channel:'youpin'}}
        name={'files[]'}
        multiple={true}
      />
    )
  }
}`
const DemoDrag = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoDrag
