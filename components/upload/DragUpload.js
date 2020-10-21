import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import FileSelect from './FileSelect'
import useUpload from './hooks/useUpload'

const DragUpload = ({
  multiple,
  accept,
  disabled,
  tips,
  localeDatas,
  onRemove,
  theme,
  onDownload,
  fileList,
  defaultFileList,
  maxCount,
  onChange,
  maxSize,
  uploadAction,
  name = 'file',
  withCredentials,
  headers,
  data,
  beforeUpload,
  customUpload
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

  const [dragging, setDragging] = useState(false)
  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      uploadFiles(e.dataTransfer.files)
    }
    setDragging(false)
  }, [])
  const dragCls = classNames(
    'hi-upload',
    'hi-upload--drag',
    dragging && !disabled && 'drop-over',
    disabled && 'hi-upload--disabled',
    _fileList.length > 0 && 'hi-upload--nohover'
  )

  return (
    <FileSelect
      onSelect={uploadFiles}
      multiple={multiple}
      className={`theme__${theme}`}
      disabled={disabled || _fileList.length >= maxCount}
      accept={accept}
    >
      <div className={dragCls} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {_fileList.length === 0 ? (
          <div className={'drag-upload__desc'}>
            <Icon name="cloud-upload" className="icon" />
            <span>{localeDatas.upload.drag}</span>
            {tips && <span className="hi-upload__tips hi-upload__tips--single-line">{tips}</span>}
          </div>
        ) : (
          <ul className={'hi-upload__list'}>
            {_fileList.length > 0 && (
              <li className="hi-upload__item hi-upload__item-tips">
                <Icon name="tishi" />
                <span className="hi-upload__tips--exist">
                  {_fileList.length >= maxCount ? localeDatas.upload.dragTipsLimited : localeDatas.upload.dragTips}
                  {tips && '，' + tips}
                </span>
              </li>
            )}
            {_fileList.map((file, index) => {
              return (
                <li key={index} title={file.name} className="hi-upload__item">
                  <span className={`Ficon-${file.fileType}`} />
                  <div className="hi-upload__right-content">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={file.url || null}
                      className={classNames(
                        'hi-upload__filename',
                        'upload-list__item-name',
                        file.uploadState === 'error' && 'hi-upload__filename--error'
                      )}
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
                    <span
                      className="hi-upload__operate-icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(file, index)
                      }}
                    >
                      {file.uploadState === 'loading' ? localeDatas.upload.cancel : localeDatas.upload.delete}
                    </span>
                  </div>
                  {file.uploadState === 'loading' && (
                    <div className="hi-upload__upstatus">
                      <i className="hi-upload__upstatus-line" style={{ width: file.progressNumber + '%' }} />
                      <i className="hi-upload__upstatus-num">
                        {(file.progressNumber && file.progressNumber.toFixed(2)) || 0}%
                      </i>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </FileSelect>
  )
}

export default DragUpload
