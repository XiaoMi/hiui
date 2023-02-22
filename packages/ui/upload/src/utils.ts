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

export const getFileItems = (fileList: FileList | null) => {
  if (!fileList) {
    return []
  }

  const itemArr = []
  const len = fileList.length

  for (let i = 0; i < len; i++) {
    itemArr[i] = fileList[i]
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
