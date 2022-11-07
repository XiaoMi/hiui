import { HiBaseHTMLProps } from '@hi-ui/core'
import React from 'react'

export interface UploadFileItem extends Partial<File> {
  /**
   * 上传文件 id
   */
  fileId?: string
  /**
   * 文件类型
   */
  fileType?: string
  /**
   * 上传文件状态
   */
  uploadState?: 'success' | 'loading' | 'error'
  /**
   * 上传文件地址
   */
  url?: string
  /**
   * 文件名
   */
  name?: string
  abort?: () => void
  progressNumber?: number
}

export interface UploadFileList {
  prefixCls?: string
  fileList: UploadFileItem[]
  onDelete: (file: UploadFileItem, index: any) => void
  onDownload: UploadProps['onDownload']
  showPic?: boolean
  actionRender?: (props: ActionRenderProps) => React.ReactNode
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
  method?: 'POST' | 'PUT'
}

export type UploadPhotoSizeEnum = 'sm' | 'md' | 'lg'

export type UploadTypeEnum = 'default' | 'drag' | 'pictureCard' | 'avatar' | 'photo'

export interface UploadProps extends HiBaseHTMLProps<'div'> {
  /**
   * 上传组件类型
   */
  type?: 'default' | 'drag' | 'pictureCard' | 'avatar' | 'photo'
  /**
   * 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 [MDN-MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)
   */
  accept?: string
  /**
   * 上传按钮icon，仅在 type === 'default' 的时候有效
   */
  icon?: React.ReactNode
  /**
   * 上传按钮文案，仅在 type === 'default' 的时候有效
   */
  content?: React.ReactNode
  /**
   * 上传文件信息提示
   */
  tips?: React.ReactNode
  /**
   * 接收上传的文件体积上限（单位：KB）
   */
  maxSize?: number
  /**
   * 接收上传的文件最大数量
   */
  maxCount?: number
  /**
   * 上传的地址
   */
  uploadAction?: string | ((file: File) => Promise<string>)
  /**
   * 除了上传文件外的其它 form 参数
   */
  data?: UploadRequestOption['data']
  /**
   * 发到后台文件参数名
   */
  name?: UploadRequestOption['name']
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 设置上传的请求类型
   */
  method?: UploadRequestOption['method']
  /**
   * 设置上传的请求头部
   */
  headers?: UploadRequestOption['headers']
  /**
   * 上传请求时是否携带 cookie
   */
  withCredentials?: UploadRequestOption['withCredentials']
  /**
   * 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效
   */
  showUploadList?: boolean
  /**
   * 是否支持多选文件
   */
  multiple?: boolean
  /**
   * 默认已上传文件列表
   */
  defaultFileList?: UploadFileItem[]
  /**
   * 已上传文件列表（受控）
   */
  fileList?: UploadFileItem[]
  /**
   * 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效
   */
  loading?: boolean
  /**
   * 头像裁切配置项
   */
  avatarOptions?: Record<string, any>
  /**
   * 设置上传按钮大小,仅在 type === 'photo' 时有效
   */
  photoSize?: UploadPhotoSizeEnum
  /**
   * 预览透传 props
   */
  preview?: { className?: string }
  /**
   * 上传文件前的钩子，返回 true 继续上传，其他终止上传
   */
  beforeUpload?: (file: UploadFileItem, fileList: UploadFileItem[]) => boolean
  /**
   * 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数
   */
  customUpload?: (files: HTMLInputElement['files']) => void
  /**
   * 上传请求成功后回调
   */
  onChange?: (
    file: UploadFileItem,
    fileList: UploadFileItem[],
    response: object
  ) => void | boolean | Promise<boolean>
  /**
   * 删除上传的文件
   */
  onRemove?: (
    file: UploadFileItem,
    fileList: UploadFileItem[],
    index: number
  ) => boolean | Promise<boolean>
  /**
   * 点击已上传的文件时的回调
   */
  onDownload?: (file: UploadFileItem) => void
  /**
   * 操作区自定义渲染，暂仅在 type="default" 下有效
   */
  actionRender?: (props: ActionRenderProps) => React.ReactNode
}

export interface ActionRenderProps {
  file: UploadFileItem
  index: number
}
