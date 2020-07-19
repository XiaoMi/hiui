import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import Preview from './Preview'
import Icon from '../icon'
import FileSelect from './FileSelect'
import useUpload from './hooks/useUpload'

const PictureUpload = ({
  onRemove,
  disabled,
  accept,
  localeDatas,
  theme,
  fileList,
  defaultFileList,
  photoSize = 'default',
  maxCount,
  multiple,
  onChange,
  uploadAction,
  maxSize,
  name,
  withCredentials,
  headers,
  data
}) => {
  const [_fileList, uploadFiles] = useUpload({
    fileList,
    defaultFileList,
    onChange,
    uploadAction,
    maxSize,
    name,
    withCredentials,
    headers,
    data
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
  return (
    <div
      className={classNames('hi-upload hi-upload--photo', `theme__${theme}`, {
        'hi-upload--disabled': disabled
      })}
    >
      <ul className='hi-upload__list'>
        {_fileList.map((file, index) => {
          if (file.uploadState === 'loading') {
            return (
              <li key={index} className={classNames('hi-upload__item', `hi-upload__item--${photoSize}`)}>
                <img src={file.url} className='hi-upload__thumb' />
                <div className='hi-upload__precent'>
                  <p className='hi-upload__loading-text'>
                    {file.progressNumber
                      ? file.progressNumber < 100
                        ? file.progressNumber + '%'
                        : localeDatas.upload.uploadSuccess
                      : 0 + '%'}
                  </p>
                  <div className='hi-upload__loading-bar' style={{ width: file.progressNumber * 1.4 + 'px' }} />
                  {/* 进度条底部阴影 */}
                  <div className='hi-upload__loading-shadow' />
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
                {onRemove && (
                  <Icon
                    name='close-circle'
                    className='hi-upload__photo-del'
                    onClick={(e) => {
                      e.stopPropagation()
                      this.deleteFile(file, index)
                    }}
                  />
                )}
                {file.uploadState === 'error' && (
                  <div className='hi-upload__item--photo-error'>{localeDatas.upload.uploadFailed}</div>
                )}
              </li>
            )
          }
        })}
        {maxCount < _fileList.length && (
          <FileSelect onSelect={uploadFiles} multiple={multiple} disabled={disabled} accept={accept}>
            <li className={classNames('hi-upload__item', 'hi-upload__item--upload', `hi-upload__item--${photoSize}`)}>
              <label style={{ display: 'block' }}>
                <Icon name='plus' />
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
