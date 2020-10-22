import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
import HiRequest from '../../../components/_util/hi-request'
const prefix = 'Upload-custom'
const leftOptions = ['自定义上传', '结合HiRequest']
const code = [
  {
    code: `import React from 'react'
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
    }`,
    opt: ['自定义上传']
  },
  {
    code: `import React from 'react'
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
                HiRequest.upload({
                  url:'https://jsonplaceholder.typicode.com/posts/',
                  name: 'filename', // 文件参数
                  file: '', // 文件
                  params: {
                    id:1
                  },
                  headers: {
                    token:'token'
                  },
                  onUploadProgress: (event) => {
                    // 上传进度
                    console.log(event)
                  }
                }).then((res) => {
                  console.log('res',res)
                  if (res.status === 200) {
                    // 返回结果
                    const _fileList = fileList.concat({
                      name: files[0].name,
                      fileType: files[0].name.slice(files[0].name.lastIndexOf('.') + 1).toLowerCase(),
                      uploadState: 'success'
                    })
                    this.setState({
                      fileList: _fileList
                    })
                  } else {
                    onerror(res.response)
                  }
                }).catch(error => {
                  console.log(error.response)
                });
                
               
              }}
              content="上传文件"
              fileList={fileList}
            />
          </div>
        )
      }
    }`,
    opt: ['结合HiRequest']
  }
]
const DemoCustom = () => (
  <DocViewer code={code} scope={{ Upload, HiRequest }} prefix={prefix} leftOptions={leftOptions} />
)
export default DemoCustom
