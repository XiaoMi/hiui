import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import type {
  UploadProps,
  UploadSemanticClassNamesResolved,
  UploadSemanticStylesResolved,
} from './types'
import { FileSelect } from '@hi-ui/file-select'
import { Button } from '@hi-ui/button'
import useUpload from './hooks/use-upload'
import { FileList } from './FileList'
import { useLocaleContext } from '@hi-ui/core'

const UPLOAD_PREFIX = getPrefixCls('upload')

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
      timeout,
      actionRender,
      classNames,
      styles,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const buttonText = i18n.get('upload.buttonText')

    const cls = cx(prefixCls, `${prefixCls}--picture-card`, className)
    const cn: UploadSemanticClassNamesResolved | undefined = classNames as
      | UploadSemanticClassNamesResolved
      | undefined
    const st: UploadSemanticStylesResolved | undefined = styles as
      | UploadSemanticStylesResolved
      | undefined

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
      timeout,
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
              appearance="line"
              disabled={disabled || (!!maxCount && _fileList.length >= maxCount)}
              loading={loading}
              className={cn?.pictureListUploadTrigger}
              style={st?.pictureListUploadTrigger}
            >
              {content || buttonText}
            </Button>
          ) : (
            children
          )}
        </FileSelect>
        {tips && (
          <div
            className={cx(`${prefixCls}__tips`, cn?.pictureListUploadTips)}
            style={st?.pictureListUploadTips}
          >
            {tips}
          </div>
        )}
        {showUploadList && _fileList.length > 0 && (
          <FileList
            fileList={_fileList}
            onDelete={deleteFile}
            onDownload={onDownload}
            showPic
            prefixCls={prefixCls}
            disabled={disabled}
            actionRender={actionRender}
            className={cn?.pictureListUploadList}
            style={st?.pictureListUploadList}
          />
        )}
      </div>
    )
  }
)

if (__DEV__) {
  PictureListUpload.displayName = 'PictureListUpload'
}
