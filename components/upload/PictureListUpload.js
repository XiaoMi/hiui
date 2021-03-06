import React, { useCallback } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import Button from '../button'
import FileSelect from './FileSelect'
import useUpload from './hooks/useUpload'

const PictureListUpload = ({
  content,
  showUploadList = true,
  multiple,
  disabled,
  accept = 'image/*',
  onRemove,
  onDownload,
  fileList,
  defaultFileList,
  maxCount,
  loading,
  onChange,
  uploadAction,
  maxSize,
  name,
  theme,
  withCredentials,
  headers,
  data,
  beforeUpload,
  customUpload,
  localeDatas
}) => {
  const [_fileList, uploadFiles, deleteFile] = useUpload({
    fileList,
    defaultFileList,
    onChange,
    uploadAction,
    maxSize,
    name,
    withCredentials,
    headers,
    data,
    onRemove,
    beforeUpload,
    customUpload,
    localeDatas
  })

  const handleItemKeydown = useCallback(
    (e, file, index) => {
      // ENTER
      if (e.keyCode === 13) {
        e.preventDefault()
        e.target.querySelector('a').click()
      }
      // DEL
      if (e.keyCode === 46) {
        e.preventDefault()
        deleteFile(file, index)
      }
    },
    [deleteFile]
  )
  return (
    <div className={`hi-upload hi-upload--picture-card theme__${theme}`}>
      <FileSelect
        style={{ display: 'inline-block' }}
        onSelect={uploadFiles}
        multiple={multiple}
        disabled={disabled || _fileList.length >= maxCount}
        accept={accept}
      >
        <Button type="primary" disabled={disabled || _fileList.length >= maxCount} loading={loading}>
          {content || localeDatas.upload.buttonText}
        </Button>
      </FileSelect>
      {showUploadList && _fileList.length > 0 && (
        <ul className="hi-upload__list">
          {_fileList.map((file, index) => {
            const fileNameCls = classNames(
              'hi-upload__filename',
              file.uploadState === 'error' && 'hi-upload__filename--error'
            )
            const itemCls = classNames('hi-upload__item', file.uploadState === 'error' && 'hi-upload__item--error')
            return (
              <li
                key={index}
                title={file.name}
                className={itemCls}
                tabIndex={0}
                onKeyDown={(e) => {
                  handleItemKeydown(e, file, index)
                }}
              >
                <div className="img-wrap">
                  <img src={file.url} />
                </div>
                <div className="hi-upload__right-content">
                  <a
                    target="_blank"
                    rel="noreferrer"
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
                    <Icon
                      name={file.uploadState === 'loading' ? 'close' : 'delete'}
                      onClick={() => deleteFile(file, index)}
                    />
                  </span>
                  {file.uploadState === 'loading' && (
                    <div className="hi-upload__upstatus">
                      <i className="hi-upload__upstatus-line" style={{ width: file.progressNumber + '%' }} />
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
