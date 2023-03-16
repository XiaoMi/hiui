import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocaleContext } from '@hi-ui/core'
import { uuid } from '@hi-ui/use-id'
import message from '@hi-ui/message'
import request from '../request'
import { getFileItems, getFileType } from '../utils'
import { UploadProps, UploadFileItem } from '../types'

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
  maxCount,
  method = 'POST',
  accept,
}: UploadProps): [
  UploadFileItem[],
  (files: HTMLInputElement['files']) => Promise<void>,
  (file: UploadFileItem, index: any) => void
] => {
  const i18n = useLocaleContext()

  const messageText = i18n.get('upload.modalTiptxt')

  const [_fileList, updateFileList] = useState(fileList || defaultFileList || [])
  const fileListRef = useRef(fileList || defaultFileList || [])

  useEffect(() => {
    if (fileList) {
      updateFileList(fileList)
      fileListRef.current = fileList
    }
  }, [fileList])

  const deleteFile = useCallback(
    (file: UploadFileItem, index) => {
      if (file.abort) {
        file.abort()
      }
      let result: boolean | Promise<boolean> = true
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
    },
    [onRemove, fileList]
  )

  const onSuccess = useCallback(
    (file: UploadFileItem, body: Object) => {
      const newFileList = [...fileListRef.current]
      file.uploadState = 'success'
      delete file.abort
      const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
      const result: boolean | Promise<boolean> | undefined | void =
        onChange && onChange(file, newFileList, body)
      // 处理如果onChange return false 的时候需要删除该文件
      if (typeof result === 'boolean' && !result) {
        deleteFile(file, idx)
        return
      }
      newFileList.splice(idx, 1, file)

      if (fileList) {
        return false
      } else if (result && typeof (result as Promise<boolean>).then === 'function') {
        ;(result as Promise<boolean>).then((re) => {
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
    },
    [onChange, deleteFile, fileList]
  )

  const onProgress = useCallback(
    (file: UploadFileItem, event: ProgressEvent<EventTarget>, percent: number) => {
      const newFileList = [...fileListRef.current]
      file.progressNumber = percent
      const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
      newFileList.splice(idx, 1, file)
      fileListRef.current = newFileList
      updateFileList(fileListRef.current)
    },
    []
  )

  const onError = useCallback(
    (file: UploadFileItem, event: ProgressEvent<EventTarget>, body?: Object | undefined) => {
      const newFileList = [...fileListRef.current]
      file.uploadState = 'error'
      const idx = fileListRef.current.findIndex((item) => item.fileId === file.fileId)
      const result = onChange && onChange(file, newFileList, body as any)

      // 处理如果onChange return false 的时候需要删除该文件
      if (typeof result === 'boolean' && !result) {
        deleteFile(file, idx)
        return
      }

      newFileList.splice(idx, 1, file)

      if (fileList) {
        return false
      } else if (result && typeof (result as Promise<boolean>).then === 'function') {
        ;(result as Promise<boolean>).then((re) => {
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
    },
    [deleteFile, fileList, onChange]
  )

  const uploadFiles = useCallback(
    async (files: HTMLInputElement['files']) => {
      if (customUpload) {
        customUpload(files)
      } else {
        const _files: UploadFileItem[] = []
        if (files) {
          const items = getFileItems(files, accept)
          // 最多上传限制数量
          const length = typeof maxCount === 'number' ? maxCount : items.length

          for (let i = 0; i < length; i++) {
            const fileItem = items[i]
            if (beforeUpload) {
              const result = beforeUpload(fileItem, fileListRef.current)
              if (result === false) {
                continue
              }
            }
            if (maxSize && fileItem.size > maxSize * 1024) {
              message.open({
                type: 'error',
                title: messageText,
              })

              continue
            }
            const file: UploadFileItem = Object.assign(fileItem, {
              fileId: uuid(),
              uploadState: 'loading' as 'loading',
              fileType: getFileType(fileItem),
            })

            if (file) {
              if (file.fileType === 'img') {
                // 用来图片预览
                const fr = new FileReader()
                fr.onload = (e) => {
                  const url = (e.target?.result || '') as string
                  file.url = url
                }
                fr.readAsDataURL(file as any)
              }
              _files.push(file)
              fileListRef.current.unshift(file)
              if (uploadAction) {
                let _uploadAction =
                  typeof uploadAction === 'string' ? uploadAction : uploadAction(file as any)
                if (_uploadAction.toString() === '[object Promise]') {
                  await (_uploadAction as Promise<string>)
                    .then((res) => {
                      _uploadAction = res
                    })
                    .catch((error) => {
                      throw new Error(error)
                    })
                }
                const action = request({
                  file,
                  action: _uploadAction as string,
                  name,
                  withCredentials,
                  headers,
                  data,
                  method,
                  onSuccess,
                  onError: onError,
                  onProgress: onProgress,
                })
                file.abort = action.abort
              }
            }
          }
        }
      }
    },
    [
      customUpload,
      maxCount,
      accept,
      beforeUpload,
      maxSize,
      messageText,
      uploadAction,
      name,
      withCredentials,
      headers,
      data,
      method,
      onSuccess,
      onError,
      onProgress,
    ]
  )

  return [_fileList, uploadFiles, deleteFile]
}

export default useUpload
