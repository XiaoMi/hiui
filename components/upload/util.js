export const getFileType = (file) => {
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
