import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'Upload-custom'

const code = `import React from 'react'
import Upload from '@hi-ui/hiui/es/upload'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      fileList: [
        {
          name: 'a.png',
          fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
          uploadState: 'success' // 上传状态，可取值success, error
        },
        {
          name: 'b.png',
          fileType: 'img',
          uploadState: 'error'
        }
      ]
    }
  }
  render () {
    const {
      fileList
    } = this.state

    return (
      <div>
        <Upload
          type="normal"
          customUpload={files => {
            const _fileList = fileList.concat({
              name: files[0].name,
              fileType: files[0].name.slice(files[0].name.lastIndexOf('.') + 1).toLowerCase(),
              uploadState: 'success'
            })
            this.setState({
              fileList: _fileList
            })
          }}
          content="上传文件"
          fileList={fileList}
        />
      </div>
    )
  }
}`
const DemoCustom = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoCustom
