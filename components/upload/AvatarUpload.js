import React, { useState, useCallback, useRef } from 'react'
import Modal from '../modal'
import Preview from './Preview'
import Cropper from 'react-cropper'
import Icon from '../icon'
import FileSelect from './FileSelect'
import useUpload from './hooks/useUpload'
import 'cropperjs/dist/cropper.css'

const AvatarUpload = ({
  onRemove,
  disabled,
  accept,
  localeDatas,
  theme,
  fileList,
  defaultFileList,
  multiple,
  avatarOptions = {},
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
  const { aspectRatio = 0, dragMode = 'move', dropBoxSize = [] } = avatarOptions
  const cropperRef = useRef(null)
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
    customUpload
  })
  const [cropperFile, setCropperFile] = useState({})

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

  const [cropperVisible, setCropperVisible] = useState(false)

  const selectFile = useCallback((files) => {
    takeCropper(files[0])
  }, [])

  const takeCropper = useCallback((file) => {
    const fr = new window.FileReader()

    fr.onload = (e) => {
      file.url = e.target.result
      setCropperVisible(true)
      setCropperFile(file)
    }
    fr.readAsDataURL(file)
  }, [])

  const base2blob = useCallback((dataurl, filename) => {
    let arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = window.atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new window.File([u8arr], filename, {
      type: mime
    })
  }, [])

  const confirmCropper = useCallback(
    (filename) => {
      // 裁切图片
      if (cropperRef.current) {
        const canvas = cropperRef.current.getCroppedCanvas()
        if (typeof canvas === 'undefined') {
          return
        }
        const dataUrl = canvas.toDataURL()
        const file = base2blob(dataUrl, filename)
        file.url = dataUrl
        file.fileType = 'img'
        uploadFiles([file])
        setCropperVisible(false)
      }
    },
    [cropperRef.current]
  )

  const images = _fileList.map((file) => {
    return {
      url: file && file.url
    }
  })

  const file = _fileList[0]
  return (
    <div className={`theme__${theme} hi-upload hi-upload--avatar`}>
      <ul className='hi-upload__list'>
        {!!file &&
          (file.uploadState === 'loading' ? (
            <li className='hi-upload__item'>
              <img src={file.url} className='hi-upload__thumb' />
              <div className='hi-upload__precent'>
                <p className='hi-upload__loading-text'>
                  {file.progressNumber
                    ? file.progressNumber < 100
                      ? file.progressNumber && file.progressNumber.toFixed(2) + '%'
                      : localeDatas.upload.uploadSuccess
                    : 0 + '%'}
                </p>
                <div className='hi-upload__loading-bar' style={{ width: file.progressNumber * 1.4 + 'px' }} />
              </div>
            </li>
          ) : (
            <li className='hi-upload__item'>
              <img src={file.url} className={`hi-upload__thumb ${file.uploadState === 'error' && 'error'}`} />
              <div className='hi-upload__item-mask' onClick={() => previewImage(file, 0)}>
                <Icon name='eye' />
                <span>{localeDatas.upload.preview}</span>
              </div>
              <Icon name='close-circle' className='hi-upload__photo-del' onClick={() => deleteFile(file, 0)} />
            </li>
          ))}
        {!file && (
          <FileSelect
            onSelect={selectFile}
            multiple={multiple}
            disabled={disabled}
            accept={accept}
            style={{ display: 'inline-block' }}
          >
            <li className='hi-upload__item hi-upload__item--upload'>
              <Icon name='plus' style={{ fontSize: 24 }} />
            </li>
          </FileSelect>
        )}
      </ul>
      <Modal
        visible={cropperVisible}
        onConfirm={() => {
          confirmCropper(_fileList[0].name)
        }}
        onCancel={() => {
          setCropperVisible(false)
        }}
        backDrop={false}
      >
        <Cropper
          src={cropperFile.url || ''}
          ready={(e) => {
            if (dropBoxSize.length > 0) {
              cropperRef.current.setCropBoxData({
                width: dropBoxSize[0],
                height: dropBoxSize[1] || dropBoxSize[0]
              })
            }
          }}
          aspectRatio={aspectRatio}
          guides={false}
          dragMode={dragMode}
          ref={cropperRef}
          crop={() => {}}
          style={{ height: 400, width: '100%' }}
        />
      </Modal>
      {visible && (
        <Preview src={previewFile.url} images={images} activeIndex={activeIndex} show={visible} onClose={closeModal} />
      )}
    </div>
  )
}

export default AvatarUpload
