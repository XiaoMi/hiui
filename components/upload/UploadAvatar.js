import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../modal'
import Provider from '../context'
import Upload from './Upload'
import Preview from './Preview'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
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
        },
        src: ''
      },
      this.state
    )
    this.cropperRef = React.createRef()
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
    //   const cropperSize = this.getCropperSize(nextProps)

    //   this.setState({
    //     cropperWidth: cropperSize.width,
    //     cropperHeight: cropperSize.height
    //   })
    // }
  }

  getCropperSize (props) {
    return {
      width: props.width > 450 ? 200 : props.width,
      height: props.height > 450 ? 200 : props.height
    }
  }

  uploadFiles (files) {
    if (files.length === 0) return
    this.setState({uploadState: 'loading'}, () => {
      this.filename = files[0].name
      this.showCropperModal(files[0])
    })
  }

  showCropperModal (file) {
    /* eslint-disable */
    const fr = new FileReader()

    fr.onload = e => {
      const src = e.target.result
      this.setState({src}, () => {
        this.setState({showCropperModal: true})
      })
    }
    fr.readAsDataURL(file)
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
    const cs = this.cropperRef.current.getCroppedCanvas()
    if (typeof cs === 'undefined') {
      return;
    }
    const dataUrl = cs.toDataURL()
    const file = this.base2blob(dataUrl, this.filename)
    file.url =dataUrl

    this.formatFile(file)
    this.setState({
      fileList: [file],
      showCropperModal: false
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
      cropperWidth
    } = this.state
    const file = fileList[0]
    return (
      <div className="hi-upload hi-upload--avatar">
        <ul className='hi-upload__list'>
          {
            !!file && (
                file.uploadState === 'loading'
                  ? (
                    <li key={index} className='hi-upload__item'>
                      <img src={file.url} className='hi-upload__thumb' />
                      <div className='hi-upload__precent'>
                        <p className='hi-upload__loading-text'>{file.progressNumber ? (file.progressNumber < 100 ? (file.progressNumber + '%') : '上传成功') : (0 + '%')}</p>
                        <div className='hi-upload__loading-bar' style={{ width: (file.progressNumber * 1.4) + 'px', }} />
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
              )
          }
          {
            !file && (
              <li className='upload-li'>
                <label>
                  <input
                    ref={ node => {
                      this.uploadRef = node
                    }}
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
          <Cropper src={this.state.src} aspectRatio={16 / 9}
              guides={false}
              ref={this.cropperRef}
              crop={() => {
              }}
              style={{height: 400, width: '100%'}}
              />
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
