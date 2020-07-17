import React, { useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import FileSelect from './FileSelect'
import request from './request'
import { v4 as uuidV4 } from 'uuid'
import { getFileType } from './util'

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
  name,
  withCredentials,
  headers,
  data
}) => {
  const [_fileList, updateFileList] = useState(fileList || defaultFileList || [])
  useEffect(() => {
    if (fileList) {
      updateFileList(fileList)
    }
  }, [fileList])
  const onSuccess = useCallback(
    (file, res) => {
      const newFileList = [..._fileList]
      file.uploadState = 'success'
      const idx = _fileList.findIndex((item) => item.fileId === file.fileId)
      newFileList.splice(idx, 1, file)
      const result = onChange(file, newFileList, res)
      if (fileList) {
        return false
      } else if (result && typeof result.then === 'function') {
        result.then((re) => {
          if (re === false) {
            return false
          } else {
            updateFileList(newFileList)
          }
        })
      } else {
        updateFileList(newFileList)
      }
    },
    [_fileList, onChange]
  )
  const onProgress = useCallback(
    (file, e) => {
      const newFileList = [..._fileList]
      file.progressNumber = e.percent
      const idx = _fileList.findIndex((item) => item.fileId === file.fileId)
      newFileList.splice(idx, 1, file)
      updateFileList(newFileList)
    },
    [_fileList]
  )
  const onError = useCallback(
    (file, error, res) => {
      const newFileList = [..._fileList]
      file.uploadState = 'error'
      const idx = _fileList.findIndex((item) => item.fileId === file.fileId)
      newFileList.splice(idx, 1, file)
      const result = onChange(file, newFileList, res)
      if (fileList) {
        return false
      } else if (result && typeof result.then === 'function') {
        result.then((re) => {
          if (re === false) {
            return false
          } else {
            updateFileList(newFileList)
          }
        })
      } else {
        updateFileList(newFileList)
      }
    },
    [_fileList, onChange]
  )
  const uploadFiles = useCallback(
    (files) => {
      const _files = Object.keys(files)
        .map((idx) => {
          let file = files[idx]
          // TODO: beforeUpload customUpload
          if (file.size > maxSize * 1024) {
            // TODO: 弹窗提醒

            return null
          }
          file.fileId = uuidV4()
          file.uploadState = 'loading'
          file.fileType = getFileType(file)
          return file
        })
        .filter((file) => {
          if (file) {
            request({
              file,
              action: uploadAction,
              name,
              withCredentials,
              headers,
              data,
              onSuccess,
              onError,
              onProgress
            })
          }
          return file
        })
      updateFileList(_files.reverse().concat(_fileList))
    },
    [onSuccess, onProgress, onError, uploadAction, name, withCredentials, headers, data, _fileList]
  )

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
    `theme__${theme}`,
    'hi-upload',
    'hi-upload--drag',
    dragging && !disabled && 'drop-over'
    // disabled && 'hi-upload--disabled',
    // fileList.length > 0 && 'hi-upload--nohover'
  )

  // TODO: 文件大小限制弹窗
  return (
    <FileSelect
      onSelect={uploadFiles}
      multiple={multiple}
      disabled={disabled || _fileList.length >= maxCount}
      accept={accept}
    >
      <div className={dragCls} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <div className={_fileList.length === 0 ? 'show-drop-content' : 'drop-content'}>
          <label className='hi-upload-label'>
            <Icon name='upload-cloud' className='icon' />
            <span className='drop-click'>{localeDatas.upload.drag}</span>
            {tips && <span className='hi-upload__tips hi-upload__tips--single-line'>{tips}</span>}
          </label>
        </div>
        <ul className={_fileList.length === 0 ? 'hide-upload-list' : 'hi-upload__list'}>
          {_fileList.length > 0 && (
            <li className='hi-upload__item hi-upload__item-tips' onClick={this.targetInput}>
              <Icon name='tishi' />
              <span className='hi-upload__tips--exist'>
                {_fileList.length >= maxCount ? localeDatas.upload.dragTipsLimited : localeDatas.upload.dragTips}
                {tips && '，' + tips}
              </span>
            </li>
          )}
          {_fileList.map((file, index) => {
            return (
              <li key={index} title={file.name} className='hi-upload__item'>
                <span className={`Ficon-${file.fileType}`} />
                <div className='hi-upload__right-content'>
                  <a
                    target='_blank'
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
                  {onRemove && (
                    <span className='hi-upload__operate-icon' onClick={() => this.deleteFile(file, index)}>
                      {file.uploadState === 'loading' ? localeDatas.upload.cancel : localeDatas.upload.delete}
                    </span>
                  )}
                </div>
                {file.uploadState === 'loading' && (
                  <div className='hi-upload__upstatus'>
                    <i className='hi-upload__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                    <i className='hi-upload__upstatus-num'>{file.progressNumber || 0}%</i>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </FileSelect>
  )
}

export default DragUpload
