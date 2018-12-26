import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import shallowequal from 'shallowequal'
import AJAX from './tool'

export default class Upload extends Component {
  constructor (props) {
    super(props)
    const fileList = this.props.defaultFileList
    this.state = {
      fileList
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowequal(nextProps.defaultFileList, this.props.defaultFileList)) {
      this.setState({
        fileList: nextProps.defaultFileList
      })
    }
  }

  static propTypes = {
    uploadType: PropTypes.string,
    accept: PropTypes.string,
    limit: PropTypes.number,
    buttonText: PropTypes.string,
    buttonIcon: PropTypes.string,
    uploadAction: PropTypes.string,
    param: PropTypes.object,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    headers: PropTypes.object,
    showUploadList: PropTypes.bool,
    multiple: PropTypes.bool,
    onUploadSuccess: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    deleteParam: PropTypes.object,
    defaultFileList: PropTypes.array
  }

  static defaultProps = {
    defaultFileList: [],
    accept: '',
    limit: null,
    buttonIcon: 'upload',
    uploadAction: '',
    param: null,
    name: 'file',
    disabled: false,
    headers: null,
    showUploadList: true,
    multiple: false
    // overEvent: false
  }

  getFileType (file) {
    let ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
    let fileType = ''

    switch (ext) {
      case 'jpg':
      case 'gif':
      case 'png':
      case 'bmp':
        fileType = 'img'
        break
      case 'rar':
      case 'zip':
        fileType = 'zip'
        break
      case 'doc':
      case 'dcox':
        fileType = 'word'
        break
      case 'pdf':
        fileType = 'pdf'
        break
      case 'ppt':
      case 'pptx':
        fileType = 'ppt'
        break
      case 'xls':
      case 'xlsx':
        fileType = 'excel'
        break
      default:
        fileType = 'other'
        break
    }
    return fileType
  }

  uploadFiles (files) {
    const {
      fileList
    } = this.state

    if (files.length === 0) return
    for (let key in files) {
      if (!files.hasOwnProperty(key)) continue
      let file = files[key]
      file.uploadState = 'loading'
      file.fileType = this.getFileType(file)
      fileList.unshift(file)
      this.setState({ fileList })
      this.uploadFile(file)
    }
    ReactDOM.findDOMNode(this.refs.upload).value = ''
  }

  deleteFile (index) {
    const {
      fileList
    } = this.state
    const {
      deleteParam,
      onDeleteSuccess
    } = this.props

    fileList.splice(index, 1)

    if (deleteParam) {
      deleteParam.success = (res) => {
        this.setState({
          fileList
        }, () => {
          deleteParam.onDeleteSuccess && deleteParam.onDeleteSuccess({
            res: res,
            deletePos: index
          })
        })
      }
      AJAX(deleteParam)
    } else {
      this.setState({
        fileList
      }, () => {
        onDeleteSuccess && onDeleteSuccess({
          deletePos: index
        })
      })
    }
  }

  uploadFile (file) {
    const FileReader = window.FileReader
    const XMLHttpRequest = window.XMLHttpRequest
    const FormData = window.FormData
    const fr = new FileReader()
    const {
      fileList
    } = this.state
    const {
      name,
      param,
      onUploadSuccess,
      headers,
      uploadAction
    } = this.props

    fr.onload = e => {
      const url = e.target.result
      file.url = url
      this.setState({ fileList })
    }
    fr.readAsDataURL(file)

    let xhr = new XMLHttpRequest()
    let formFile = new FormData()
    formFile.append(name, file)
    // 设置除file外需要带入的参数
    if (param) {
      for (let i in param) {
        formFile.append(i, param[i])
      }
    }
    xhr.upload.onload = () => {
      file.uploadState = 'success'
      this.setState({ fileList })
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onUploadSuccess && onUploadSuccess(JSON.parse(xhr.response))
        }
      }
    }
    xhr.upload.onerror = () => {
      file.uploadState = 'error'
      this.setState({ fileList })
    }
    xhr.upload.onprogress = event => {
      var e = event || window.event
      var percentComplete = Math.ceil(e.loaded / e.total * 100)
      file.progressNumber = percentComplete
      this.setState({ fileList })
    }

    xhr.open('post', uploadAction, true)
    // 设置用户传入的请求头
    if (headers) {
      for (let j in headers) {
        xhr.setRequestHeader(j, headers[j])
      }
    }
    xhr.send(formFile)
  }
}
