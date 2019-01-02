import React from 'react'
import ReactDOM from 'react-dom'
import Modal from '../modal'
import Provider from '../context'
import Upload from './Upload'
import Preview from './Preview'

class UploadAvatar extends Upload {
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

  constructor (props) {
    super(props)
    this.state = Object.assign(
      {
        showPreviewModal: false,
        previewFile: {},
        show: false
      },
      this.state
    )

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

  uploadFiles (files) {
    this.setState({show: true}, () => {
      if (files.length === 0) return
      this.setState({uploadState: 'loading'})
      this.handleFile(files[0])
    })
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
      show: false
    })
  }

  base2blob (dataurl) {
    let arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const  bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], {
      type: mime
    })
  }

  cancel () {
    this.resetParams()
  }

  prepareFile() {
    const file = {
      fileType: 'img'
    }

    return file
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
    // const file = this.base2blob(dataUrl)
    // console.log('---------base2blob', file)

    // this.setState({file: dataUrl})
    const file = this.prepareFile()
    // console.log('---------file', file)
    this.setState({
      fileList: [file]
    }, ()=>{
      this.uploadFile(file, dataUrl)
    })
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

  closeModal () {
    this.setState({
      previewFile: {},
      showPreviewModal: false
    })
  }

  previewImage (file) {
    this.setState({
      previewFile: file,
      showPreviewModal: true
    })
  }

  render () {
    const { 
      onRemove
    } = this.props
    const {
      fileList,
      previewFile,
      showPreviewModal
    } = this.state
    const file = fileList[0]

    return (
      <div className="hi-upload upload-avatar">
        <ul className='photo-display' ref='photodisplay'>
          {
            file
              ? (
                file.uploadState === 'loading'
                  ? (
                    <li>
                      <div className='img-uploading'>
                        <img src={file.url} />
                        <div className='upload-precent'>
                          <p className='precent-num'>{file.progressNumber ? (file.progressNumber < 100 ? (file.progressNumber + '%') : '上传成功') : (0 + '%')}</p>
                          <div className='precent-loading' style={{ width: (file.progressNumber * 1.4) + 'px' }} />
                        </div>
                      </div>
                    </li>
                  )
                  : (
                    <li>
                      <div className='img-uploaded'>
                        <img src={file.url} />
                        <div className='upload-comperate'>
                          <span
                            className='icon Ficon-origin'
                            onClick={() => this.previewImage(file)}
                          />
                          { onRemove &&
                            <span
                              className='icon Ficon-delete-photo'
                              onClick={() => this.deleteFile(file, 0)}
                            />
                          }
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
                    onChange={e => this.uploadFiles(e.target.files)}
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
        <Preview
          src={previewFile.url}
          show={showPreviewModal}
          onClose={this.closeModal.bind(this)}
        />
      </div>
    )
  }
}

export default Provider(UploadAvatar)
