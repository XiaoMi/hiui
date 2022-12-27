import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './types'
import { FileSelect } from '@hi-ui/file-select'
import { Button } from '@hi-ui/button'
import useUpload from './hooks/use-upload'
import { FileList } from './FileList'
import { useLocaleContext } from '@hi-ui/core'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const PictureListUpload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      className,
      children,
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
      method,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const buttonText = i18n.get('upload.buttonText')

    const cls = cx(prefixCls, `${prefixCls}--picture-card`, className)

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
    })

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <FileSelect
          style={{ display: 'inline-block' }}
          onSelect={uploadFiles}
          multiple={multiple}
          disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
          accept={accept}
        >
          {children === undefined ? (
            <Button
              type="secondary"
              disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
              loading={loading}
            >
              {content || buttonText}
            </Button>
          ) : (
            children
          )}
        </FileSelect>
        {tips && <div className={`${prefixCls}__tips`}>{tips}</div>}
        {showUploadList && _fileList.length > 0 && (
          <FileList
            fileList={_fileList}
            onDelete={deleteFile}
            onDownload={onDownload}
            showPic
            prefixCls={prefixCls}
          />
        )}
      </div>
    )
  }
)

if (__DEV__) {
  PictureListUpload.displayName = 'PictureListUpload'
}
