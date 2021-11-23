import React, { forwardRef, useContext } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadProps } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import { Button } from '@hi-ui/button'
import useUpload from './hooks/use-upload'
import { FileList } from './FileList'
import { LocaleContext } from '@hi-ui/locale-context'

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
    const cls = cx(prefixCls, `${prefixCls}--picture-card`, className)
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

    return (
      <div ref={ref} role={role} className={cls}>
        <FileSelect
          style={{ display: 'inline-block' }}
          onSelect={uploadFiles}
          multiple={multiple}
          disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
          accept={accept}
        >
          <Button
            type="primary"
            disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
            loading={loading}
          >
            {content || upload.buttonText}
          </Button>
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
