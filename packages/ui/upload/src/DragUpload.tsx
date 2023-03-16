import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './types'
import { FileSelect } from '@hi-ui/file-select'
import useUpload from './hooks/use-upload'
import { useLocaleContext } from '@hi-ui/core'
import { CloudUploadOutlined } from '@hi-ui/icons'
import { FileList } from './FileList'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const DragUpload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      className,
      children,
      maxCount,
      content,
      disabled = false,
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
      onChange,
      beforeUpload,
      customUpload,
      method,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const dragText = i18n.get('upload.drag')

    const cls = cx(prefixCls, className)

    const [_fileList, uploadFiles, deleteFile] = useUpload({
      fileList,
      defaultFileList,
      onChange,
      uploadAction,
      maxSize,
      maxCount,
      name,
      withCredentials,
      headers,
      data,
      onRemove,
      beforeUpload,
      customUpload,
      method,
      accept,
    })

    const nonInteractive = disabled || (!!maxCount && _fileList.length >= maxCount)

    const dragRef = useRef<HTMLDivElement>(null)
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

    const onDrop = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!nonInteractive) {
          uploadFiles(e.dataTransfer.files)
        }
        setDragging(false)
      },
      [nonInteractive, uploadFiles]
    )
    const dragCls = cx(
      `${prefixCls}`,
      `${prefixCls}--drag`,
      dragging && !nonInteractive && 'drop-over',
      nonInteractive && `${prefixCls}--disabled`,
      _fileList.length > 0 && `${prefixCls}--nohover`
    )

    const handleContainerKeyDown = useCallback((e) => {
      // ENTER OR SPACE
      if (e.keyCode === 32 || e.keyCode === 13) {
        e.preventDefault()
        ;(dragRef.current?.parentNode as HTMLElement)?.click()
      }
    }, [])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <FileSelect
          onSelect={uploadFiles}
          multiple={multiple}
          disabled={nonInteractive}
          accept={accept}
        >
          {children === undefined ? (
            <div
              className={dragCls}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              tabIndex={0}
              ref={dragRef}
              onKeyDown={handleContainerKeyDown}
            >
              <div className={'drag-upload__desc'}>
                <span className={'drag-upload__title'}>
                  <CloudUploadOutlined />
                  {content || dragText}
                </span>
                {tips && (
                  <span className={`${prefixCls}__tips ${prefixCls}__tips--single-line`}>
                    {tips}
                  </span>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </FileSelect>
        {showUploadList && _fileList.length > 0 && (
          <FileList
            fileList={_fileList}
            onDelete={deleteFile}
            onDownload={onDownload}
            prefixCls={prefixCls}
          />
        )}
      </div>
    )
  }
)

if (__DEV__) {
  DragUpload.displayName = 'DragUpload'
}
