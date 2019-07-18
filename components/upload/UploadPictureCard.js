import React from 'react'
import Upload from './Upload'
import Provider from '../context'
import Icon from '../icon'
import classNames from 'classnames'

class UploadPictureCard extends Upload {
  render () {
    const {
      buttonText,
      showUploadList,
      multiple,
      disabled,
      accept,
      onRemove,
      localeDatas
    } = this.props
    const {
      fileList,
      fileCountLimted
    } = this.state

    return (
      <div className='hi-upload hi-upload--picture-card'>
        <div>
          <label>
            <input
              ref={node => { this.uploadRef = node }}
              type='file'
              className='upload-input'
              onChange={e => this.uploadFiles(e.target.files)}
              multiple={multiple && 'multiple'}
              disabled={(disabled || fileCountLimted) && 'disabled'}
              accept={accept}
              hidden
            />
            <span className={`hi-upload__button ${(disabled || fileCountLimted) ? 'hi-upload__button--disabled' : ''}`}>
              {buttonText || localeDatas.upload.buttonText}
            </span>
          </label>
        </div>
        {showUploadList && (
          <ul className='hi-upload__list'>
            {fileList.map((file, index) => {
              const fileNameCls = classNames(
                'hi-upload__filename',
                file.uploadState === 'error' && 'hi-upload__filename--error'
              )
              const itemCls = classNames(
                'hi-upload__item',
                file.uploadState === 'error' && 'hi-upload__item--error'
              )
              return (
                <li key={index} title={file.name} className={itemCls}>
                  <div className='img-wrap'>
                    <img src={file.url} />
                    {file.uploadState === 'loading' && (<div className='img-mask' />)}
                  </div>
                  <div className='hi-upload__right-content'>
                    <span className={fileNameCls} title={file.name}>{file.name}</span>
                    <span>
                      { onRemove &&
                        <Icon
                          name={file.uploadState === 'loading' ? 'close' : 'delete'}
                          onClick={() => this.deleteFile(file, index)}
                        />
                      }
                    </span>
                    {
                      file.uploadState === 'loading' && (
                        <div className='hi-upload__upstatus'>
                          <i className='hi-upload__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                        </div>
                      )
                    }
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
UploadPictureCard.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  accept: 'image/jpg,image/jpeg,image/png'
})

export default Provider(UploadPictureCard)
