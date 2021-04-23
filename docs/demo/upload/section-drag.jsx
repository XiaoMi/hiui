import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'upload-drag'
const desc = '附件上传的区域固定且宽敞，上传附件数量较多，拖拽可有效提高效率'
const code = `import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="drag"
        uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
        headers={{name: 'mi'}}
        onChange = {(file, fileList, response) => {
          console.log('upload callback', file, fileList, response)
        }}
        tips='仅支持 jpg/png 文件，且不超过 500kb'
        hasBorder={true}
        data={{id:'uid',channel:'youpin'}}
        name={'files[]'}
        multiple={true}
      />
    )
  }
}`
const DemoDrag = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} desc={desc} />
export default DemoDrag
