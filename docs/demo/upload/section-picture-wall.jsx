import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-picture-wall'

const code = `
import React from 'react'
import Upload from '@hiui/hiui/es/upload'\n
class Demo extends React.Component {
  render () {
    return (
      <Upload
        type="photo"
        uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
        onChange = {(file, fileList, response) => {
          file.id = 'file唯一标识'
          console.log('upload callback', file, fileList, response)
        }}
        onRemove = {(file, fileList, index) => {
          console.log('remove callback', file, fileList, index)
          return new Promise((resolve, reject)=>resolve(true))
        }}
        param={{id:'uid',channel:'youpin'}}
        name={'files[]'}
        defaultFileList={[
          {
            name: 'a.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          },
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]}
      />
    )
  }
}`
const DemoPictureWall = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoPictureWall
