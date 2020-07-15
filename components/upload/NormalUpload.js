import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import Button from '../button'
import Icon from '../icon'
import FileSelect from './FileSelect'
import { v4 as uuidV4 } from 'uuid'
import request from './request'

const getFileType = (file) => {
  let ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
  let fileType = 'other'
  if (['jpg', 'jpeg', 'gif', 'png', 'bmp'].includes(ext)) {
    fileType = 'img'
  }
  if (['rar', 'zip'].includes(ext)) {
    fileType = 'zip'
  }
  if (['rar', 'zip'].includes(ext)) {
    fileType = 'zip'
  }
  if (['doc', 'docx'].includes(ext)) {
    fileType = 'word'
  }
  if (['pdf'].includes(ext)) {
    fileType = 'pdf'
  }
  if (['ppt', 'pptx'].includes(ext)) {
    fileType = 'ppt'
  }
  if (['key'].includes(ext)) {
    fileType = 'key'
  }
  if (['exe', 'dmg'].includes(ext)) {
    fileType = 'exe'
  }

  if (['xls', 'xlsx'].includes(ext)) {
    fileType = 'excel'
  }
  if (['mp4'].includes(ext)) {
    fileType = 'video'
  }
  if (['mp3'].includes(ext)) {
    fileType = 'audio'
  }
  return fileType
}

const NormalUpload = ({
  maxCount,
  content,
  disabled,
  multiple,
  tips,
  showUploadList = true,
  onRemove,
  accept,
  loading,
  onDownload,
  fileList,
  defaultFileList,
  maxSize,
  uploadAction,
  name,
  withCredentials,
  headers,
  data,
  onChange
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
  return (
    <div className={`hi-upload`}>
      {/* TODO: 文件大小限制弹窗 */}
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
      {tips && <span className='hi-upload__tips'>{tips}</span>}
      {showUploadList && _fileList.length > 0 && (
        <ul className='hi-upload__list'>
          {_fileList.map((file, index) => {
            return (
              <li key={index} className='hi-upload__item' title={file.name}>
                <span className={classNames(`Ficon-${file.fileType}`)} />
                <div className='hi-upload__right-content'>
                  <a
                    target='_blank'
                    href={file.url || null}
                    className={classNames(
                      'hi-upload__filename',
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
                  <span>
                    {onRemove && (
                      <Icon
                        onClick={() => this.deleteFile(file, index)}
                        name={file.uploadState === 'loading' ? 'close' : 'delete'}
                      />
                    )}
                  </span>
                </div>
                {file.uploadState === 'loading' && (
                  <div className='hi-upload__upstatus'>
                    <i className='hi-upload__upstatus-line' style={{ width: file.progressNumber + '%' }} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default NormalUpload
