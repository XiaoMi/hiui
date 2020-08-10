import React from 'react'
import classNames from 'classnames'
import Provider from '../../context'
import Upload from './Upload'
import Icon from '../../icon'

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
      tips,
      localeDatas
    } = this.props
    const {
      overEvent,
      fileList
    } = this.state

    const dragCls = classNames(
      'hi-upload-legacy',
      'hi-upload-legacy--drag',
      overEvent && !disabled && 'drop-over',
      disabled && 'hi-upload-legacy--disabled',
      fileList.length > 0 && 'hi-upload-legacy--nohover'
    )
    return (
      <div
        className={dragCls}
        onDragOver={e => this.dragoverFn(e)}
        onDragLeave={e => this.dragleaveFn(e)}
        onDrop={e => this.dropFn(e)}
        onClick={(e) => {
          e.stopImmediatePropagation()
          if (!e.target.className.includes('hi-upload-legacy__operate-icon') && !e.target.className.includes('upload-input')) {
            this.uploadRef.click()
          }
        }}
      >
        <div
          className={
            fileList.length === 0
              ? 'show-drop-content'
              : 'drop-content'
          }
        >
          <label className='hi-upload-legacy-label'>
            <Icon name='upload-cloud' className='icon' />
            <span className='drop-click'>{localeDatas.upload.drag}</span>
            {
              tips && <span className='hi-upload-legacy__tips hi-upload-legacy__tips--single-line'>{tips}</span>
            }
            <input
              ref={node => { this.uploadRef = node }}
              type='file'
              className='upload-input'
              onChange={e => {
                this.uploadFiles(e.target.files)
              }}
              multiple={multiple && 'multiple'}
              disabled={disabled && 'disabled'}
              hidden
              accept={accept}
            />
          </label>
        </div>
        <ul
          className={
            fileList.length === 0
              ? 'hide-upload-list'
              : 'hi-upload-legacy__list'
          }
        >
          {
            fileList.length > 0 && <li className='hi-upload-legacy__item hi-upload-legacy__item-tips'>
              <Icon name='comment-circle-o' />{localeDatas.upload.dragTips}
            </li>
          }
          {fileList.map((file, index) => {
            const fileNameCls = classNames(
              'file-name',
              'upload-list__item-name',
              file.uploadState === 'error' && 'file-name--error'
            )
            return (
              <li
                key={index}
                title={file.name}
                className='hi-upload-legacy__item'
              >
                <span className={`Ficon-${file.fileType}`} />
                <div className='hi-upload-legacy__right-content'>
                  <span className={fileNameCls}>{file.name}</span>
                  <span
                    className='hi-upload-legacy__operate-icon'
                    onClick={(e) => this.deleteFile(e, file, index)}
                  >
                    {file.uploadState === 'loading' ? localeDatas.upload.cancel : localeDatas.upload.delete }
                  </span>
                </div>
                {
                  file.uploadState === 'loading' && (
                    <div className='hi-upload-legacy__upstatus'>
                      <i className='hi-upload-legacy__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                      <i className='hi-upload-legacy__upstatus-num'>{file.progressNumber || 0}%</i>
                    </div>
                  )
                }
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Provider(UploadDrag)
