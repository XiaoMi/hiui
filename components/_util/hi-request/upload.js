const upload = options => {
  const { file, name = 'file', params = {}, headers, data } = options
  const formFile = new window.FormData()
  if (file) {
    formFile.append(name, file)
  }
  // 设置除file外需要带入的参数
  if (params) {
    Object.keys(params).forEach(key => {
      formFile.append(key, params[key])
    })
  }
  return {
    options: Object.assign({
      ...options,
      data: data || formFile,
      headers: { ...headers, 'Content-Type': 'multipart/form-data' }
    })
  }
}
export default upload
