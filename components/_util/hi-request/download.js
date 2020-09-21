import axiosIns from './axios'

const download = (options, host) => {
  const { filename = '未命名' } = options
  const url = host ? host + options.url : options.url

  Object.assign(options, { responseType: 'blob' })
  axiosIns({ ...options, url }).then(
    (res) => {
      const { downloadSuccess } = options
      const blob = new window.Blob([res.data])
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = filename // 下载后文件名
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
