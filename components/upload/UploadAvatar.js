import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../modal'
import Provider from '../context'
import Upload from './Upload'
import Preview from './Preview'

class UploadAvatar extends Upload {
  containerWidth = 550
  containerHeight = 500
  filename = ''
  img = null
  scale = 1
  draging = false
  dragBeginXy = {
    x: 0,
    y: 0
  }

  constructor (props) {
    super(props)
    const cropperSize = this.getCropperSize(this.props)

    this.state = Object.assign(
      {
        cropperWidth: cropperSize.width,
        cropperHeight: cropperSize.height,
        showPreviewModal: false,
        showCropperModal: false,
        position: {
          top: 0,
          left: 0
        }
      },
      this.state
    )
    this.onDraging = this.onDraging.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.cropperRef = React.createRef()
    this.canvasRef = React.createRef()
    this.uploadRef = React.createRef()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      const cropperSize = this.getCropperSize(nextProps)

      this.setState({
        cropperWidth: cropperSize.width,
        cropperHeight: cropperSize.height
      })
    }
  }

  getCropperSize (props) {
    return {
      width: props.width > 450 ? 200 : props.width,
      height: props.height > 450 ? 200 : props.height
    }
  }

  uploadFiles (files) {
    if (files.length === 0) return

    window.addEventListener('mousemove', this.onDraging)
    window.addEventListener('mouseup', this.onDragEnd)
    this.setState({showCropperModal: true, uploadState: 'loading'}, () => {
      this.filename = files[0].name
      this.showCropperModal(files[0])
    })
  }

  showCropperModal (file) {
    /* eslint-disable */
    this.img = new Image()
    const fr = new FileReader()

    fr.onload = e => {
      const src = e.target.result
      this.img.src = src
    }
    fr.readAsDataURL(file)

    this.img.onload = () => {
      this.drawCanvas(true)
    }
  }

  drawCanvas(init=false) {
    const canvas = document.getElementById('canvas-origin')
    const originContext = canvas.getContext('2d')
    const imgWidth = this.img.width
    const imgHeight = this.img.height
    const imgRadio = imgWidth/imgHeight
    const containerRadio = this.containerWidth/this.containerHeight
    let canvasWidth
    let canvasHeight

    if (imgRadio >= containerRadio) {
      canvasWidth = this.containerWidth
      canvasHeight = canvasWidth/imgRadio
    } else {
      canvasHeight = this.containerHeight
      canvasWidth = canvasHeight*imgRadio
    }
    canvasWidth *= this.scale
    canvasHeight *= this.scale
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    originContext.drawImage(this.img, 0, 0, imgWidth, imgHeight, 0, 0, canvasWidth, canvasHeight)
    init && this.setState({ // 初始时canvas位置居中
      position: {
        top: (this.containerHeight - canvasHeight) / 2,
        left: (this.containerWidth - canvasWidth) / 2
      }
    })
  }

  clearCanvas() {
    const canvas = document.getElementById('canvas-origin')
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  resetParams () {
    window.removeEventListener('mousemove', this.onDraging)
    window.removeEventListener('mouseup', this.onDragEnd)
    this.uploadRef.current.value = ''

    this.scale = 1
    this.img = null
    this.setState({
      showCropperModal: false
    })
    this.clearCanvas()
  }

  base2blob (dataurl, filename) {
    let arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const  bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
      type: mime
    })
  }

  cancel () {
    this.resetParams()
  }

  formatFile(file) {
    file.fileType = 'img'

    return file
  }

  confirm () { // 裁切图片
    const {
      cropperHeight,
      cropperWidth
    } = this.state
    const canvasOrigin = document.getElementById('canvas-origin')
    const originRect = canvasOrigin.getBoundingClientRect()
    const cropperRect = this.cropperRef.current.getBoundingClientRect()
    const canvasPreview = document.getElementById('canvas-preview')
    canvasPreview.width = cropperWidth
    canvasPreview.height = cropperHeight
    const context = canvasPreview.getContext('2d')

    context.fillStyle = "#fff";
    context.fillRect(0, 0, cropperWidth, cropperHeight);
    context.drawImage(canvasOrigin, cropperRect.left-originRect.left, cropperRect.top-originRect.top, cropperWidth, cropperHeight, 0, 0, cropperWidth, cropperHeight)
    const dataUrl = canvasPreview.toDataURL()
    const file = this.base2blob(dataUrl, this.filename)
    file.url =dataUrl

    this.formatFile(file)
    this.setState({
      fileList: [file]
    }, ()=>{
      const {
        beforeUpload,
        customUpload
      } = this.props

      if (!beforeUpload(file, this.state.fileList)) {
        return
      }
      if (customUpload) {
        customUpload(file)
      } else {
        this.uploadFile(file, false)
      }
    })
    this.resetParams()
  }

  zoom(e) { // 缩放canvas
    e.preventDefault()
    const wheelDelta = e.wheelDelta || e.deltaY/120
    let scale = this.scale + wheelDelta

    if (scale > 10 || scale < 0.1) {
      return
    }
    this.scale = scale
    this.drawCanvas()
    this.setState({
      position: this.getPosition(this.state.position.top, this.state.position.left)
    })
  }

  getPosition(top, left) { // 计算canvas的位置
    const {
      cropperWidth,
      cropperHeight
    } = this.state
    const canvasRect = this.canvasRef.current.getBoundingClientRect()
    const deltaHeight = (this.containerHeight-cropperHeight)/2
    const deltaWidth = (this.containerWidth-cropperWidth)/2
    let maxTop
    let minTop
    let maxLeft
    let minLeft
    if (deltaHeight > canvasRect.height) {
      maxTop = deltaHeight + cropperHeight
      minTop = deltaHeight - canvasRect.height
    } else {
      maxTop = this.containerHeight - deltaHeight
      minTop = deltaHeight - canvasRect.height
    }
    if (deltaWidth > canvasRect.width) {
      maxLeft = deltaWidth + cropperWidth
      minLeft = deltaWidth - canvasRect.width
    } else {
      maxLeft = this.containerWidth - deltaWidth
      minLeft = deltaWidth - canvasRect.width
    }
    if (top > maxTop) {
      top = maxTop
    } else if (top < minTop) {
      top = minTop
    }
    if (left > maxLeft) {
      left = maxLeft
    } else if (left < minLeft) {
      left = minLeft
    }

    return {
      top,
      left
    }
  }

  onDragStart (e) {
    // e.persist()
    this.draging = true
    this.dragBeginXy = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  onDraging (e) {
    if (!this.draging) {
      return
    }
    e.stopPropagation()
    e.preventDefault()
    // e.persist()
    const x = e.clientX-this.dragBeginXy.x
    const y = e.clientY-this.dragBeginXy.y
    const position = this.state.position
    let top = position.top + y
    let left = position.left + x

    this.setState({
      position: this.getPosition(top, left)
    })
    this.dragBeginXy = {
      x: e.clientX,
      y: e.clientY
    }
  }
  onDragEnd (e) {
    // e.persist()
    this.draging = false
  }

  closePreviewModal () {
    this.setState({
      showPreviewModal: false
    })
  }

  previewImage () {
    this.setState({
      showPreviewModal: true
    })
  }

  render () {
    const {
      onRemove,
      accept
    } = this.props
    const {
      fileList,
      showPreviewModal,
      showCropperModal,
      cropperHeight,
      cropperWidth,
      position
    } = this.state
    const file = fileList[0]
    const topMaskBottom = (this.containerHeight - cropperHeight) / 2 + cropperHeight
    const leftMaskRight = (this.containerWidth - cropperWidth) / 2 + cropperWidth
    const leftMaskTop = (this.containerHeight - cropperHeight) / 2

    return (
      <div className="hi-upload upload-avatar">
        <ul className='photo-display'>
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
                            onClick={() => this.previewImage()}
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
                    ref={this.uploadRef}
                    type='file'
                    className='upload-input'
                    accept={accept}
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
          show={showCropperModal}
          onConfirm={() => { this.confirm() }}
          onCancel={() => { this.cancel() }}
          backDrop={false}
        >
          <div
            className='upload-canvas'
            style={{width: this.containerWidth, height: this.containerHeight}}
            onWheel={this.zoom.bind(this)}
            onMouseDown={this.onDragStart.bind(this)}
          >
            <canvas
              id='canvas-origin'
              className='upload-canvas__canvas'
              style={{top: position.top, left: position.left}}
              ref={this.canvasRef}
            />
            <div className="upload-canvas__mask--top" style={{bottom: topMaskBottom}}></div>
            <div className="upload-canvas__mask--left" style={{top: leftMaskTop, bottom: leftMaskTop, right: leftMaskRight}}></div>
            <div ref={this.cropperRef} className='upload-canvas__cropper' id='upload-canvas__cropper' style={{height: cropperHeight, width: cropperWidth}}></div>
            <div className="upload-canvas__mask--right" style={{top: leftMaskTop, bottom: leftMaskTop, left: leftMaskRight}}></div>
            <div className="upload-canvas__mask--bottom" style={{top: topMaskBottom}}></div>
          </div>
          <div className="upload-canvas__preview">
            <canvas id="canvas-preview"/>
          </div>
        </Modal>
        <Preview
          src={file&&file.url}
          show={showPreviewModal}
          onClose={this.closePreviewModal.bind(this)}
        />
      </div>
    )
  }
}

UploadAvatar.propTypes = Object.assign({}, {
  ...Upload.propTypes
}, {
  width: PropTypes.number,
  height: PropTypes.number
})
UploadAvatar.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  width: 200,
  height: 200,
  accept: 'image/jpg,image/jpeg,image/png'
})

export default Provider(UploadAvatar)
