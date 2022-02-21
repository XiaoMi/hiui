import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import { PlusOutlined, DeleteOutlined, EyeOutlined, SadFilled } from '@hi-ui/icons'
import useUpload from './hooks/use-upload'
import { useLocaleContext } from '@hi-ui/locale-context'
import { Preview } from '@hi-ui/preview'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const PictureUpload = forwardRef<HTMLDivElement | null, UploadProps>(
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
    const i18n = useLocaleContext()

    const uploadSuccessText = i18n.get('upload.uploadSuccess')

    const cls = cx(prefixCls, `${prefixCls}--photo`, className)

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

    const uploadRef = useRef<HTMLLIElement>(null)

    // TODO: 提取 usePreview hook
    const [visible, setVisible] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const closeModal = useCallback(() => {
      setVisible(false)
    }, [])

    const previewImage = useCallback((index) => {
      setVisible(true)
      setActiveIndex(index)
    }, [])

    const images = useMemo(() => {
      return _fileList.map((file) => {
        return file.url || ''
      })
    }, [_fileList])

    const precentNum = useMemo(() => {
      let num = 1.4
      switch (photoSize) {
        case 'small':
          num = 0.8
          break
        case 'large':
          num = 2
          break
        default:
          num = 1.4
          break
      }
      return num
    }, [photoSize])

    const handleItemKeydown = useCallback(
      (e, file, index) => {
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          previewImage(index)
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

    return (
      <div ref={ref} role={role} className={cls}>
        <ul className={`${prefixCls}__list`}>
          {_fileList.map((file, index) => {
            if (file.uploadState === 'loading') {
              return (
                <li
                  key={index}
                  className={cx(`${prefixCls}__item`, `${prefixCls}__item--${photoSize}`)}
                  tabIndex={0}
                >
                  <img src={file.url} className={`${prefixCls}__thumb`} />
                  <div className={`${prefixCls}__precent ${prefixCls}__precent--${photoSize}`}>
                    <p className={`${prefixCls}__loading-text`}>
                      {file.progressNumber
                        ? file.progressNumber < 100
                          ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                          : uploadSuccessText
                        : 0 + '%'}
                    </p>
                    <div
                      className={`${prefixCls}__loading-bar`}
                      style={{
                        width: file.progressNumber ? file.progressNumber * precentNum + 'px' : '',
                      }}
                    />
                    {/* 进度条底部阴影 */}
                    <div className={`${prefixCls}__loading-shadow`} />
                  </div>
                </li>
              )
            } else {
              return (
                <li
                  tabIndex={0}
                  key={index}
                  className={cx(`${prefixCls}__item`, `${prefixCls}__item--${photoSize}`, {
                    [`${prefixCls}__item--error`]: file.uploadState === 'error',
                  })}
                  onKeyDown={(e) => handleItemKeydown(e, file, index)}
                >
                  <img src={file.url} className={`${prefixCls}__thumb`} />
                  {file.uploadState !== 'error' ? (
                    <div className={`${prefixCls}__mask`}>
                      <div className={`${prefixCls}__action-group`}>
                        <EyeOutlined
                          onClick={() => {
                            previewImage(index)
                          }}
                        />
                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFile(file, index)
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`${prefixCls}__precent`}>
                      <SadFilled className={`${prefixCls}__error-icon`} />
                      <div className={`${prefixCls}__action-group`}>
                        <EyeOutlined
                          onClick={() => {
                            previewImage(index)
                          }}
                        />
                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFile(file, index)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </li>
              )
            }
          })}
          {(maxCount === undefined || maxCount > _fileList.length) && (
            <FileSelect
              onSelect={uploadFiles}
              multiple={multiple}
              disabled={disabled}
              accept={accept}
              style={{ display: 'inline-block' }}
            >
              <li
                className={cx(
                  `${prefixCls}__item`,
                  `${prefixCls}__item--upload`,
                  `${prefixCls}__item--${photoSize}`
                )}
                tabIndex={0}
                onKeyDown={handleUploadKeydown}
                ref={uploadRef}
              >
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <PlusOutlined />
                </label>
              </li>
            </FileSelect>
          )}
        </ul>
        <Preview
          visible={visible}
          onClose={closeModal}
          src={images}
          current={activeIndex}
          onPreviewChange={setActiveIndex}
        />
      </div>
    )
  }
)

if (__DEV__) {
  PictureUpload.displayName = 'PictureUpload'
}
