import React from 'react'
import classNames from 'classnames'
import Provider from '../context'
import Upload from './Upload'
import Preview from './Preview'

class UploadPhoto extends Upload {
  constructor (props) {
    super(props)
    this.state = Object.assign(
      {
        uploading: false,
        progressNumber: 0,
        showModal: false,
        previewFile: {}
      },
      this.state
    )
  }

  closeModal () {
    this.setState({
      previewFile: {},
      showModal: false
    })
  }

  previewImage (file) {
    this.setState({
      previewFile: file,
      showModal: true
    })
  }

  render () {
    const {
      fileList,
      showModal,
      previewFile
    } = this.state
    const {
      onRemove,
      disabled,
      accept
    } = this.props

    return (
      <div className={classNames('hi-upload upload-photo', {'hi-upload--disabled': disabled})}>
        <ul className='photo-display' ref='photodisplay'>
          {fileList.map((file, index) => {
            if (file.uploadState === 'loading') {
              return (
                <li key={index}>
                  <div className='img-uploading'>
                    <img src={file.url} />
                    <div className='upload-precent'>
                      <p className='precent-num'>{file.progressNumber ? (file.progressNumber < 100 ? (file.progressNumber + '%') : '上传成功') : (0 + '%')}</p>
                      <div className='precent-loading' style={{ width: (file.progressNumber * 1.4) + 'px' }} />
                    </div>
                  </div>
                </li>
              )
            } else {
              return (
                <li key={index}>
                  <div className='img-uploaded'>
                    <img src={file.url} />
                    <div className='upload-comperate'>
                      <span
                        className='icon Ficon-origin'
                        onClick={() => this.previewImage(file)}
                      />
                      { onRemove &&
                        <span
                          className='icon Ficon-delete-photo'
                          onClick={() => this.deleteFile(file, index)}
                        />
                      }
                    </div>
                  </div>
                </li>
              )
            }
          })}
          <li>
            <label>
              <input
                ref={node => { this.uploadRef = node }}
                type='file'
                className='upload-input'
                accept={accept}
                disabled={disabled && 'disabled'}
                onChange={e => this.uploadFiles(e.target.files)}
                hidden
              />
              <span className='photo-upload'>+</span>
            </label>
          </li>
        </ul>
        <Preview
          src={previewFile.url}
          show={showModal}
          onClose={this.closeModal.bind(this)}
        />
      </div>
    )
  }
}
UploadPhoto.defaultProps = Object.assign({}, {
  ...Upload.defaultProps
}, {
  accept: 'image/jpg,image/jpeg,image/png'
})

export default Provider(UploadPhoto)
