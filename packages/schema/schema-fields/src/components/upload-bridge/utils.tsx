import { extractFileInfo } from '@hi-ui/schema-utils'
import type { UploadFileItem } from '@hi-ui/upload'
import type { UploadFileType } from './type'

export function toFileList(file?: UploadFileType | UploadFileType[]) {
  if (!file) return {}

  const fileIdSet = new Set<string>()

  const files = Array.isArray(file) ? file : [file]
  const fileList = files.map((file) => {
    const normalizedFile =
      typeof file === 'string'
        ? {
            symbol: file,
            fileId: file,
            url: file,
          }
        : file instanceof File
        ? {
            symbol: file.name,
            name: file.name,
            fileId: `${file.name}-${file.size}-${file.lastModified}`,
            url: URL.createObjectURL(file),
          }
        : {
            symbol: file.url,
            name: file.name,
            fileId: `${file.name}-${file.url}`,
            url: file.url,
          }

    const info = extractFileInfo(normalizedFile.symbol)

    // 添加到 fileIdSet
    fileIdSet.add(normalizedFile.fileId)

    return {
      name: normalizedFile.name || info.fullName,
      fileId: normalizedFile.fileId,
      fileType: info.ext,
      uploadState: 'success',
      url: normalizedFile.url,
    } as UploadFileItem
  })

  return { fileIdSet, fileList }
}

// 文件唯一标识生成函数
export function genFileIdentifier(file: UploadFileType) {
  if (file instanceof File) {
    return `${file.name}-${file.size}-${file.lastModified}`
  } else if (typeof file === 'string') {
    return file
  } else {
    return `${file.name}-${file.url}`
  }
}

export function sliceToMaxCount<T>(value: T[], maxCount: number | undefined, curCount = 0) {
  // maxCount 存在时，计算需要保留的文件数量
  const _maxCount = typeof maxCount === 'number' ? maxCount - curCount : undefined

  const sliceStart = Math.max(value.length - (_maxCount || 0), 0)
  return value.slice(sliceStart)
}
