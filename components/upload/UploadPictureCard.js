import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AJAX from './tool'

class UploadPictureCard extends Component {
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
    deleteParam: PropTypes.object
  };

  static defaultProps = {
    allClickFiles: [],
    uploadType: 'pictureCard',
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
    multiple: false
    // overEvent: false
  };
  constructor (props) {
    super(props)
    this.state = Object.assign({}, this.props)
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
      this.setState({ allClickFiles: this.props.allClickFiles.unshift(file) })
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
    fr.onload = e => {
      const src = e.target.result
      file.src = src
      this.setState({ allClickFiles: this.props.allClickFiles })
    }
    fr.readAsDataURL(file)

    let xhr = new XMLHttpRequest()
    let formFile = new FormData()
    formFile.append(this.props.name, file)
    // 设置出来file外需要带入的参数
    for (let i in this.state.param) {
      if (i) {
        formFile.append(i, this.state.param[i])
      }
    }
    xhr.upload.onload = () => {
      file.uploadState = 'right'
      this.setState({ allClickFiles: this.props.allClickFiles })
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
      this.setState({ allClickFiles: this.props.allClickFiles })
    }
    xhr.upload.onprogress = event => {
      var e = event || window.event
      var percentComplete = Math.ceil(e.loaded / e.total * 100)
      file.progressNumber = percentComplete
      this.setState({ allClickFiles: this.props.allClickFiles })
    }
    this.setState({ allClickFiles: this.props.allClickFiles })

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
    if (_self.props.deleteParam) {
      const deleteParam = _self.props.deleteParam
      deleteParam.success = (res) => {
        _self.props.allClickFiles.splice(n, 1)
        _self.setState({
          allClickFiles: _self.props.allClickFiles
        })
        deleteParam.onDeleteSuccess({
          res: res,
          deletePos: n
        })
      }
      if (deleteParam) {
        AJAX(deleteParam)
      }
    } else {
      _self.props.allClickFiles.splice(n, 1)
      _self.setState({
        allClickFiles: _self.props.allClickFiles
      })
      _self.props.onDeleteSuccess && _self.props.onDeleteSuccess({
        deletePos: n
      })
    }
  }

  render () {
    const { uploadType } = this.props
    return (
      <div className={'upload-' + uploadType}>
        <div>
          <label>
            <input
              ref='upload'
              type='file'
              className='upload-input'
              onChange={e => this.getChangeFiles(e)}
              multiple={this.state.multiple && 'multiple'}
              disabled={this.state.disabled && 'disabled'}
              hidden
            />
            <span
              className={`upload-title ${
                this.state.disabled ? 'disabled' : ''
              }`}
            >
              <i className={`icon Ficon-${this.state.buttonIcon}`} />&nbsp;{
                this.state.buttonText
              }
            </span>
          </label>
        </div>
        {this.state.showUploadList && (
          <ul ref='prvbox' className='upload-list'>
            {this.props.allClickFiles.map((file, index) => {
              let listName = file.name.split('.')
              listName =
                listName[0].length > 20
                  ? file.name.substring(0, 19) + '....' + listName[1]
                  : listName.join('.')
              return (
                <li key={index} title={file.name} className={file.uploadState === 'loading' ? 'loading' : ''}>
                  <div className='img-wrap'>
                    <img src={file.src} />
                    {file.uploadState === 'loading' && (<div className='img-mask' />)}
                  </div>
                  <div className='img-info-wrap'>
                    <p className='file-wrap'>
                      <span className='file-name'>{listName}</span>
                      {file.uploadState !== 'loading' && (
                        <span className='state-wrap'>
                          <span className={'Ficon-' + file.uploadState} />
                          <span
                            className='Ficon-wrong'
                            onClick={this.deletFile.bind(this, index)}
                          />
                        </span>
                      )}
                    </p>
                    {file.uploadState === 'loading' && (
                      <div className='loading-line-wrap'>
                        <i
                          className='loading-line'
                          style={{ width: file.progressNumber * 3.03 + 'px' }}
                        />
                        <i className='loading-num'>{file.progressNumber || 0}%</i>
                      </div>
                    )}
                  </div>

                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }
}

export default UploadPictureCard
