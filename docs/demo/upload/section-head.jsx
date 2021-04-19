import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-head'
const desc = '与其它组件配合使用，常见于名片、通讯录、账号管理等'
const code = `import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="avatar"
        width={180}
        height={180}
        uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
        headers={{name: 'mi'}}
        data={{id:'uid',channel:'youpin'}}
        onChange = {(file, fileList, response) => {
          console.log('upload callback', file, fileList, response)
        }}
        onRemove = {(file, fileList, index) => {
          console.log('remove callback', file, fileList, index)
          return new Promise((resolve, reject)=>resolve(true))
        }}
        name='uploadAvatar'
      />
    )
  }
}`
const DemoHead = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} desc={desc} />
export default DemoHead
