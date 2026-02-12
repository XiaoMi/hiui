import type { StandardProps } from 'ahooks/es/useControllableValue'
import type { UploadProps } from '@hi-ui/upload'

export type BaseFileInfoType = {
  /** 文件名称 */
  name: string
  /** 包含协议、域名、路径等的完整文件地址 */
  url: string
}

export type UploadFileType =
  | string
  | File
  | (BaseFileInfoType & {
      /** 文件唯一标识 */
      fileId?: string
    })

export type UploadBridgeProps = Partial<StandardProps<UploadFileType[]>> &
  Omit<
    UploadProps,
    // UploadProps
    | 'customUpload'
    | 'onChange'
    | 'fileList'
    | 'onRemove'
    // 内置的请求相关的选项全部移除
    | 'maxSize'
    | 'uploadAction'
    | 'data'
    | 'name'
    | 'method'
    | 'headers'
    | 'withCredentials'
    | 'beforeUpload'
  > & {
    /**
     * 上传模式
     * @default 'formData'
     * @desc formData 模式时，响应给外部的是【文件】的列表
     * @desc json 模式时，响应给外部的是【文件基本信息对象】的列表
     * @desc json 模式时需传入 request 方法，用来上传文件
     * @desc json 模式下，返回的信息顺序需与上传的顺序一致，否则可能导致自动去重逻辑失效
     */
    mode?: 'formData' | 'json'
    request?: (files: File[]) => Promise<(string | BaseFileInfoType)[]>
    /** 接收上传的文件体积上限（单位：KB） */
    maxSize?: number
  }
