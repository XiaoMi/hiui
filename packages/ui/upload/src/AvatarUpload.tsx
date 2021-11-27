import React, { forwardRef, useContext, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import { PlusOutlined, CloseCircleFilled } from '@hi-ui/icons'
import useUpload from './hooks/use-upload'
import { LocaleContext } from '@hi-ui/locale-context'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const AvatarUpload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      className,
      maxCount,
      disabled,
      multiple,
      onRemove,
      accept,
      fileList,
      defaultFileList,
      maxSize,
      uploadAction,
      name,
      withCredentials,
      headers,
      data,
      onChange,
      beforeUpload,
      customUpload,
      photoSize = 'default',
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const { upload } = useContext(LocaleContext)
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
    })

    const { aspectRatio = 0, dragMode = 'move', dropBoxSize = [] } = avatarOptions
    const cropperRef = useRef(null)

    const uploadRef = useRef<HTMLLIElement>(null)

    // TODO: 提取 usePreview hook
    const [visible, setVisible] = useState(false)
    const [previewFile, setPreviewFile] = useState({})
    const [activeIndex, setActiveIndex] = useState(0)
    const [cropperFile, setCropperFile] = useState({})

    const closeModal = useCallback(() => {
      setPreviewFile({})
      setVisible(false)
    }, [])

    const previewImage = useCallback((file, index) => {
      setPreviewFile(file)
      setVisible(true)
      setActiveIndex(index)
    }, [])
    const [cropperVisible, setCropperVisible] = useState(false)

    const selectFile = useCallback((files) => {
      takeCropper(files[0])
    }, [])

    const takeCropper = useCallback((file) => {
      const fr = new window.FileReader()

      fr.onload = (e) => {
        file.url = e.target.result
        setCropperVisible(true)
        setCropperFile(file)
      }
      fr.readAsDataURL(file)
    }, [])

    const base2blob = useCallback((dataurl, filename) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = window.atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new window.File([u8arr], filename, {
        type: mime,
      })
    }, [])

    const confirmCropper = useCallback(
      (filename) => {
        // 裁切图片
        if (cropperRef.current) {
          const canvas = cropperRef.current.getCroppedCanvas()
          if (typeof canvas === 'undefined') {
            return
          }
          const dataUrl = canvas.toDataURL()
          const file = base2blob(dataUrl, filename)
          file.url = dataUrl
          file.fileType = 'img'
          uploadFiles([file])
          setCropperVisible(false)
        }
      },
      [cropperRef.current]
    )

    const images = _fileList.map((file) => {
      return {
        url: file && file.url,
      }
    })

    const handleItemKeydown = useCallback(
      (e, file, index) => {
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          previewImage(file, index)
        }
        // DEL
        if (e.keyCode === 46) {
          e.preventDefault()
          deleteFile(file, index)
        }
      },
      [deleteFile, previewImage]
    )

    const handleUploadKeydown = useCallback(
      (e) => {
        // ENTER OR SPACE
        if (e.keyCode === 32 || e.keyCode === 13) {
          e.preventDefault()
          ;(uploadRef.current?.parentNode as HTMLElement).click()
        }
      },

      []
    )
    const file = _fileList[0]
    return (
      <div ref={ref} role={role} className={cls}>
        <ul className="hi-upload__list">
          {!!file &&
            (file.uploadState === 'loading' ? (
              <li className="hi-upload__item">
                <img src={file.url} className="hi-upload__thumb" />
                <div className="hi-upload__precent">
                  <p className="hi-upload__loading-text">
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                        : upload.uploadSuccess
                      : 0 + '%'}
                  </p>
                  <div
                    className="hi-upload__loading-bar"
                    style={{ width: file.progressNumber * 1.4 + 'px' }}
                  />
                </div>
              </li>
            ) : (
              <li
                className="hi-upload__item"
                tabIndex={0}
                onClick={() => previewImage(file, 0)}
                onKeyDown={(e) => {
                  handleItemKeydown(e, file, 0)
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={file.url}
                  className={`hi-upload__thumb ${file.uploadState === 'error' && 'error'}`}
                />
                <CloseCircleFilled
                  className="hi-upload__photo-del"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(file, 0)
                  }}
                />

                {file.uploadState === 'error' && (
                  <div className="hi-upload__item--photo-error">{upload.uploadFailed}</div>
                )}
              </li>
            ))}
          {!file && (
            <FileSelect
              onSelect={selectFile}
              multiple={multiple}
              disabled={disabled}
              accept={accept}
              style={{ display: 'inline-block' }}
            >
              <li
                className="hi-upload__item hi-upload__item--upload"
                ref={uploadRef}
                tabIndex={0}
                onKeyDown={handleUploadKeydown}
              >
                <PlusOutlined />
              </li>
            </FileSelect>
          )}
        </ul>
      </div>
    )
  }
)

if (__DEV__) {
  AvatarUpload.displayName = 'AvatarUpload'
}
