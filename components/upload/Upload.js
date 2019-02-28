import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import shallowEqual from 'shallowequal'
import cloneDeep from 'lodash/cloneDeep'

let fileId = 0

export default class Upload extends Component {
  constructor (props) {
    super(props)
    const fileList = this.prepareDefaultFileList(this.props.defaultFileList)
    this.state = {
      fileList
    }
  }

  static propTypes = {
    type: PropTypes.string,
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
    onChange: PropTypes.func,
    customUpload: PropTypes.func,
    beforeUpload: PropTypes.func,
    defaultFileList: PropTypes.array,
    onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
  }

  static defaultProps = {
    defaultFileList: [],
    // headers: {'Content-type': 'multipart/form-data'}, // headers 不可以设置Content-type https://stackoverflow.com/questions/17415084/multipart-data-post-using-python-requests-no-multipart-boundary-was-found/17438575
    headers: {},
    accept: '',
    limit: null,
    buttonIcon: 'upload',
    uploadAction: '',
    param: null,
    name: 'file',
    disabled: false,
    showUploadList: true,
    multiple: false,
    beforeUpload: () => true,
    onRemove: () => true,
    onChange: () => true
    // overEvent: false
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.defaultFileList, this.props.defaultFileList)) {
      this.setState({
        fileList: this.prepareDefaultFileList(nextProps.defaultFileList)
      })
    }
  }

  prepareDefaultFileList (fileList) {
    const _fileList = cloneDeep(fileList)

    _fileList.map(file => {
      file.fileId = this.getFileId()
    })
    return _fileList
  }

  getFileType (file) {
    let ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
    let fileType = ''

    switch (ext) {
      case 'jpg':
      case 'jpeg':
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

  getFileId () {
    return `$$HIUI_FILE_ID_${fileId++}`
  }

  uploadFiles (files) {
    const {
      beforeUpload,
      customUpload
    } = this.props
    const {
      fileList
    } = this.state

    if (!beforeUpload(files, fileList)) {
      return
    }
    if (customUpload) {
      customUpload(files)
      return
    }

    if (files.length === 0) return
    for (let key in files) {
      if (!files.hasOwnProperty(key)) continue
      let file = files[key]
      file.fileId = this.getFileId()
      file.uploadState = 'loading'
      file.fileType = this.getFileType(file)
      fileList.unshift(file)
      this.setState({ fileList })
      this.uploadFile(file)
    }
    ReactDOM.findDOMNode(this.uploadRef).value = ''
  }

  deleteFile (file, index) {
    const {
      fileList
    } = this.state
    const {
      onRemove
    } = this.props
    const doRemove = () => {
      fileList.splice(index, 1)
      this.setState({fileList})
    }
    const ret = onRemove(file, fileList, index)
    if (ret === true) {
      doRemove()
    } else if (ret && typeof ret.then === 'function') {
      ret.then(res => {
        if (res === true) {
          doRemove()
        }
      })
    }
  }

  onUpload (file, fileList, response) {
    const {
      onChange
    } = this.props
    const ret = onChange(file, fileList, response)
    const onUploadError = () => {
      for (const index in fileList) {
        if (fileList[index].fileId === file.fileId) {
          fileList.splice(index, 1)
          this.setState({fileList})
          break
        }
      }
    }

    if (ret === false) {
      onUploadError()
    } else if (ret && typeof ret.then === 'function') {
      ret.then(res => {
        if (res === false) {
          onUploadError()
        }
      })
    }
  }

  uploadFile (file, dataUrl = '') {
    const FileReader = window.FileReader
    const XMLHttpRequest = window.XMLHttpRequest
    const FormData = window.FormData
    const {
      fileList
    } = this.state
    const {
      name,
      param,
      headers,
      uploadAction
    } = this.props
    const onerror = () => {
      file.uploadState = 'error'
      this.setState({ fileList })
      this.onUpload(file, fileList, {})
    }

    if (file.fileType === 'img') { // 用来图片预览
      if (dataUrl) {
        file.url = dataUrl
      } else if (dataUrl !== false) {
        const fr = new FileReader()

        fr.onload = e => {
          const url = e.target.result
          file.url = url
          this.setState({ fileList })
        }
        fr.readAsDataURL(file)
      }
    }

    let xhr = new XMLHttpRequest()
    let formFile = new FormData()

    if (dataUrl) {
      formFile.append(name, dataUrl)
    } else {
      formFile.append(name, file)
    }
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
          this.onUpload(file, fileList, JSON.parse(xhr.response))
        } else {
          onerror()
        }
      }
    }
    xhr.upload.onerror = () => {
      onerror()
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

  uploadStatusIcon (status) {
    switch (status) {
      case 'success':
        return 'right'

      case 'error':
        return 'warning'

      default:
        return ''
    }
  }
}
