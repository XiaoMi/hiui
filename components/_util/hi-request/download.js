import axiosIns from './axios'

const download = (options, host) => {
  const { filename } = options
  const url = host ? host + options.url : options.url

  // 设置类型，防止出现乱码
  Object.assign(options, { responseType: 'blob' })
  return axiosIns({ ...options, url }).then(
    (res) => {
      const { downloadSuccess, fileType } = options
      const blob = new window.Blob([res.data])
      const downloadElement = document.createElement('a')
      const serverFilename = decodeURI(res.headers['content-disposition'].split(';')[1].split('filename=')[1])
      const href = window.URL.createObjectURL(blob, {
        type: fileType
      }) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = filename || serverFilename || '未命名' // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放blob对象
      downloadSuccess && downloadSuccess(res)
    },
    (error) => {
      const { downloadFail } = options
      downloadFail && downloadFail(error)
    }
  )
}
export default download
