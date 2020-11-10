import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import Preview from './Preview'
import Icon from '../icon'
import FileSelect from './FileSelect'
import useUpload from './hooks/useUpload'

const PictureUpload = ({
  onRemove,
  disabled,
  accept = 'image/*',
  localeDatas,
  theme,
  fileList,
  defaultFileList,
  photoSize = 'default',
  maxCount = Infinity,
  multiple,
  onChange,
  uploadAction,
  maxSize,
  name,
  withCredentials,
  headers,
  data,
  beforeUpload,
  customUpload
}) => {
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
    photoSize,
    localeDatas
  })

  // TODO: 提取 usePreview hook
  const [visible, setVisible] = useState(false)
  const [previewFile, setPreviewFile] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)

  const closeModal = useCallback(() => {
    setPreviewFile({})
    setVisible(false)
  }, [])

  const previewImage = useCallback((file, index) => {
    setPreviewFile(file)
    setVisible(true)
    setActiveIndex(index)
  }, [])

  const images = _fileList.map((file) => {
    return {
      url: file.url
    }
  })

  const precentNum = () => {
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
  }
  return (
    <div
      className={classNames('hi-upload hi-upload--photo', `theme__${theme}`, {
        'hi-upload--disabled': disabled
      })}
    >
      <ul className="hi-upload__list">
        {_fileList.map((file, index) => {
          if (file.uploadState === 'loading') {
            return (
              <li key={index} className={classNames('hi-upload__item', `hi-upload__item--${photoSize}`)}>
                <img src={file.url} className="hi-upload__thumb" />
                <div className={`hi-upload__precent hi-upload__precent--${photoSize}`}>
                  <p className="hi-upload__loading-text">
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                        : localeDatas.upload.uploadSuccess
                      : 0 + '%'}
                  </p>
                  <div
                    className="hi-upload__loading-bar"
                    style={{ width: file.progressNumber * precentNum() + 'px' }}
                  />
                  {/* 进度条底部阴影 */}
                  <div className="hi-upload__loading-shadow" />
                </div>
              </li>
            )
          } else {
            return (
              <li
                key={index}
                className={classNames('hi-upload__item', `hi-upload__item--${photoSize}`)}
                style={{ cursor: 'pointer' }}
                onClick={() => previewImage(file, index)}
              >
                <img src={file.url} className={`hi-upload__thumb ${file.uploadState === 'error' && 'error'}`} />
                <Icon
                  filled
                  name="close-circle"
                  className="hi-upload__photo-del"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFile(file, index)
                  }}
                />
                {file.uploadState === 'error' && (
                  <div className="hi-upload__item--photo-error">{localeDatas.upload.uploadFailed}</div>
                )}
              </li>
            )
          }
        })}
        {maxCount > _fileList.length && (
          <FileSelect
            onSelect={uploadFiles}
            multiple={multiple}
            disabled={disabled}
            accept={accept}
            style={{ display: 'inline-block' }}
          >
            <li className={classNames('hi-upload__item', 'hi-upload__item--upload', `hi-upload__item--${photoSize}`)}>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <Icon name="plus" style={{ fontSize: 24 }} />
              </label>
            </li>
          </FileSelect>
        )}
      </ul>
      {visible && (
        <Preview src={previewFile.url} images={images} activeIndex={activeIndex} show={visible} onClose={closeModal} />
      )}
    </div>
  )
}

export default PictureUpload
