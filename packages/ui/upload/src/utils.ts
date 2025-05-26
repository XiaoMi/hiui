export const getFileType = (file: File) => {
  const ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
  let fileType = 'other'
  if (['jpg', 'jpeg', 'gif', 'png', 'bmp'].includes(ext)) {
    fileType = 'img'
  }
  if (['rar', 'zip'].includes(ext)) {
    fileType = 'zip'
  }
  if (['doc', 'docx'].includes(ext)) {
    fileType = 'word'
  }
  if (['pdf'].includes(ext)) {
    fileType = 'pdf'
  }
  if (['ppt', 'pptx'].includes(ext)) {
    fileType = 'ppt'
  }
  if (['key'].includes(ext)) {
    fileType = 'key'
  }
  if (['exe', 'dmg'].includes(ext)) {
    fileType = 'exe'
  }

  if (['xls', 'xlsx'].includes(ext)) {
    fileType = 'excel'
  }
  if (['mp4'].includes(ext)) {
    fileType = 'video'
  }
  if (['mp3'].includes(ext)) {
    fileType = 'audio'
  }
  return fileType
}

/**
 * 获取处理后的文件列表
 * @param fileList 原始文件列表
 * @param accept 文件类型
 * @returns
 */
export const getFileItems = (fileList: FileList | null, accept?: string) => {
  if (!fileList) {
    return []
  }

  const itemArr = []
  const len = fileList.length
  const acceptArr = accept ? accept.replace(/\s/g, '').split(',') : []

  for (let i = 0; i < len; i++) {
    const item = fileList[i]
    const { type, name } = item

    if (
      acceptArr.length === 0 ||
      acceptArr.includes(type) ||
      acceptArr.includes(name.substring(name.lastIndexOf('.')))
    ) {
      itemArr.push(item)
    }
  }

  return itemArr
}

/**
 * 通过 filename 获取图片格式
 * @param filename
 * @returns
 */
export const getImageTypeByFilename = (filename: string) => {
  let type = filename.substring(filename.lastIndexOf('.') + 1)

  if (!type) type = 'png'

  if (type === 'jpg') type = 'jpeg'

  return `image/${type}`
}

/**
 * 格式化文件大小
 * @param size
 * @returns
 */
export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size}B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }
  return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`
}
