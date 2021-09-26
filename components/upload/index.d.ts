import React from 'react'
export type UploadFileItem = {
  fileId?: string
  fileType: string
  name: string
  uploadState: 'success' | 'uploading' | 'error'
  url?: string
}
export interface UploadProps {
  type?: 'default' | 'drag' | 'pictureCard' | 'avatar' | 'photo'
  accept?: MimeType
  content?: string | JSX.Element,
  tips?: string | JSX.Element,
  maxSize?: number
  maxCount?: number
  uploadAction?: string
  data?: {
    [prop: string]: any
  }
  params?: {
    [prop: string]: any
  }
  name?: string
  disabled?: boolean
  headers?: object
  withCredentials?: boolean
  showUploadList?: boolean
  multiple?: boolean
  defaultFileList?: UploadFileItem[]
  fileList?: UploadFileItem[]
  loading?: boolean
  style?: React.CSSProperties
  className?: string
  beforeUpload?: (files: UploadFileItem[], fileList: UploadFileItem[]) => boolean
  customUpload?: (files: UploadFileItem[]) => void
  onChange?: (file: UploadFileItem, fileList: UploadFileItem[], response: object) => boolean
  onRemove?: (file: UploadFileItem, fileList: UploadFileItem[], index: number) => boolean
  onDownload?: (file: UploadFileItem) => void
  photoSize?: 'small' | 'default' | 'large'
}
declare const Upload: React.ComponentType<UploadProps>
export default Upload
