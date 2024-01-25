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
    { prefixCls = UPLOAD_PREFIX, onDownload, onDelete, fileList, showPic, actionRender, disabled },
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
      <ul className={`${prefixCls}__list`} ref={ref}>
        {fileList.map((file, index) => {
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
              {showPic && file.url ? (
                <div className={`${prefixCls}__item-img`}>
                  <img src={file.url} />
                </div>
              ) : (
                <span className={`${prefixCls}__item-icon`}>
                  {(file.fileType && fileTypeMap[file.fileType]) || fileTypeMap.default}
                </span>
              )}
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
                {renderAction(file, index)}
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
    )
  }
)

if (__DEV__) {
  FileList.displayName = 'FileList'
}
