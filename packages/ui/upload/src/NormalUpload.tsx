import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './types'
import { FileSelect } from '@hi-ui/file-select'
import { Button } from '@hi-ui/button'
import { UploadOutlined } from '@hi-ui/icons'
import useUpload from './hooks/use-upload'
import { useLocaleContext } from '@hi-ui/core'
import { FileList } from './FileList'

const UPLOAD_PREFIX = getPrefixCls('upload')

/**
 * TODO: What is Upload
 */
export const NormalUpload = forwardRef<HTMLDivElement | null, UploadProps>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      role = 'upload',
      className,
      children,
      maxCount,
      icon,
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
      actionRender,
      method,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const buttonText = i18n.get('upload.buttonText')

    const cls = cx(prefixCls, className)

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
              icon={icon ?? <UploadOutlined />}
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
            prefixCls={prefixCls}
            actionRender={actionRender}
          />
        )}
      </div>
    )
  }
)

if (__DEV__) {
  NormalUpload.displayName = 'NormalUpload'
}
