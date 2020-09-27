import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import shallowEqual from 'shallowequal'
import cloneDeep from 'lodash/cloneDeep'
import Modal from '../modal'
import Button from '../button'
import Icon from '../icon'

let fileId = 0

class Upload extends Component {
  constructor (props) {
    super(props)

    const fileList = this.prepareDefaultFileList(props.fileList || props.defaultFileList)
    this.state = {
      visibleModal: false,
      fileList,
      fileCountLimted: fileList.length >= props.maxCount
    }
  }
  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.fileList, this.props.fileList)) {
      this.setState({
        fileList: this.prepareDefaultFileList(nextProps.fileList),
        fileCountLimted: nextProps.fileList.length >= nextProps.maxCount
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
      case 'docx':
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
      case 'key':
        fileType = 'key'
        break
      case 'exe':
      case 'dmg':
        fileType = 'exe'
        break
      case 'mp4':
        fileType = 'video'
        break
      case 'mp3':
        fileType = 'audio'
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
  outMaxsizeTip () {
    const { localeDatas } = this.props
    if (this.state.visibleModal) {
      return (
        <Modal
          title={localeDatas.upload.modalTitle}
          style={{width: '480px'}}
          onCancel={this.cancelEvent}
          visible={this.state.visibleModal}
          footer={[
            <Button type='primary' key={0} onClick={this.cancelEvent}>{localeDatas.upload.modalBtn}</Button>
          ]}
        >
          <div className='hi-upload__modal-tips'>
            <Icon name='info-circle-o' style={{color: '#db9639', fontSize: '48px'}} />
            <div className='hi-upload__error—content'>
              <div className='hi-upload__error-title'>{localeDatas.upload.modalTiptitle}</div>
              <div className='hi-upload__error-info'>{localeDatas.upload.modalTiptxt}</div>
            </div>
          </div>
        </Modal>
      )
    }
    return null
  }

  cancelEvent = () => {
    this.setState({
      visibleModal: false
    })
  }

  uploadFiles (files) {
    const { beforeUpload, customUpload, maxSize } = this.props
    const { fileList, fileCountLimted } = this.state
    if (fileCountLimted) {
      return
    }
    if (!beforeUpload(files, fileList)) {
      return
    }
    if (customUpload) {
      customUpload(files)
      ReactDOM.findDOMNode(this.uploadRef).value = ''
      return
    }

    if (files.length === 0) return
    const _fileList = [...fileList]

    Object.keys(files).forEach((key) => {
      const file = files[key]
      if (file.size > maxSize * 1024) {
        this.setState({
          visibleModal: true
        })
        return
      }

      file.fileId = this.getFileId()
      file.uploadState = 'loading'
      file.fileType = this.getFileType(file)

      _fileList.unshift(file)
      this.setState({ fileList: _fileList }, () => {
        this.uploadFile(file)
      })
    })

    ReactDOM.findDOMNode(this.uploadRef).value = ''
  }

  deleteFile (file, index) {
    const { fileList } = this.state
    const { onRemove } = this.props
    const doRemove = () => {
      fileList.splice(index, 1)
      this.setState({ fileList, fileCountLimted: false })
    }
    const ret = onRemove(file, fileList, index)

    file.uploadState === 'loading' && file.xhr.abort()
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
    const { onChange, maxCount } = this.props
    const onUploadError = () => {
      for (const index in fileList) {
        if (fileList[index].fileId === file.fileId) {
          const _fileList = [...fileList]
          _fileList.splice(index, 1)
          this.setState({
            fileList: _fileList,
            fileCountLimted: _fileList.length >= this.props.maxCount
          })
          break
        }
      }
    }
    const changeResult = onChange(file, fileList, response)
    if (changeResult === false) {
      onUploadError()
    } else if (changeResult && typeof changeResult.then === 'function') {
      changeResult.then(res => {
        if (res === false) {
          onUploadError()
        }
      })
    } else {
      if (fileList.length >= maxCount) {
        this.setState({ fileCountLimted: true })
      }
    }
  }

  uploadFile = async(file, dataUrl = '') => {
    const FileReader = window.FileReader
    const XMLHttpRequest = window.XMLHttpRequest
    const FormData = window.FormData
    const { fileList } = this.state
    const { name, params, headers, uploadAction, withCredentials, maxCount } = this.props

    let _uploadAction = typeof uploadAction === 'string' ? uploadAction : uploadAction(file)

    if(_uploadAction.toString() === '[object Promise]'){
      await _uploadAction.then(res=>{
        _uploadAction = res
      }).catch((error)=>{
        throw new Error(error)
       })
    }
    this.setState({ fileCountLimted: fileList.length >= maxCount })
    const onerror = err => {
      const { fileList } = this.state
      const errRes = err !== undefined ? err : { status: xhr.status, statusText: xhr.statusText }
      const _fileList = [...fileList]
      file.uploadState = 'error'
      const idx = _fileList.findIndex(item => item.fileId === file.fileId)
      _fileList.splice(idx, 1, file)
      this.setState({ fileList: _fileList })
      this.onUpload(file, _fileList, errRes)
    }

    if (file.fileType === 'img') {
      // 用来图片预览
      if (dataUrl) {
        file.url = dataUrl
      } else if (dataUrl !== false) {
        const fr = new FileReader()

        fr.onload = e => {
          const url = e.target.result
          const _fileList = [...fileList]
          file.url = url
          const idx = _fileList.findIndex(item => item.fileId === file.fileId)
          _fileList.splice(idx, 1, file)
          this.setState({ fileList: _fileList })
        }
        fr.readAsDataURL(file)
      }
    }

    let xhr = new XMLHttpRequest()
    let formFile = new FormData()
    file.xhr = xhr
    xhr.withCredentials = withCredentials
    if (dataUrl) {
      formFile.append(name, dataUrl)
    } else {
      formFile.append(name, file)
    }
    // 设置除file外需要带入的参数
    if (params) {
      for (let i in params) {
        formFile.append(i, params[i])
      }
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const { fileList } = this.state
          const _fileList = [...fileList]
          file.uploadState = 'success'
          const idx = _fileList.findIndex(item => item.fileId === file.fileId)
          _fileList.splice(idx, 1, file)
          this.setState({ fileList: _fileList }, () =>
            this.onUpload(file, _fileList, JSON.parse(xhr.response))
          )
        } else {
          onerror()
        }
      }
    }
    xhr.upload.onerror = () => {
      onerror()
    }
    xhr.upload.onprogress = event => {
      const { fileList } = this.state
      var e = event || window.event
      var percentComplete = Math.ceil(e.loaded / e.total * 100)
      const _fileList = [...fileList]
      const idx = _fileList.findIndex(item => item.fileId === file.fileId)
      _fileList.splice(idx, 1, file)
      file.progressNumber = percentComplete
      this.setState({ fileList: _fileList })
    }

    xhr.open('post', _uploadAction, true)
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

Upload.propTypes = {
  type: PropTypes.string,
  accept: PropTypes.string,
  limit: PropTypes.number,
  buttonText: PropTypes.string,
  buttonIcon: PropTypes.string,
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
  fileList: PropTypes.array,
  onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  maxSize: PropTypes.number,
  withCredentials: PropTypes.bool
}

Upload.defaultProps = {
  defaultFileList: [],
  headers: {},
  accept: '',
  limit: null,
  buttonIcon: 'upload',
  param: null,
  name: 'file',
  disabled: false,
  showUploadList: true,
  multiple: false,
  withCredentials: false,
  beforeUpload: () => true,
  onRemove: () => true,
  onChange: () => true
}
export default Upload
