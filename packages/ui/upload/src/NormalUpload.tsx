import React, { forwardRef, useContext, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadFileItem, UploadProps } from './interface'
import { FileSelect } from '@hi-ui/file-select'
import { Button } from '@hi-ui/button'
import useUpload from './hooks/use-upload'
import { LocaleContext } from '@hi-ui/locale-context'
import { CloseOutlined, DeleteOutlined, FileFilled } from '@hi-ui/icons'

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
          <ul className={`${prefixCls}__list`}>
            {_fileList.map((file, index) => {
              return (
                <li
                  key={index}
                  className={`${prefixCls}__item`}
                  title={file.name}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    handleItemKeydown(e, file, index)
                  }}
                >
                  <FileFilled />
                  <div className={`${prefixCls}__right-content`}>
                    <a
                      tabIndex={-1}
                      target="_blank"
                      rel="noreferrer"
                      href={file.url}
                      className={cx(
                        `${prefixCls}__filename`,
                        file.uploadState === 'error' && `${prefixCls}__filename--error`
                      )}
                      title={file.name}
                      onClick={(e) => {
                        if (onDownload) {
                          e.preventDefault()
                          onDownload(file)
                        }
                      }}
                    >
                      {file.name}
                    </a>
                    <span>
                      {file.uploadState === 'loading' ? (
                        <CloseOutlined onClick={() => deleteFile(file, index)} />
                      ) : (
                        <DeleteOutlined onClick={() => deleteFile(file, index)} />
                      )}
                    </span>
                  </div>
                  {file.uploadState === 'loading' && (
                    <div className={`${prefixCls}__upstatus`}>
                      <i
                        className={`${prefixCls}__upstatus-line`}
                        style={{ width: file.progressNumber + '%' }}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }
)

if (__DEV__) {
  NormalUpload.displayName = 'NormalUpload'
}
