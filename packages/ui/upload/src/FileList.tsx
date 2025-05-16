import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UploadFileItem, UploadFileList } from './types'
import {
  CloseOutlined,
  DeleteOutlined,
  JpgColorful,
  ExeColorful,
  PdfColorful,
  ZipColorful,
  MusicColorful,
  PptColorful,
  ExcelColorful,
  WordColorful,
  QuestionColorful,
} from '@hi-ui/icons'
import { formatFileSize } from './utils'
const UPLOAD_PREFIX = getPrefixCls('upload')
const fileTypeMap = {
  img: <JpgColorful />,
  exe: <ExeColorful />,
  audio: <MusicColorful />,
  pdf: <PdfColorful />,
  key: <WordColorful />,
  video: <MusicColorful />,
  txt: <WordColorful />,
  word: <WordColorful />,
  excel: <ExcelColorful />,
  zip: <ZipColorful />,
  ppt: <PptColorful />,
  default: <QuestionColorful />,
} as Record<string, any>

export const FileList = forwardRef<HTMLUListElement | null, UploadFileList>(
  (
    {
      prefixCls = UPLOAD_PREFIX,
      onDownload,
      onDelete,
      fileList,
      showPic,
      actionRender,
      disabled,
      size = 'md',
    },
    ref
  ) => {
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
          onDelete(file, index)
        }
      },
      [onDelete]
    )

    const renderAction = (file: UploadFileItem, index: number) => {
      // 如果 actionRender 返回 `true`，则使用默认 title
      const action = actionRender ? actionRender({ file, index }) : true

      return !disabled ? (
        action === true ? (
          <span className={`${prefixCls}__del-btn`}>
            {file.uploadState === 'loading' ? (
              <CloseOutlined onClick={() => onDelete(file, index)} />
            ) : (
              <DeleteOutlined onClick={() => onDelete(file, index)} />
            )}
          </span>
        ) : (
          action
        )
      ) : null
    }

    return (
      <ul className={`${prefixCls}__list ${prefixCls}__list--size-${size}`} ref={ref}>
        {fileList.map((file, index) => {
          const { name, fileType, uploadState, url, progressNumber, size: fileSize } = file

          return (
            <a
              key={index}
              tabIndex={-1}
              target="_blank"
              rel="noreferrer"
              href={url}
              title={name}
              style={{ textDecoration: 'none' }}
              onClick={(e) => {
                if (uploadState !== 'success') {
                  e.preventDefault()
                  return
                }

                if (onDownload) {
                  e.preventDefault()
                  onDownload(file)
                }
              }}
            >
              <li
                className={`${prefixCls}__item ${prefixCls}__item--status-${uploadState}`}
                title={name}
                tabIndex={0}
                onKeyDown={(e) => {
                  handleItemKeydown(e, file, index)
                }}
              >
                {showPic && url ? (
                  <div className={`${prefixCls}__item-img`}>
                    <img src={url} />
                  </div>
                ) : (
                  <div className={`${prefixCls}__item-icon`}>
                    {(fileType && fileTypeMap[fileType]) || fileTypeMap.default}
                  </div>
                )}
                <div className={`${prefixCls}__right-content`}>
                  <div className={`${prefixCls}__content-wrapper`}>
                    <div className={`${prefixCls}__filename`}>{name}</div>
                    {fileSize && size === 'lg' && (
                      <div className={`${prefixCls}__file-size`}>{formatFileSize(fileSize)}</div>
                    )}
                  </div>
                  {renderAction(file, index)}
                </div>
                {uploadState === 'loading' && (
                  <div className={`${prefixCls}__upstatus`}>
                    <i
                      className={`${prefixCls}__upstatus-line`}
                      style={{ width: progressNumber + '%' }}
                    />
                  </div>
                )}
              </li>
            </a>
          )
        })}
      </ul>
    )
  }
)

if (__DEV__) {
  FileList.displayName = 'FileList'
}
