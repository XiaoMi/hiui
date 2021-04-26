import axiosInstance from './axios'
import { AxiosResponse, HiRequestOptions } from './type'

const download = (options: HiRequestOptions) => {
  const { filename, downloadSuccess, downloadFail, ...restOptions } = options

  // 设置类型，防止出现乱码
  Object.assign(restOptions, { responseType: 'blob' })

  return axiosInstance(restOptions).then(
    (res) => {
      // 获取下载后文件名
      const downloadFilename = filename || getDownloadFilename(res)

      // 创建下载的链接
      const blob = new window.Blob([res.data])
      const href = window.URL.createObjectURL(blob)

      // 使用 a 标签创建下载
      const downloadElement = document.createElement('a')
      downloadElement.download = downloadFilename
      downloadElement.href = href
      downloadElement.style.display = 'none'

      // 开始链接下载
      document.body.appendChild(downloadElement)
      downloadElement.click()

      // 资源释放：DOM 元素 和 blob 对象
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)

      // 成功下载 hook
      downloadSuccess?.(res)

      return res
    },
    (error) => {
      // 失败下载 hook
      downloadFail?.(error)
    }
  )
}

// 如果没有自定义文件名，则根据响应头部信息生成
function getDownloadFilename<T>(response: AxiosResponse<T>) {
  const contentDisposition = response?.headers?.['content-disposition']
  const serverFilename = decodeURI(contentDisposition?.split(';')[1]?.split('filename=')[1] || '未命名')
  return serverFilename
}

export type downloadType = typeof download
export type downloadReturnType = ReturnType<downloadType>

export default download
