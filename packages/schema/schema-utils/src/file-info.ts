export type FileInfo = {
  name: string
  fullName: string
  ext: string
}

/**
 * 从文件URL中提取文件名和扩展名
 * @param file 文件URL
 * @returns 文件名和扩展名
 */
export function extractFileInfo(file: string): FileInfo {
  // 移除URL中的查询参数和哈希
  const cleanUrl = file.split(/[?#]/)[0]

  // 获取最后一个斜杠后的内容
  const lastPart = cleanUrl.split('/').pop() || ''

  // 处理文件名和后缀
  const lastDotIndex = lastPart.lastIndexOf('.')

  if (lastDotIndex === -1) {
    // 没有后缀名的情况
    return {
      name: lastPart,
      fullName: lastPart,
      ext: '',
    }
  }

  return {
    name: lastPart.substring(0, lastDotIndex),
    fullName: lastPart,
    ext: lastPart.substring(lastDotIndex + 1).toLowerCase(),
  }
}
