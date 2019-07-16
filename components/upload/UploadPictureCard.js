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
      onRemove
    } = this.props
    const {
      fileList
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
              disabled={disabled && 'disabled'}
              accept={accept}
              hidden
            />
            <span className={`hi-upload__button ${disabled ? 'hi-upload__button--disabled' : ''}`}>
              {buttonText || '本地上传'}
            </span>
          </label>
        </div>
        {showUploadList && (
          <ul className='hi-upload__list'>
            {fileList.map((file, index) => {
              let listName = file.name.split('.')
              listName = listName[0].length > 20 ? file.name.substring(0, 19) + '....' + listName[1] : listName.join('.')
              const fileNameCls = classNames(
                'hi-upload__filename',
                file.uploadState === 'error' && 'hi-upload__filename--error'
              )
              return (
                <li key={index} title={file.name} className={'hi-upload__item'}>
                  <div className='img-wrap'>
                    <img src={file.url} />
                    {file.uploadState === 'loading' && (<div className='img-mask' />)}
                  </div>
                  <div className='hi-upload__right-content'>
                    <span className={fileNameCls}>{listName}</span>
                    <span>
                      {/* {file.uploadState !== 'loading' && (<span className={'Ficon-' + this.uploadStatusIcon(file.uploadState)} />)} */}
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
                          <i className='hi-upload__upstatus-line' style={{ width: (file.progressNumber * 3.25) + 'px' }} />
                          <i className='hi-upload__upstatus-num'>{file.progressNumber || 0}%</i>
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
