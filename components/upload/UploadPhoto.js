import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AJAX from './tool'

class UploadPhoto extends Component {
  static propTypes = {
    uploadType: PropTypes.string,
    accept: PropTypes.string,
    limit: PropTypes.number,
    buttonText: PropTypes.string,
    buttonIcon: PropTypes.string,
    uploadAction: PropTypes.string,
    deleteAction: PropTypes.string,
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
    allPhotoFiles: [],
    uploadType: 'photo',
    accept: '',
    limit: null,
    buttonText: '上传',
    buttonIcon: 'upload',
    uploadAction: '',
    deleteAction: '',
    param: null,
    name: 'file',
    disabled: false,
    headers: null,
    showUploadList: true,
    multiple: false,
    defaultFileList: []
  }
  constructor (props) {
    super(props)
    this.state = Object.assign({
      uploading: false,
      progressNumber: 0
    }, this.props)
  }
  getChangeFiles (e) {
    let _files = e.target.files
    this.handleChange(_files)
  }

  handleChange (_files) {
    if (_files.length === 0) return
    for (let key in _files) {
      if (!_files.hasOwnProperty(key)) continue
      let file = _files[key]
      file.uploadState = 'loading'
      this.setState({ allPhotoFiles: this.props.allPhotoFiles.push(file) })
      this.handleFile(file)
    }
    ReactDOM.findDOMNode(this.refs.upload).value = ''
  }

  handleFile (file) {
    const _self = this
    const FileReader = window.FileReader
    const XMLHttpRequest = window.XMLHttpRequest
    const FormData = window.FormData
    const fr = new FileReader()
    const Number = window.Number
    const Math = window.Math
    const Date = window.Date
    fr.onload = e => {
      const src = e.target.result
      file.src = src
      file.id = Number(Math.random().toString().substr(3, 9) + Date.now()).toString(36)
      this.setState({ allPhotoFiles: this.props.allPhotoFiles })
    }
    fr.readAsDataURL(file)

    let xhr = new XMLHttpRequest()
    let formFile = new FormData()
    formFile.append(this.props.name, file)
    for (let i in this.state.param) {
      if (i) {
        formFile.append(i, this.state.param[i])
      }
    }
    xhr.upload.onload = () => {
      file.uploadState = 'right'
      // this.setState({defaultFileList: this.state.defaultFileList.push(file)})
      let defaultFileList = [..._self.state.defaultFileList]
      let temp = {
        url: file.src,
        name: file.name
      }
      defaultFileList.push(temp)
      let allPhotoFiles = _self.props.allPhotoFiles.concat()
      // console.log(file.id);
      allPhotoFiles = allPhotoFiles.filter((v, n) => {
        return v.id !== file.id
      })
      this.setState({ defaultFileList: defaultFileList, allPhotoFiles: allPhotoFiles })
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          _self.props.onUploadSuccess && _self.props.onUploadSuccess(JSON.parse(xhr.response))
          // console.log(JSON.parse(xhr.response),'response')
        }
      }
    }
    xhr.upload.onerror = () => {
      file.uploadState = 'warning'
      this.setState({ allPhotoFiles: this.props.allPhotoFiles })
    }
    xhr.upload.onprogress = event => {
      var e = event || window.event
      var percentComplete = Math.ceil(e.loaded / e.total * 100)
      file.progressNumber = percentComplete
      console.log(percentComplete)
      this.setState({ allPhotoFiles: this.props.allPhotoFiles })
    }
    this.setState({ allPhotoFiles: this.props.allPhotoFiles })
    xhr.open('post', this.state.uploadAction, true)
    // 设置用户传入的请求头
    if (this.state.headers) {
      for (let j in this.state.headers) {
        if (j) {
          xhr.setRequestHeader(j, this.state.headers[j])
        }
      }
    }
    xhr.send(formFile)
  }

  deletFile (n) {
    let _self = this
    let defaultFileList = [...this.state.defaultFileList]
    let _n = n + defaultFileList.length
    if (_self.props.deleteParam) {
      const deleteParam = _self.props.deleteParam
      deleteParam.success = (res) => {
        _self.props.allPhotoFiles.splice(n, 1)
        _self.setState({
          allPhotoFiles: _self.props.allPhotoFiles
        })
        deleteParam.onDeleteSuccess({
          res: res,
          deletePos: _n
        })
      }
      if (deleteParam) {
        AJAX(deleteParam)
      }
    } else {
      _self.props.allPhotoFiles.splice(n, 1)
      _self.setState({
        allPhotoFiles: _self.props.allPhotoFiles
      })
      _self.props.onDeleteSuccess && _self.props.onDeleteSuccess({
        deletePos: _n
      })
    }
  }

  deletDefaultFile (n) {
    let defaultFileList = [...this.state.defaultFileList]
    defaultFileList.splice(n, 1)
    this.setState({defaultFileList: defaultFileList})
    this.props.onDeleteSuccess && this.props.onDeleteSuccess({
      deletePos: n
    })
  }
  render () {
    const { uploadType } = this.props
    return (
      <div className={'upload-' + uploadType}>
        <ul className='photo-display' ref='photodisplay'>
          {
            this.state.defaultFileList && this.state.defaultFileList.map((file, ind) => (
              <li key={ind}>
                <div className='img-uploaded'>
                  <img src={file.url} />
                  <div className='upload-comperate'>
                    <span
                      className='icon Ficon-origin'
                      onClick={() => console.log('show origin photo')}
                    />
                    <span
                      className='icon Ficon-delete-photo'
                      onClick={this.deletDefaultFile.bind(this, ind)}
                    />
                  </div>
                </div>
              </li>
            ))
          }
          <li>
            <label>
              <input
                ref='upload'
                type='file'
                className='upload-input'
                accept='image/jpg,image/jpeg,image/png'
                onChange={e => this.getChangeFiles(e)}
                hidden
              />
              <span className='photo-upload'>+</span>
            </label>
          </li>
        </ul>
      </div>
    )
  }
}

export default UploadPhoto
