import React from 'react'
import classNames from 'classnames'
import Provider from '../../context'
import Upload from './Upload'
import Icon from '../../icon'

class UploadClick extends Upload {
  render () {
    const {
      buttonText,
      disabled,
      multiple,
      tips,
      showUploadList,
      onRemove,
      accept,
      localeDatas
    } = this.props
    const {
      fileList,
      fileCountLimted
    } = this.state
    return (
      <div className='hi-upload-legacy hi-upload-legacy--normal'>
        <label>
          <input
            ref={node => { this.uploadRef = node }}
            type='file'
            onChange={e => this.uploadFiles(e.target.files)}
            multiple={multiple && 'multiple'}
            disabled={(disabled || fileCountLimted) && 'disabled'}
            accept={accept}
            hidden
          />
          <span className={`hi-upload-legacy__button ${(disabled || fileCountLimted) ? 'hi-upload-legacy__button--disabled' : ''}`}>
            { buttonText || localeDatas.upload.buttonText}
          </span>
        </label>
        {
          tips && <span className='hi-upload-legacy__tips hi-upload-legacy__tips--single-line'>{tips}</span>
        }
        {showUploadList && (
          <ul className='hi-upload-legacy__list'>
            {fileList.map((file, index) => {
              const fileNameCls = classNames(
                'hi-upload-legacy__filename',
                file.uploadState === 'error' && 'hi-upload-legacy__filename--error'
              )
              return (
                <li
                  key={index}
                  className='hi-upload-legacy__item'
                  title={file.name}
                >
                  <span className={classNames(`Ficon-${file.fileType}`)} />
                  <div className='hi-upload-legacy__right-content'>
                    <span className={fileNameCls} title={file.name}>{file.name}</span>
                    <span>
                      { onRemove &&
                        <Icon
                          name={file.uploadState === 'loading' ? 'close' : 'delete'}
                          onClick={() => this.deleteFile(file, index)}
                        />
                      }
                    </span>
                  </div>
                  {
                    file.uploadState === 'loading' && (
                      <div className='hi-upload-legacy__upstatus'>
                        <i className='hi-upload-legacy__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                      </div>
                    )
                  }
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
  type: 'normal'
})

export default Provider(UploadClick)
