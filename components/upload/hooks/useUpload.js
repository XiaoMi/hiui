import { useState, useEffect, useCallback } from 'react'
import request from '../request'
import { getFileType } from '../util'
import { v4 as uuidV4 } from 'uuid'

const useUpload = ({
  fileList,
  defaultFileList,
  onChange,
  uploadAction,
  maxSize,
  name,
  withCredentials,
  headers,
  data,
  onRemove
}) => {
  const [_fileList, updateFileList] = useState(fileList || defaultFileList || [])
  useEffect(() => {
    if (fileList) {
      updateFileList(fileList)
    }
  }, [fileList])

  const deleteFile = useCallback(
    (file, index) => {
      if (file.abort) {
        file.abort()
      }
      let result = true
      if (onRemove) {
        result = onRemove(file)
      }
      if (!fileList) {
        if (result === true) {
          const newFileList = [..._fileList]
          newFileList.splice(index, 1)
          updateFileList(newFileList)
        } else if (result && typeof result.then === 'function') {
          result.then((res) => {
            if (res === true) {
              const newFileList = [..._fileList]
              newFileList.splice(index, 1)
              updateFileList(newFileList)
            }
          })
        }
      }
    },
    [_fileList]
  )

  const onSuccess = useCallback(
    (file, res) => {
      const newFileList = [..._fileList]
      file.uploadState = 'success'
      delete file.abort
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
            const action = request({
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
            file.abort = action.abort
          }
          return file
        })
      updateFileList(_files.reverse().concat(_fileList))
    },
    [onSuccess, onProgress, onError, uploadAction, name, withCredentials, headers, data, _fileList]
  )

  return [_fileList, uploadFiles, deleteFile]
}

export default useUpload
