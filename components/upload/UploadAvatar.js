import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AJAX from './tool'
import Modal from '../modal'
import Provider from '../context'

class UploadAvatar extends Component {
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

  dom = {
    CanvasModal: null,
    CanvasMock: null,
    CanvasReal: null
  }
  params = {
    LOCK: false,
    type: '',
    gap: 4
  }
  canvasPosition = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
  canvasModalPosition = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  static defaultProps = {
    uploadState: '',
    progressNumber: 0,
    file: '',
    uploadType: 'avater',
    accept: '',
    limit: null,
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
      progressNumber: 0,
      show: false,
      file: props.defaultFileList && props.defaultFileList[0]
    }, this.props)

    console.log(this.state.file)

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  initPosition () {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    this.dom.CanvasModal = document.getElementById('J_Canvas-modal')
    const json = JSON.stringify(this.dom.CanvasModal.getBoundingClientRect())
    this.canvasModalPosition = JSON.parse(json)
    this.canvasPosition = JSON.parse(json)
  }

  getChangeFiles (e) {
    let _files = e.target.files

    this.setState({show: true}, () => {
      this.handleChange(_files)
    })
  }

  handleChange (_files) {
    if (_files.length === 0) return
    this.setState({uploadState: 'loading'})
    this.handleFile(_files[0])
    // ReactDOM.findDOMNode(this.refs.upload).value = ''
  }

  handleFile (file) {
    const _self = this
    const canvas = document.getElementById('upload-canvas')
    const context = canvas.getContext('2d')
    /* eslint-disable */
    let img = new Image() 
    const fr = new FileReader()

    this.dom.CanvasReal = canvas
    this.dom.CanvasMock = document.createElement('canvas')
    this.dom.CanvasMock.classList.add('canvas-mock')
    document.body.appendChild(this.dom.CanvasMock)

    fr.onload = e => {
      const src = e.target.result
      img.src = src
    }
    fr.readAsDataURL(file)

    img.onload = function () {
      const imgWidth = img.width
      const imgHeight = img.height
      const width = 488
      const height = parseInt(500 * imgHeight / imgWidth)

      canvas.width = width
      canvas.height = height
      context.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, 488, height)
      _self.initPosition()
    }
  }

  upload (dataUrl) {
    const _self = this
    const XMLHttpRequest = window.XMLHttpRequest
    let xhr = new XMLHttpRequest()
    const FormData = window.FormData
    let formFile = new FormData()

    formFile.append(_self.props.name, dataUrl)
    for (let i in this.state.param) {
      if (i) {
        formFile.append(i, this.state.param[i])
      }
    }
    xhr.upload.onload = () => {
      this.setState({ uploadState: 'right' })
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          _self.props.onUploadSuccess && _self.props.onUploadSuccess(JSON.parse(xhr.response))
        }
      }
    }
    xhr.upload.onerror = () => {
      this.setState({ uploadState: 'uploadState' })
    }
    xhr.upload.onprogress = event => {
      var e = event || window.event
      var percentComplete = Math.ceil(e.loaded / e.total * 100)

      this.setState({ progressNumber: percentComplete })
    }
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
        _self.setState({file: ''}, () => {
          deleteParam.onDeleteSuccess({
            res: res
          })
        })
      }
      if (deleteParam) {
        AJAX(deleteParam)
      }
    } else {
      _self.setState({file: ''}, () => {
        _self.props.onDeleteSuccess && _self.props.onDeleteSuccess()
      })
    }
  }

  resetParams () {
    this.dom = {
      CanvasModal: null,
      CanvasMock: null,
      CanvasReal: null
    }
    this.params = {
      LOCK: false,
      type: '',
      gap: 4
    }
    this.canvasPosition = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
    this.canvasModalPosition = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
    ReactDOM.findDOMNode(this.refs.upload).value = ''
    this.setState({
      uploadState: '',
      progressNumber: 0,
      show: false
    })
  }

  // base2blob (dataurl) {
  //   let arr = dataurl.split(',')
  //   const mime = arr[0].match(/:(.*?);/)[1]
  //   const  bstr = atob(arr[1])
  //   let n = bstr.length
  //   let u8arr = new Uint8Array(n)
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n)
  //   }
  //   return new Blob([u8arr], {
  //     type: mime
  //   })
  // }

  cancel () {
    this.resetParams()
  }

  confirm () {
    const style = window.getComputedStyle(this.dom.CanvasModal, null)
    const size = {
      x: parseInt(style.left),
      y: parseInt(style.top),
      w: this.canvasModalPosition.right - this.canvasModalPosition.left,
      h: this.canvasModalPosition.bottom - this.canvasModalPosition.top
    }
    this.dom.CanvasMock.width = size.w
    this.dom.CanvasMock.height = size.h
    const context = this.dom.CanvasMock.getContext('2d')

    context.drawImage(this.dom.CanvasReal, size.x, size.y, size.w, size.h, 0, 0, size.w, size.h)
    const dataUrl = this.dom.CanvasMock.toDataURL()

    this.setState({file: dataUrl})
    this.upload(dataUrl)
    this.resetParams()
  }

  onMouseUp () {
    this.params.LOCK = false
  }

  onMouseDown (e) {
    this.params.LOCK = true

    if ([].slice.call(e.target.classList).indexOf('upload-canvas__handle') > -1) {
      this.params.type = e.target.id.split('_')[1]
    }
  }

  mouseT (e) {
    const self = this

    if (e.clientY < self.canvasPosition.top) {
      self.canvasModalPosition.top = self.canvasPosition.top
    } else if (e.clientY >= self.canvasPosition.top && e.clientY <= self.canvasModalPosition.bottom - self.params.gap) {
      self.canvasModalPosition.top = e.clientY
    } else {
      self.canvasModalPosition.top = self.canvasModalPosition.bottom - self.params.gap
    }
    self.dom.CanvasModal.style.top = self.canvasModalPosition.top - self.canvasPosition.top + 'px'
  }

  mouseR (e) {
    const self = this

    if (e.clientX > self.canvasPosition.right) {
      self.canvasModalPosition.right = self.canvasPosition.right
    } else if (e.clientX <= self.canvasPosition.right && e.clientX >= self.canvasModalPosition.left + self.params.gap) {
      self.canvasModalPosition.right = e.clientX
    } else {
      self.canvasModalPosition.right = self.canvasModalPosition.left + self.params.gap
    }
    self.dom.CanvasModal.style.right = self.canvasPosition.right - self.canvasModalPosition.right + 'px'
  }

  mouseB (e) {
    const self = this

    if (e.clientY > self.canvasPosition.bottom) {
      self.canvasModalPosition.bottom = self.canvasPosition.bottom
    } else if (e.clientY <= self.canvasPosition.bottom && e.clientY >= self.canvasModalPosition.top + self.params.gap) {
      self.canvasModalPosition.bottom = e.clientY
    } else {
      self.canvasModalPosition.bottom = self.canvasModalPosition.top + self.params.gap
    }
    self.dom.CanvasModal.style.bottom = self.canvasPosition.bottom - self.canvasModalPosition.bottom + 'px'
  }

  mouseL (e) {
    const self = this

    if (e.clientX < self.canvasPosition.left) {
      self.canvasModalPosition.left = self.canvasPosition.left
    } else if (e.clientX >= self.canvasPosition.left && e.clientX <= self.canvasModalPosition.right - self.params.gap) {
      self.canvasModalPosition.left = e.clientX
    } else {
      self.canvasModalPosition.left = self.canvasModalPosition.right - self.params.gap
    }
    self.dom.CanvasModal.style.left = self.canvasModalPosition.left - self.canvasPosition.left + 'px'
  }

  onMouseMove (e) {
    if (!this.params.LOCK) { return }
    let self = this
    const type = this.params.type.toLowerCase()

    switch (type) {
      case 't':
        self.mouseT(e)
        break
      case 'r':
        self.mouseR(e)
        break
      case 'b':
        self.mouseB(e)
        break
      case 'l':
        self.mouseL(e)
        break
      case 'tl':
        self.mouseT(e)
        self.mouseL(e)
        break
      case 'tr':
        self.mouseT(e)
        self.mouseR(e)
        break
      case 'bl':
        self.mouseB(e)
        self.mouseL(e)
        break
      case 'br':
        self.mouseB(e)
        self.mouseR(e)
        break
      default:
    }
  }

  render () {
    const { uploadType } = this.props
    const {
      uploadState,
      progressNumber,
      file
    } = this.state

    return (
      <div className={'upload-' + uploadType}>
        <ul className='photo-display' ref='photodisplay'>
          {/* {this.props.allPhotoFiles.map((file, index) => {
            if (file.uploadState === 'loading') {
              return (<li key={index}>
                <div className='img-uploading'>
                  <img src={file.src} />
                  <div className='upload-precent'>
                    <p className='precent-num'>{file.progressNumber ? (file.progressNumber < 100 ? (file.progressNumber + '%') : '上传成功') : (0 + '%')}</p>
                    <div className='precent-loading' style={{ width: (file.progressNumber * 1.4) + 'px' }} />
                  </div>
                </div>
              </li>)
            } else {
              return (<li key={index}>
                <div className='img-uploaded'>
                  <img src={file.src} />
                  <div className='upload-comperate'>
                    <span
                      className='icon Ficon-origin'
                      onClick={() => console.log('show origin photo')}
                    />
                    <span
                      className='icon Ficon-delete-photo'
                      onClick={this.deletFile.bind(this, index)}
                    />
                  </div>
                </div>
              </li>)
            }
          })} */}
          {
            file
              ? (
                uploadState === 'loading'
                  ? (
                    <li>
                      <div className='img-uploading'>
                        <img src={file} />
                        <div className='upload-precent'>
                          <p className='precent-num'>{progressNumber ? (progressNumber < 100 ? (progressNumber + '%') : '上传成功') : (0 + '%')}</p>
                          <div className='precent-loading' style={{ width: (file.progressNumber * 1.4) + 'px' }} />
                        </div>
                      </div>
                    </li>
                  )
                  : (
                    <li>
                      <div className='img-uploaded'>
                        <img src={file} />
                        <div className='upload-comperate'>
                          <span
                            className='icon Ficon-origin'
                            onClick={() => console.log('show origin photo')}
                          />
                          <span
                            className='icon Ficon-delete-photo'
                            onClick={this.deletFile.bind(this)}
                          />
                        </div>
                      </div>
                    </li>
                  )
              ) : ''
          }
          {
            !file && (
              <li className='upload-li'>
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
            )
          }
        </ul>
        <Modal
          show={this.state.show}
          onConfirm={() => { this.confirm() }}
          onCancel={() => { this.cancel() }}
          backDrop={false}
        >
          <div className='upload-canvas'>
            <canvas id='upload-canvas' className='upload-canvas__canvas' />
            <div id='J_Canvas-modal' className='upload-canvas__modal'>
              <div id='J_T' className='upload-canvas__handle upload-canvas__t'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_R' className='upload-canvas__handle upload-canvas__r'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_B' className='upload-canvas__handle upload-canvas__b'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_L' className='upload-canvas__handle upload-canvas__l'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_TL' className='upload-canvas__handle upload-canvas__tl'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_TR' className='upload-canvas__handle upload-canvas__tr'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_BL' className='upload-canvas__handle upload-canvas__bl'
                onMouseDown={this.onMouseDown.bind(this)}
              />
              <div id='J_BR' className='upload-canvas__handle upload-canvas__br'
                onMouseDown={this.onMouseDown.bind(this)}
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Provider(UploadAvatar)
