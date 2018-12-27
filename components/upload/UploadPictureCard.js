import React from 'react'
import Upload from './Upload'
import Provider from '../context'

class UploadPictureCard extends Upload {
  render () {
    const {
      buttonText,
      showUploadList,
      buttonIcon,
      multiple,
      disabled,
      accept,
      onRemove
    } = this.props
    const {
      fileList
    } = this.state

    return (
      <div className='upload-pictureCard'>
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
            <span
              className={`upload-title ${
                disabled ? 'disabled' : ''
              }`}
            >
              <i className={`icon Ficon-${buttonIcon}`} />&nbsp;{ buttonText }
            </span>
          </label>
        </div>
        {showUploadList && (
          <ul ref='prvbox' className='upload-list'>
            {fileList.map((file, index) => {
              let listName = file.name.split('.')
              listName =
                listName[0].length > 20
                  ? file.name.substring(0, 19) + '....' + listName[1]
                  : listName.join('.')
              return (
                <li key={index} title={file.name} className={file.uploadState === 'loading' ? 'loading' : ''}>
                  <div className='img-wrap'>
                    <img src={file.url} />
                    {file.uploadState === 'loading' && (<div className='img-mask' />)}
                  </div>
                  <div className='img-info-wrap'>
                    <p className='file-wrap'>
                      <span className='file-name'>{listName}</span>
                      {file.uploadState !== 'loading' && (
                        <span className='state-wrap'>
                          <span className={'Ficon-' + file.uploadState} />
                          { onRemove &&
                            <span
                              className='Ficon-wrong'
                              onClick={() => this.deleteFile(file, index)}
                            />
                          }
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
UploadPictureCard.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  accept: 'image/jpg,image/jpeg,image/png'
})

export default Provider(UploadPictureCard)
