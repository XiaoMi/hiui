import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'
import Icon from '../icon'

class UploadClick extends Upload {
  render () {
    const {
      buttonText,
      disabled,
      multiple,
      tips,
      showUploadList,
      onRemove,
      accept
    } = this.props
    const {
      fileList
    } = this.state

    return (
      <div className='hi-upload hi-upload--normal'>
        <label>
          <input
            ref={node => { this.uploadRef = node }}
            type='file'
            onChange={e => this.uploadFiles(e.target.files)}
            multiple={multiple && 'multiple'}
            disabled={disabled && 'disabled'}
            accept={accept}
            hidden
          />
          <span className={`hi-upload__button ${disabled ? 'hi-upload__button--disabled' : ''}`}>
            { buttonText }
          </span>
        </label>
        {
          tips && <span className='hi-upload__tips hi-upload__tips--single-line'>{tips}</span>
        }
        {showUploadList && (
          <ul className='hi-upload__list'>
            {fileList.map((file, index) => {
              let listName = file.name.split('.')
              listName =
              listName[0].length > 20
                ? file.name.substring(0, 19) + '....' + listName[1]
                : listName.join('.')
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
