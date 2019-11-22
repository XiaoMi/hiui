import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'
import Icon from '../icon'

class UploadClick extends Upload {
  handleButtonClick = (e) => {
    this.uploadRef.value = ''
  }
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
      <div className='hi-upload hi-upload--normal'>
        {
          this.outMaxsizeTip()
        }
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
          <span className={`hi-upload__button ${(disabled || fileCountLimted) ? 'hi-upload__button--disabled' : ''}`} onClick={this.handleButtonClick}>
            { buttonText || localeDatas.upload.buttonText}
          </span>
        </label>
        {
          tips && <span className='hi-upload__tips hi-upload__tips--single-line'>{tips}</span>
        }
        {showUploadList && (
          <ul className='hi-upload__list'>
            {fileList.map((file, index) => {
              const fileNameCls = classNames(
                'hi-upload__filename',
                file.uploadState === 'error' && 'hi-upload__filename--error'
              )
              return (
                <li
                  key={index}
                  className='hi-upload__item'
                  title={file.name}
                >
                  <span className={classNames(`Ficon-${file.fileType}`)} />
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
                  </div>
                  {
                    file.uploadState === 'loading' && (
                      <div className='hi-upload__upstatus'>
                        <i className='hi-upload__upstatus-line' style={{ width: file.progressNumber + '%' }} />
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
