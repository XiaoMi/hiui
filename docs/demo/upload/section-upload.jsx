import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Upload from '../../../components/upload'
const prefix = 'upload-upload'
const leftOptions = ['基础','动态上传地址', '禁用', '默认']
const desc = '突出上传附件的操作入口，节省页面空间'
const code = [
  {code: `import React from 'react'
    import Upload from '@hi-ui/hiui/es/upload'\n
    import Icon from '@hi-ui/hiui/es/icon'\n
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
              uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
              tips='仅支持 jpg/png 文件，且不超过 500kb'
              headers={{name: 'mi'}}
              content='上传文件'
              param={param}
              name={'files[]'}
              onChange = {(file, fileList, response) => {
                console.log('upload callback', file, fileList, response)
                // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
              }}
              disabled={false}
            />
          </div>
        )
      }
    }`,
  opt: ['基础']
  }, 
  {code: `import React from 'react'
    import Upload from '@hi-ui/hiui/es/upload'\n
    import Icon from '@hi-ui/hiui/es/icon'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state={param:{id:'uid',channel:'youpin'}}
      }
      getUploadAction(file) {
        console.log('file',file)
        return new Promise(function(resolve, reject){
          setTimeout(()=>{
              resolve("http://www.mocky.io/v2/5dc3b4413000007600347501?name="+file.name); 
          }, 200);
        })
      }
      render () {
        const param = this.state.param
        return (
          <div>
            <Upload
              type="normal"
              uploadAction= {this.getUploadAction.bind(this)}
              tips='仅支持 jpg/png 文件，且不超过 500kb'
              headers={{name: 'mi'}}
              content='上传文件'
              param={param}
              name={'files[]'}
              onChange = {(file, fileList, response) => {
                console.log('upload callback', file, fileList, response)
                // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
              }}
              disabled={false}
            />
          </div>
        )
      }
    }`,
  opt: ['动态上传地址']
  }, 
  {code: `import React from 'react'
  import Upload from '@hi-ui/hiui/es/upload'\n
  class Demo extends React.Component {
    render () {
      return (
        <Upload
          type="normal"
          tips='仅支持 jpg/png 文件，且不超过 500kb'
          uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
          content='上传文件'
          params={{id:'uid',channel:'youpin'}}
          disabled={true}
        />
      )
    }
  }`,
  opt: ['禁用']},
  { code: `import React from 'react'
  import Upload from '@hi-ui/hiui/es/upload'\n
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
            tips='仅支持 jpg/png 文件，且不超过 500kb'
            uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
            content='上传文件'
            params={param}
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
  }`,
  opt: ['默认']}]

const DemoUpload = () => <DocViewer leftOptions={leftOptions} code={code} scope={{ Upload }} prefix={prefix} desc={desc} />
export default DemoUpload
