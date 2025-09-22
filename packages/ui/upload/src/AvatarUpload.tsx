import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps, UploadFileItem } from './types'
import { FileSelect } from '@hi-ui/file-select'
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  InfoCircleFilled,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateRightOutlined,
  ResetOutlined,
} from '@hi-ui/icons'
import useUpload from './hooks/use-upload'
import { useLocaleContext } from '@hi-ui/core'
import { Preview } from '@hi-ui/preview'
import { Modal } from '@hi-ui/modal'
import Cropper from 'react-cropper'
import { getImageTypeByFilename } from './utils'

const UPLOAD_PREFIX = getPrefixCls('upload')

export const AvatarUpload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      className,
      children,
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
      avatarOptions = {},
      preview,
      method,
      content,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const uploadSuccessText = i18n.get('upload.uploadSuccess')

    const cls = cx(
      prefixCls,
      `${prefixCls}--avatar`,
      disabled && `${prefixCls}--disabled`,
      className
    )

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
      method,
      disabled,
    })

    const {
      aspectRatio = 0,
      dragMode = 'move',
      rotatable = true,
      ...restAvatarOptions
    } = avatarOptions
    const cropperRef = useRef<HTMLImageElement>(null)

    const uploadRef = useRef<HTMLLIElement>(null)

    // TODO: 提取 usePreview hook
    const [visible, setVisible] = useState(false)
    const [previewFile, setPreviewFile] = useState<string>('')
    const [cropperFile, setCropperFile] = useState<UploadFileItem | null>(null)
    const [zoomLevel, setZoomLevel] = useState(1)

    const closeModal = useCallback(() => {
      setPreviewFile('')
      setVisible(false)
    }, [])

    const cropperInstance = useCallback(() => (cropperRef.current as any)?.cropper, [])

    const updateZoomLevel = useCallback(() => {
      const imageData = cropperInstance()?.getImageData()
      if (imageData) {
        setZoomLevel(imageData.width / imageData.naturalWidth)
      }
    }, [cropperInstance])

    const onCropperReady = useCallback(() => {
      updateZoomLevel()
    }, [updateZoomLevel])

    const onCropperZoom = useCallback(() => {
      updateZoomLevel()
    }, [updateZoomLevel])

    const zoomIn = useCallback(() => {
      cropperInstance()?.zoom(0.1)
    }, [cropperInstance])

    const zoomOut = useCallback(() => {
      cropperInstance()?.zoom(-0.1)
    }, [cropperInstance])

    const rotate = useCallback(() => {
      cropperInstance()?.rotate(90)
    }, [cropperInstance])

    const reset = useCallback(() => {
      cropperInstance()?.reset()
    }, [cropperInstance])

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
      fr.readAsDataURL(file as any)
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
          const dataUrl = canvas.toDataURL(getImageTypeByFilename(filename))
          const file: UploadFileItem = base2blob(dataUrl, filename)
          file.url = dataUrl
          file.fileType = 'img'
          uploadFiles([file] as any).catch(console.error)
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
      <div ref={ref} role={role} className={cls} {...rest}>
        <ul className={`${prefixCls}__list ${prefixCls}__list--size-${size}`}>
          {!!file &&
            (file.uploadState === 'loading' ? (
              <li className={`${prefixCls}__item`}>
                <img src={file.url} className={`${prefixCls}__thumb`} />
                <div className={`${prefixCls}__percent`}>
                  <p className={`${prefixCls}__loading-text`}>
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                        : uploadSuccessText
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
                className={cx(`${prefixCls}__item`, {
                  [`${prefixCls}__item--error`]: file.uploadState === 'error',
                })}
                tabIndex={0}
                onClick={() => previewImage(file.url || '')}
                onKeyDown={(e) => {
                  handleItemKeydown(e, file, 0)
                }}
              >
                <img src={file.url} className={`${prefixCls}__thumb`} />
                {!disabled ? (
                  file.uploadState !== 'error' ? (
                    <div className={`${prefixCls}__mask`}>
                      <div className={`${prefixCls}__action-group`}>
                        <span className={`${prefixCls}__action-btn`}>
                          <SearchOutlined
                            onClick={() => {
                              previewImage(file.url || '')
                            }}
                          />
                        </span>
                        <span className={`${prefixCls}__action-btn`}>
                          <DeleteOutlined
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteFile(file, 0)
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`${prefixCls}__percent`}>
                      <span className={`${prefixCls}__error-btn`}>
                        <InfoCircleFilled />
                      </span>
                      <span
                        className={cx(`${prefixCls}__delete-btn`)}
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file, 0)
                        }}
                      >
                        <DeleteOutlined />
                      </span>
                    </div>
                  )
                ) : null}
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
              {children === undefined ? (
                <li
                  className={cx(`${prefixCls}__item`, `${prefixCls}__item--upload`)}
                  ref={uploadRef}
                  tabIndex={0}
                  onKeyDown={handleUploadKeydown}
                >
                  <PlusOutlined />
                  <div className={`${prefixCls}__item__upload-text`}>{content}</div>
                </li>
              ) : (
                children
              )}
            </FileSelect>
          )}
        </ul>
        <Preview {...preview} visible={visible} onClose={closeModal} src={previewFile} />
        <Modal
          visible={cropperVisible}
          onConfirm={() => {
            if (cropperFile) {
              confirmCropper(cropperFile.name as any)
            }
          }}
          onCancel={() => {
            setCropperVisible(false)
          }}
        >
          <div style={{ position: 'relative' }}>
            <Cropper
              src={cropperFile?.url || ''}
              aspectRatio={aspectRatio}
              guides={false}
              dragMode={dragMode}
              ref={cropperRef}
              style={{ height: 400, width: '100%' }}
              ready={onCropperReady}
              zoom={onCropperZoom}
              rotatable={rotatable}
              {...restAvatarOptions}
            />
            <div
              className={`${prefixCls}-cropper__toolbar`}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: 'white',
                fontSize: 18,
              }}
            >
              <span onClick={zoomOut} style={{ cursor: 'pointer', lineHeight: 1 }}>
                <ZoomOutOutlined />
              </span>
              <span style={{ minWidth: 42, textAlign: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <span onClick={zoomIn} style={{ cursor: 'pointer', lineHeight: 1 }}>
                <ZoomInOutlined />
              </span>
              <span
                style={{
                  width: '1px',
                  height: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              />
              <span onClick={rotate} style={{ cursor: 'pointer', lineHeight: 1 }}>
                <RotateRightOutlined />
              </span>
              <span onClick={reset} style={{ cursor: 'pointer', lineHeight: 1 }}>
                <ResetOutlined />
              </span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
)

if (__DEV__) {
  AvatarUpload.displayName = 'AvatarUpload'
}
