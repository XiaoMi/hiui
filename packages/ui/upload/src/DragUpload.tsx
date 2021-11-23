import React, { forwardRef, useContext, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadFileItem, UploadProps } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import useUpload from './hooks/use-upload'
import { LocaleContext } from '@hi-ui/locale-context'
import { CloseOutlined, DeleteOutlined, FileFilled, CloudUploadOutlined } from '@hi-ui/icons'
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
      onChange,
      beforeUpload,
      customUpload,
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
        if (!disabled) {
          uploadFiles(e.dataTransfer.files)
        }
        setDragging(false)
      },
      [disabled, uploadFiles]
    )
    const dragCls = cx(
      `${prefixCls}`,
      `${prefixCls}--drag`,
      dragging && !disabled && 'drop-over',
      disabled && `${prefixCls}--disabled`,
      _fileList.length > 0 && `${prefixCls}--nohover`
    )

    const handleItemKeydown = useCallback(
      (e: React.KeyboardEvent<HTMLLIElement>, file: UploadFileItem, index: number) => {
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          const ele = e.target as HTMLLIElement
          ele.querySelector('a')?.click()
        }
        // DEL
        if (e.keyCode === 46) {
          e.preventDefault()
          deleteFile(file, index)
        }
      },
      [deleteFile]
    )

    const handleContainerKeyDown = useCallback((e) => {
      // ENTER OR SPACE
      if (e.keyCode === 32 || e.keyCode === 13) {
        e.preventDefault()
        ;(dragRef.current?.parentNode as HTMLElement)?.click()
      }
    }, [])

    return (
      <div ref={ref} role={role} className={cls}>
        <FileSelect
          onSelect={uploadFiles}
          multiple={multiple}
          disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
          accept={accept}
        >
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
              <CloudUploadOutlined />
              <span>{content || upload.drag}</span>
              {tips && (
                <span className={`${prefixCls}__tips ${prefixCls}__tips--single-line`}>{tips}</span>
              )}
            </div>
          </div>
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
