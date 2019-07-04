import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'upload-default'
const code = `
import React from 'react'
import Upload from '@hiui/hiui/es/upload'\n
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
          buttonText="上传文件"
          param={param}
          name={'files[]'}
          onChange = {(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          defaultFileList={[
            {
              name: 'a.png',
              fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
              uploadState: 'success', // 上传状态，可取值success, error
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            },
            {
              name: 'b.png',
              fileType: 'img',
              uploadState: 'error',
              url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
            }
          ]}
        />
      </div>
    )
  }
}`
const DemoDefault = () => <DocViewer code={code} scope={{ Upload }} prefix={prefix} />
export default DemoDefault
