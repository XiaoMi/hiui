import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'

class UploadDrag extends Upload {
  constructor (props) {
    super(props)
    this.state = Object.assign(
      {
        overEvent: false
      },
      this.state
    )
  }

  dragoverFn (e) {
    e.preventDefault()
    this.setState({ overEvent: true })
  }

  dragleaveFn (e) {
    e.preventDefault()
    this.setState({ overEvent: false })
  }

  dropFn (e) {
    e.stopPropagation()
    e.preventDefault()
    if (this.props.disabled) {
      return
    }
    this.setState({ overEvent: false })
    let files = e.dataTransfer.files
    this.uploadFiles(files)
  }

  render () {
    const {
      multiple,
      accept,
      disabled,
      onRemove
    } = this.props
    const {
      overEvent,
      fileList
    } = this.state

    return (
      <div
        className={classNames('hi-upload upload-drag', {'drop-over': overEvent && !disabled, 'hi-upload--disabled': disabled})}
        onDragOver={e => this.dragoverFn(e)}
        onDragLeave={e => this.dragleaveFn(e)}
        onDrop={e => this.dropFn(e)}
      >
        <p
          className={
            fileList.length === 0
              ? 'show-drop-content'
              : 'drop-content'
          }
        >
          <label className='hi-upload-label'>
            <i className='icon Ficon-uploadDrag' />
            <span className='drop-click'>拖动文件到此处或</span>
            <span className='drop-click'>点击上传</span>
            <input
              ref={node => { this.uploadRef = node }}
              type='file'
              className='upload-input'
              onChange={e => this.uploadFiles(e.target.files)}
              multiple={multiple && 'multiple'}
              disabled={disabled && 'disabled'}
              hidden
              accept={accept}
            />
          </label>
        </p>
        <ul
          className={
            fileList.length === 0
              ? 'hide-upload-list'
              : 'upload-list'
          }
        >
          {fileList.map((file, index) => {
            let listName = file.name.split('.')
            listName =
                listName[0].length > 20
                  ? file.name.substring(0, 19) + '....' + listName[1]
                  : listName.join('.')
            return (
              <li key={index} title={file.name}>
                <p className='upload-list__item'>
                  <span className={classNames(`Ficon-${file.fileType}`, 'upload-list__item-icon')} />
                  <span className='file-name upload-list__item-name'>{listName}</span>
                  <span className='state-wrap upload-list__item-status'>
                    {file.uploadState !== 'loading' && (
                      <span className={'Ficon-' + this.uploadStatusIcon(file.uploadState)} />
                    )}
                    { onRemove &&
                    <span
                      className='Ficon-wrong upload-list__item-remove'
                      onClick={() => this.deleteFile(file, index)}
                    />
                    }
                  </span>
                </p>
                {file.uploadState === 'loading' && (
                  <div className='loading-line-wrap'>
                    <i
                      className='loading-line'
                      style={{ width: file.progressNumber * 3.25 + 'px' }}
                    />
                    <i className='loading-num'>{file.progressNumber || 0}%</i>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Provider(UploadDrag)
