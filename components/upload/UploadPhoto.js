import React from 'react'
import classNames from 'classnames'
import Upload from './Upload'
import Preview from './Preview'
import Icon from '../icon'

class UploadPhoto extends Upload {
  constructor (props) {
    super(props)
    this.state = Object.assign(
      {
        uploading: false,
        progressNumber: 0,
        showModal: false,
        previewFile: {},
        activeIndex: 0,
        images: []
      },
      this.state
    )
  }

  closeModal () {
    this.setState({
      previewFile: {},
      showModal: false
    })
  }

  previewImage (file, activeIndex) {
    this.setState({
      previewFile: file,
      showModal: true,
      activeIndex
    })
  }

  render () {
    const {
      fileList,
      showModal,
      previewFile,
      activeIndex,
      fileCountLimted
    } = this.state
    const {
      onRemove,
      disabled,
      accept,
      localeDatas
    } = this.props
    const images = fileList.map(file => {
      return {
        url: file.url
      }
    })
    return (
      <div className={classNames('hi-upload hi-upload--photo', {'hi-upload--disabled': disabled})}
        onClick={(e) => {
          if (e.target.nodeName === 'INPUT' && e.target.type === 'file') {
            this.uploadRef.value = ''
          }
        }}
      >
        {
          this.outMaxsizeTip()
        }
        <ul className='hi-upload__list'>
          {fileList.map((file, index) => {
            if (file.uploadState === 'loading') {
              return (
                <li key={index} className='hi-upload__item'>
                  <img src={file.url} className='hi-upload__thumb' />
                  <div className='hi-upload__precent'>
                    <p className='hi-upload__loading-text'>{file.progressNumber ? (file.progressNumber < 100 ? (file.progressNumber + '%') : localeDatas.upload.uploadSuccess) : (0 + '%')}</p>
                    <div className='hi-upload__loading-bar' style={{ width: (file.progressNumber * 1.4) + 'px' }} />
                    {/* 进度条底部阴影 */}
                    <div className='hi-upload__loading-shadow' />
                  </div>
                </li>
              )
            } else {
              return (
                <li key={index} className='hi-upload__item' style={{cursor: 'pointer'}} onClick={() => this.previewImage(file, index)}>
                  <img src={file.url} className={`hi-upload__thumb ${file.uploadState === 'error' && 'error'}`} />
                  {
                    onRemove && <Icon name='close-circle' className='hi-upload__photo-del' onClick={(e) => {
                      e.stopPropagation()
                      this.deleteFile(file, index)
                    }} />
                  }
                  {
                    file.uploadState === 'error' && <div className='hi-upload__item--photo-error'>
                      {localeDatas.upload.uploadFailed}
                    </div>
                  }
                </li>
              )
            }
          })}
          {
            !fileCountLimted && <li className='hi-upload__item hi-upload__item--upload'>
              <label style={{display: 'block'}}>
                <input
                  ref={node => {
                    this.uploadRef = node
                  }}
                  type='file'
                  accept={accept}
                  disabled={(disabled || fileCountLimted) && 'disabled'}
                  onChange={e => this.uploadFiles(e.target.files)}
                  hidden
                />
                <Icon name='plus' />
              </label>
            </li>
          }
        </ul>
        {
          showModal && <Preview
            src={previewFile.url}
            images={images}
            activeIndex={activeIndex}
            show={showModal}
            onClose={this.closeModal.bind(this)}
          />
        }
      </div>
    )
  }
}
UploadPhoto.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  accept: 'image/jpg,image/jpeg,image/png'
})

export default UploadPhoto
