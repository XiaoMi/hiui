import React from 'react'
import Provider from '../context'
import Upload from './Upload'

class UploadDrag extends Upload {
  constructor (props) {
    super(props)
    this.state = Object.assign({},
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
    this.setState({ overEvent: false })
    let files = e.dataTransfer.files
    this.uploadFiles(files)
  }

  render () {
    const {
      multiple
    } = this.props
    const {
      overEvent,
      fileList
    } = this.state

    return (
      <div className='upload-drag'>
        <div
          className={overEvent ? 'drop-over drop-wrap' : 'drop-wrap'}
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
            <label>
              <i className='icon Ficon-uploadDrag' />
              <span className='drop-click'>拖动文件到此处或</span>
              <span className='drop-click'>点击上传</span>
              <input
                ref='upload'
                type='file'
                className='upload-input'
                onChange={e => this.uploadFiles(e.target.files)}
                multiple={multiple && 'multiple'}
                hidden
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
                  <p>
                    <span className={'Ficon-' + file.curType} />
                    <span className='file-name'>{listName}</span>
                    <span className='state-wrap'>
                      {file.uploadState !== 'loading' && (
                        <span className={'Ficon-' + file.uploadState} />
                      )}
                      <span
                        className='Ficon-wrong'
                        onClick={this.deleteFile.bind(this, index)}
                      />
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
      </div>
    )
  }
}

export default Provider(UploadDrag)
