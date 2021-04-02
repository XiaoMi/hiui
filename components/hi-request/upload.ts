import axiosInstance from './axios'
import { HiRequestOptions } from './type'

const upload = (options: HiRequestOptions) => {
  const { headers: headersOption, data: dataOption, ...restOptions } = options

  const data = dataOption || getFormFile(options)
  const headers = { ...headersOption, 'Content-Type': 'multipart/form-data' }

  return axiosInstance({
    ...restOptions,
    method: 'post',
    data,
    headers
  })
}

function getFormFile(options: HiRequestOptions) {
  const { file, name = 'file', params = {} } = options
  const formFile = new window.FormData()

  if (file) {
    formFile.append(name, file)
  }

  // 设置除 file 外需要带入的参数
  if (params) {
    Object.keys(params).forEach((key) => {
      formFile.append(key, params[key])
    })
  }

  return formFile
}

export type uploadType = typeof upload
export type uploadReturnType = ReturnType<uploadType>

export default upload
