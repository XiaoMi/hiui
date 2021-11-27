import React, { forwardRef, useContext, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps, UploadFileItem } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import { PlusOutlined, CloseCircleFilled } from '@hi-ui/icons'
import useUpload from './hooks/use-upload'
import { LocaleContext } from '@hi-ui/locale-context'
import { Preview } from '@hi-ui/preview'
import { Modal } from '@hi-ui/modal'
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
      photoSize = 'small',
      avatarOptions = {},
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--avatar`, className)
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

    const { aspectRatio = 0, dragMode = 'move' } = avatarOptions
    const cropperRef = useRef<HTMLImageElement>(null)

    const uploadRef = useRef<HTMLLIElement>(null)

    // TODO: 提取 usePreview hook
    const [visible, setVisible] = useState(false)
    const [previewFile, setPreviewFile] = useState<string>('')
    const [cropperFile, setCropperFile] = useState<UploadFileItem | null>(null)

    const closeModal = useCallback(() => {
      setPreviewFile('')
      setVisible(false)
    }, [])

    const previewImage = useCallback((url: string) => {
      setPreviewFile(url)
      setVisible(true)
    }, [])

    const [cropperVisible, setCropperVisible] = useState(false)

    const takeCropper = useCallback((file: UploadFileItem) => {
      const fr = new window.FileReader()

      fr.onload = (e) => {
        file.url = (e.target?.result || '') as string
        setCropperVisible(true)
        setCropperFile(file)
      }
      fr.readAsDataURL(file)
    }, [])

    const selectFile = useCallback(
      (files: FileList | null) => {
        if (files) {
          takeCropper(files[0])
        }
      },
      [takeCropper]
    )

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
      (filename: string) => {
        // 裁切图片
        if (cropperRef.current) {
          const canvas = (cropperRef.current as any)?.cropper?.getCroppedCanvas()
          if (typeof canvas === 'undefined') {
            return
          }
          const dataUrl = canvas.toDataURL()
          const file: UploadFileItem = base2blob(dataUrl, filename)
          file.url = dataUrl
          file.fileType = 'img'
          uploadFiles([file])
          setCropperVisible(false)
        }
      },
      [uploadFiles, base2blob]
    )

    const handleItemKeydown = useCallback(
      (e, file, index) => {
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          previewImage(file.url)
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
        <ul className={`${prefixCls}__list`}>
          {!!file &&
            (file.uploadState === 'loading' ? (
              <li className={`${prefixCls}__item`}>
                <img src={file.url} className={`${prefixCls}__thumb`} />
                <div className={`${prefixCls}__precent`}>
                  <p className={`${prefixCls}__loading-text`}>
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                        : upload.uploadSuccess
                      : 0 + '%'}
                  </p>
                  <div
                    className={`${prefixCls}__loading-bar`}
                    style={{ width: file.progressNumber ? file.progressNumber * 1.4 + 'px' : '' }}
                  />
                </div>
              </li>
            ) : (
              <li
                className={`${prefixCls}__item`}
                tabIndex={0}
                onClick={() => previewImage(file.url || '')}
                onKeyDown={(e) => {
                  handleItemKeydown(e, file, 0)
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={file.url}
                  className={`${prefixCls}__thumb ${file.uploadState === 'error' && 'error'}`}
                />
                <CloseCircleFilled
                  className={`${prefixCls}__photo-del`}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(file, 0)
                  }}
                />

                {file.uploadState === 'error' && (
                  <div className={`${prefixCls}__item--photo-error`}>{upload.uploadFailed}</div>
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
                className={`${prefixCls}__item ${prefixCls}__item--upload`}
                ref={uploadRef}
                tabIndex={0}
                onKeyDown={handleUploadKeydown}
              >
                <PlusOutlined />
              </li>
            </FileSelect>
          )}
        </ul>
        <Preview visible={visible} onClose={closeModal} src={previewFile} />
        <Modal
          visible={cropperVisible}
          onConfirm={() => {
            if (cropperFile) {
              confirmCropper(cropperFile.name)
            }
          }}
          onClose={() => {
            setCropperVisible(false)
          }}
          backDrop={false}
        >
          <Cropper
            src={cropperFile?.url || ''}
            aspectRatio={aspectRatio}
            guides={false}
            dragMode={dragMode}
            ref={cropperRef}
            style={{ height: 400, width: '100%' }}
          />
        </Modal>
      </div>
    )
  }
)

if (__DEV__) {
  AvatarUpload.displayName = 'AvatarUpload'
}
