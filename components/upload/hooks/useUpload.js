import { useState, useEffect, useCallback, useRef } from 'react'
import request from '../request'
import { getFileType } from '../util'
import { v4 as uuidV4 } from 'uuid'
import Modal from '../../modal'

const useUpload = ({
  fileList,
  defaultFileList,
  onChange,
  uploadAction,
  maxSize,
  name = 'file',
  withCredentials,
  headers,
  data,
  onRemove,
  beforeUpload,
  customUpload,
  localeDatas
}) => {
  const localMap = localeDatas.upload || {}
  const [_fileList, updateFileList] = useState(fileList || defaultFileList || [])
  const fileListRef = useRef(fileList || defaultFileList || [])
  useEffect(() => {
    if (fileList) {
      updateFileList(fileList)
      fileListRef.current = fileList
    }
  }, [fileList])

  const deleteFile = useCallback((file, index) => {
    if (file.abort) {
      file.abort()
    }
    let result = true
    if (onRemove) {
      result = onRemove(file, [...fileListRef.current], index)
    }
    if (!fileList) {
      const newFileList = [...fileListRef.current]
      newFileList.splice(index, 1)
      if (result === true) {
        fileListRef.current = newFileList
        updateFileList(fileListRef.current)
      } else if (result && typeof result.then === 'function') {
        result.then((res) => {
          if (res === true) {
            fileListRef.current = newFileList
            updateFileList(fileListRef.current)
          }
        })
      }
    }
  }, [])

  const onSuccess = (file, res) => {
    const newFileList = [...fileListRef.current]
    file.uploadState = 'success'
    delete file.abort
    const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
    const result = onChange(file, newFileList, res)
    // 处理如果onChange return false 的时候需要删除该文件
    if (typeof result === 'boolean' && !result) {
      deleteFile(file, idx)
      return
    }
    newFileList.splice(idx, 1, file)

    if (fileList) {
      return false
    } else if (result && typeof result.then === 'function') {
      result.then((re) => {
        if (re === false) {
          return false
        } else {
          fileListRef.current = newFileList
          updateFileList(fileListRef.current)
        }
      })
    } else {
      fileListRef.current = newFileList
      updateFileList(fileListRef.current)
    }
  }

  const onProgress = useCallback(
    (file, e) => {
      const newFileList = [...fileListRef.current]
      file.progressNumber = e.percent
      const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
      newFileList.splice(idx, 1, file)
      fileListRef.current = newFileList
      updateFileList(fileListRef.current)
    },
    [onChange]
  )

  const onError = (file, error, res) => {
    const newFileList = [...fileListRef.current]
    file.uploadState = 'error'
    const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
    const result = onChange(file, newFileList, res)

    // 处理如果onChange return false 的时候需要删除该文件
    if (typeof result === 'boolean' && !result) {
      deleteFile(file, idx)
      return
    }

    newFileList.splice(idx, 1, file)

    if (fileList) {
      return false
    } else if (result && typeof result.then === 'function') {
      result.then((re) => {
        if (re === false) {
          return false
        } else {
          fileListRef.current = newFileList
          updateFileList(fileListRef.current)
        }
      })
    } else {
      fileListRef.current = newFileList
      updateFileList(fileListRef.current)
    }
  }

  const uploadFiles = useCallback(
    (files) => {
      if (customUpload) {
        customUpload(files)
      } else {
        const _files = Object.keys(files)
          .map((idx) => {
            const file = files[idx]
            if (beforeUpload) {
              const result = beforeUpload(file, fileListRef.current)
              if (result === false) {
                return null
              }
            }
            if (file.size > maxSize * 1024) {
              Modal.confirm({
                title: localMap.modalTitle,
                content: localMap.modalTiptxt,
                cancelText: null,
                confirmText: localMap.modalBtn
              })

              return null
            }
            file.fileId = uuidV4()
            file.uploadState = 'loading'
            file.fileType = getFileType(file)
            return file
          })
          .filter(async (file) => {
            if (file) {
              if (file.fileType === 'img') {
                // 用来图片预览
                const fr = new FileReader()
                fr.onload = (e) => {
                  const url = e.target.result
                  file.url = url
                }
                fr.readAsDataURL(file)
              }
              let _uploadAction = typeof uploadAction === 'string' ? uploadAction : uploadAction(file)

              if (_uploadAction.toString() === '[object Promise]') {
                await _uploadAction
                  .then((res) => {
                    _uploadAction = res
                  })
                  .catch((error) => {
                    throw new Error(error)
                  })
              }
              const action = request({
                file,
                action: _uploadAction,
                name,
                withCredentials,
                headers,
                data,
                onSuccess,
                onError,
                onProgress
              })
              file.abort = action.abort
              return file
            }
            return false
          })

        fileListRef.current = _files
          .filter((file) => {
            return file
          })
          .reverse()
          .concat(fileListRef.current)
        updateFileList(fileListRef.current)
      }
    },
    [onSuccess, onProgress, onError, uploadAction, name, withCredentials, headers, data, beforeUpload, customUpload]
  )

  return [_fileList, uploadFiles, deleteFile]
}

export default useUpload
