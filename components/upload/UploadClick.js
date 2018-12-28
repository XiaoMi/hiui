import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'

class UploadClick extends Upload {
  render () {
    const {
      buttonText,
      disabled,
      multiple,
      buttonIcon,
      showUploadList,
      onRemove,
      accept
    } = this.props
    const {
      fileList
    } = this.state

    return (
      <div className='hi-upload upload-normal'>
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
            <span className={`upload-title ${disabled ? 'disabled' : ''}`}>
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
                <li
                  key={index}
                  title={file.name}
                >
                  <p className='upload-list__item'>
                    <span className={classNames(`Ficon-${file.fileType}`, 'upload-list__item-icon')} />
                    <span className='file-name upload-list__item-name'>{listName}</span>
                    <span className='state-wrap upload-list__item-status'>
                      {file.uploadState !== 'loading' && (<span className={'Ficon-' + this.uploadStatusIcon(file.uploadState)} />)}
                      { onRemove &&
                        <span
                          className='Ficon-wrong upload-list__item-remove'
                          onClick={() => this.deleteFile(file, index)}
                        />
                      }
                    </span>
                  </p>
                  {file.uploadState === 'loading' && (<div className='loading-line-wrap'>
                    <i className='loading-line' style={{ width: (file.progressNumber * 3.25) + 'px' }} />
                    <i className='loading-num'>{file.progressNumber || 0}%</i>
                  </div>)}
                </li>
              )
            })}
          </ul>)}
      </div>
    )
  }
}

UploadClick.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  uploadType: 'normal'
})

export default Provider(UploadClick)
