import React from 'react'

export interface UploadFileItem extends File {
  fileId?: string
  fileType?: string
  uploadState?: 'success' | 'loading' | 'error'
  url?: string
  abort?: () => void
  progressNumber?: number
}

export interface UploadFileList {
  prefixCls?: string
  fileList: UploadFileItem[]
  onDelete: (file: UploadFileItem, index: any) => void
  onDownload: UploadProps['onDownload']
  showPic?: boolean
}

export interface UploadRequestOption {
  onProgress: (file: UploadFileItem, event: ProgressEvent<EventTarget>, percent: number) => void
  onError: (file: UploadFileItem, event: ProgressEvent<EventTarget>, body?: Object) => void
  onSuccess: (file: UploadFileItem, body: Object) => void
  data?: Record<string, any>
  name: string
  file: UploadFileItem
  withCredentials?: boolean
  action: string
  headers?: Record<string, string>
  timeout?: number
}

export interface UploadProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  type?: 'default' | 'drag' | 'pictureCard' | 'avatar' | 'photo'
  accept?: MimeType
  content?: React.ReactNode
  tips?: React.ReactNode
  maxSize?: number
  maxCount?: number
  uploadAction?: string | ((file: File) => Promise<string>)
  data?: UploadRequestOption['data']
  name?: UploadRequestOption['name']
  disabled?: boolean
  headers?: UploadRequestOption['headers']
  withCredentials?: UploadRequestOption['withCredentials']
  showUploadList?: boolean
  multiple?: boolean
  defaultFileList?: UploadFileItem[]
  fileList?: UploadFileItem[]
  loading?: boolean
  style?: React.CSSProperties
  className?: string
  beforeUpload?: (file: UploadFileItem, fileList: UploadFileItem[]) => boolean
  customUpload?: (files: HTMLInputElement['files']) => void
  onChange?: (
    file: UploadFileItem,
    fileList: UploadFileItem[],
    response: object
  ) => boolean | Promise<boolean>
  onRemove?: (
    file: UploadFileItem,
    fileList: UploadFileItem[],
    index: number
  ) => boolean | Promise<boolean>
  onDownload?: (file: UploadFileItem) => void
  photoSize?: 'small' | 'default' | 'large'
}
