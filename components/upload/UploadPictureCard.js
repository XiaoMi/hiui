import React from 'react'
import Upload from './Upload'
import Icon from '../icon'
import classNames from 'classnames'
import Button from '../button'

class UploadPictureCard extends Upload {
  handleButtonClick = () => {
    this.uploadRef.value = ''
    this.uploadRef.click()
  }
  render () {
    const {
      content,
      showUploadList,
      multiple,
      disabled,
      accept,
      onRemove,
      localeDatas,
      theme,
      onDownload
    } = this.props
    const {
      fileList,
      fileCountLimted
    } = this.state

    return (
      <div className={`hi-upload hi-upload--picture-card theme__${theme}`}>
        {
          this.outMaxsizeTip()
        }
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
            <Button type='primary' disabled={disabled || fileCountLimted} onClick={this.handleButtonClick}>
              { content || localeDatas.upload.buttonText}
            </Button>
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
                  </div>
                  <div className='hi-upload__right-content'>
                    <a target='_blank' href={file.url || null} className={fileNameCls} title={file.name} onClick={e => {
                      if (onDownload) {
                        e.preventDefault()
                        onDownload(file)
                      }
                    }}>
                      {file.name}
                    </a>
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

export default UploadPictureCard
