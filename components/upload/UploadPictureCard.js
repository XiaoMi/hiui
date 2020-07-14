import React, { useState } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import Button from '../button'
import FileSelect from './FileSelect'

const PictureListUpload = ({
  content,
  showUploadList,
  multiple,
  disabled,
  accept,
  onRemove,
  localeDatas,
  theme,
  onDownload,
  fileList,
  defaultFileList,
  maxCount,
  loading
}) => {
  const [_fileList, updateFileList] = useState(fileList || defaultFileList || [])
  const uploadFiles = (files) => {
    updateFileList(files)
    console.log(files)
  }
  return (
    <div className={`hi-upload hi-upload--picture-card theme__${theme}`}>
      <FileSelect
        onSelect={uploadFiles}
        multiple={multiple}
        disabled={disabled || _fileList.length >= maxCount}
        accept={accept}
      >
        <Button type='primary' disabled={disabled || _fileList.length >= maxCount} loading={loading}>
          {content}
        </Button>
      </FileSelect>
      {showUploadList && _fileList.length > 0 && (
        <ul className='hi-upload__list'>
          {_fileList.map((file, index) => {
            const fileNameCls = classNames(
              'hi-upload__filename',
              file.uploadState === 'error' && 'hi-upload__filename--error'
            )
            const itemCls = classNames('hi-upload__item', file.uploadState === 'error' && 'hi-upload__item--error')
            return (
              <li key={index} title={file.name} className={itemCls}>
                <div className='img-wrap'>
                  <img src={file.url} />
                </div>
                <div className='hi-upload__right-content'>
                  <a
                    target='_blank'
                    href={file.url || null}
                    className={fileNameCls}
                    title={file.name}
                    onClick={(e) => {
                      if (onDownload) {
                        e.preventDefault()
                        onDownload(file)
                      }
                    }}
                  >
                    {file.name}
                  </a>
                  <span>
                    {onRemove && (
                      <Icon
                        name={file.uploadState === 'loading' ? 'close' : 'delete'}
                        onClick={() => this.deleteFile(file, index)}
                      />
                    )}
                  </span>
                  {file.uploadState === 'loading' && (
                    <div className='hi-upload__upstatus'>
                      <i className='hi-upload__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default PictureListUpload
