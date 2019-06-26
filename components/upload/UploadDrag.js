import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'
import Icon from '../icon'

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
      onRemove,
      tips
    } = this.props
    const {
      overEvent,
      fileList
    } = this.state

    const dragCls = classNames(
      'hi-upload',
      'hi-upload--drag',
      overEvent && !disabled && 'drop-over',
      disabled && 'hi-upload--disabled',
      fileList.length > 0 && 'hi-upload--drag-border'
    )
    return (
      <div
        className={dragCls}
        onDragOver={e => this.dragoverFn(e)}
        onDragLeave={e => this.dragleaveFn(e)}
        onDrop={e => this.dropFn(e)}
      >
        <div
          className={
            fileList.length === 0
              ? 'show-drop-content'
              : 'drop-content'
          }
        >
          <label className='hi-upload-label'>
            <Icon name='upload-cloud' className='icon' />
            <span className='drop-click'>拖拽文件上传</span>
            {
              tips && <span className='hi-upload__tips hi-upload__tips--single-line'>{tips}</span>
            }
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
        </div>
        <ul
          className={
            fileList.length === 0
              ? 'hide-upload-list'
              : 'hi-upload__list'
          }
        >
          {
            fileList.length > 0 && <li className='hi-upload__item hi-upload__item-tips'>
              <Icon name='comment-circle-o' />请拖拽文件进行上传
            </li>
          }
          {fileList.map((file, index) => {
            let listName = file.name.split('.')
            listName = listName[0].length > 20
              ? file.name.substring(0, 19) + '....' + listName[1]
              : listName.join('.')
            const fileNameCls = classNames(
              'file-name',
              'upload-list__item-name',
              file.uploadState === 'error' && 'file-name--error'
            )
            return (
              <li
                key={index}
                title={file.name}
                className='hi-upload__item'
              >
                <span className={`Ficon-${file.fileType}`} />
                <div className='hi-upload__right-content'>
                  <span className={fileNameCls}>{listName}</span>
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
      </div>
    )
  }
}

export default Provider(UploadDrag)
