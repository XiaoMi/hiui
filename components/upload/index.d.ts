type FileItem = {
  fileId: string
  fileType: string
  name: string
  uploadState: 'success' | 'uploading' | 'error'
  url: string
}
interface Props {
  type?: 'default' | 'drag' | 'pictureCard' | 'avatar' | 'photo'
  accept?: MimeType
  content?: string | JSX.Element,
  tips?: string | JSX.Element,
  maxSize?: number
  maxCount?: number
  uploadAction: string
  data?: {
    [prop: string]: any
  }
  name?: string
  disabled?: boolean
  headers?: object
  withCredentials?: boolean
  showUploadList?: boolean
  multiple?: boolean
  defaultFileList?: FileItem[]
  fileList?: FileItem[]
  loading?: boolean
  beforeUpload?: (files: FileItem[], fileList: FileItem[]) => boolean
  customUpload?: (files: FileItem[]) => void
  onChange?: (file: FileItem, fileList: FileItem[], response: object) => boolean
  onRemove?: (file: FileItem, fileList: FileItem[], index: number) => boolean
  onDownload?: (file: FileItem) => void
  photoSize?: 'small' | 'default' | 'large'
}
declare const Upload: React.ComponentType<Props>
export default Upload
