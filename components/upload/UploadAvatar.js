import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../modal'
import Upload from './Upload'
import Preview from '../preview'
import Cropper from 'react-cropper'
import Icon from '../icon'
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

    this.state = Object.assign(
      {
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

  uploadFiles (files) {
    if (files.length === 0) return
    this.setState({ uploadState: 'loading' }, () => {
      this.filename = files[0].name
      this.showCropperModal(files[0])
    })
  }

  showCropperModal (file) {
    const fr = new window.FileReader()

    fr.onload = e => {
      const src = e.target.result
      this.setState({ src }, () => {
        this.setState({ showCropperModal: true })
      })
    }
    fr.readAsDataURL(file)
  }

  base2blob (dataurl, filename) {
    let arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = window.atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new window.File([u8arr], filename, {
      type: mime
    })
  }

  cancel () {
    this.setState({ showCropperModal: false })
  }

  formatFile (file) {
    file.fileType = 'img'

    return file
  }

  confirm () {
    // 裁切图片

    const cs = this.cropperRef.current.getCroppedCanvas()
    if (typeof cs === 'undefined') {
      return
    }
    const dataUrl = cs.toDataURL()
    const file = this.base2blob(dataUrl, this.filename)
    file.url = dataUrl

    this.formatFile(file)
    this.setState(
      {
        fileList: [file],
        showCropperModal: false
      },
      () => {
        const { beforeUpload, customUpload } = this.props

        if (!beforeUpload(file, this.state.fileList)) {
          return
        }
        if (customUpload) {
          customUpload(file)
        } else {
          this.uploadFile(file, false)
        }
      }
    )
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
    const { disabled, accept, localeDatas, avatarOptions = {}, onRemove, theme } = this.props
    const { fileList, showCropperModal, showPreviewModal } = this.state
    const { aspectRatio = 0, dragMode = 'move', dropBoxSize = [] } = avatarOptions
    const file = fileList[0]
    return (
      <div className={`theme__${theme} hi-upload hi-upload--avatar`}>
        <ul className='hi-upload__list'>
          {!!file &&
            (file.uploadState === 'loading'
              ? <li className='hi-upload__item'>
                <img src={file.url} className='hi-upload__thumb' />
                <div className='hi-upload__precent'>
                  <p className='hi-upload__loading-text'>
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber + '%'
                        : localeDatas.upload.uploadSuccess
                      : 0 + '%'}
                  </p>
                  <div
                    className='hi-upload__loading-bar'
                    style={{ width: file.progressNumber * 1.4 + 'px' }}
                  />
                </div>
              </li>
              : <li className='hi-upload__item'>
                <img
                  src={file.url}
                  className={`hi-upload__thumb ${file.uploadState === 'error' && 'error'}`}
                />
                <div className='hi-upload__item-mask' onClick={() => this.previewImage(file)}>
                  <Icon name='eye' />
                  <span>
                    {localeDatas.upload.preview}
                  </span>
                </div>
                {onRemove &&
                <Icon
                  name='close-circle'
                  className='hi-upload__photo-del'
                  onClick={() => this.deleteFile(file, 0)}
                />}
              </li>)}
          {!file &&
            <li className='hi-upload__item hi-upload__item--upload'>
              <label style={{ display: 'block' }}>
                <input
                  ref={node => {
                    this.uploadRef = node
                  }}
                  type='file'
                  accept={accept}
                  disabled={disabled && 'disabled'}
                  onChange={e => this.uploadFiles(e.target.files)}
                  hidden
                />
                <Icon name='plus' />
              </label>
            </li>}
        </ul>
        <Modal
          show={showCropperModal}
          onConfirm={() => {
            this.confirm()
          }}
          onCancel={() => {
            this.cancel()
          }}
          backDrop={false}
        >
          <Cropper
            src={this.state.src}
            ready={e => {
              if (dropBoxSize.length > 0) {
                this.cropperRef.current.setCropBoxData({
                  width: dropBoxSize[0],
                  height: dropBoxSize[1] || dropBoxSize[0]
                })
              }
            }}
            aspectRatio={aspectRatio}
            guides={false}
            dragMode={dragMode}
            ref={this.cropperRef}
            crop={() => {}}
            style={{ height: 400, width: '100%' }}
          />
        </Modal>
        {showPreviewModal &&
          file &&
          <Preview
            src={file.url}
            images={[file]}
            activeIndex={0}
            visible={showPreviewModal}
            onClose={this.closePreviewModal.bind(this)}
          />}
      </div>
    )
  }
}

UploadAvatar.propTypes = Object.assign(
  {},
  {
    ...Upload.propTypes
  },
  {
    width: PropTypes.number,
    height: PropTypes.number
  }
)
UploadAvatar.defaultProps = Object.assign(
  {},
  {
    ...Upload.defaultProps
  },
  {
    width: 200,
    height: 200,
    accept: 'image/jpg,image/jpeg,image/png'
  }
)

export default UploadAvatar
