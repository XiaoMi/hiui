import React from 'react'
import Provider from '../context'
import Upload from './Upload'

class UploadClick extends Upload {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, this.props)
  }

  render () {
    const {
      buttonText,
      disabled,
      multiple,
      buttonIcon,
      showUploadList
    } = this.props
    const {
      fileList
    } = this.state

    return (
      <div className='upload-normal'>
        <div>
          <label>
            <input
              ref='upload'
              type='file'
              className='upload-input'
              onChange={e => this.uploadFiles(e.target.files)}
              multiple={multiple && 'multiple'}
              disabled={disabled && 'disabled'}
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
                  <p>
                    <span className={'Ficon-' + file.fileType} />
                    <span className='file-name'>{listName}</span>
                    <span className='state-wrap'>
                      {file.uploadState !== 'loading' && (<span className={'Ficon-' + file.uploadState} />)}
                      <span
                        className='Ficon-wrong'
                        onClick={this.deleteFile.bind(this, index)}
                      />
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
