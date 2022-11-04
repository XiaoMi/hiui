import { UploadRequestOption } from './types'

function formatBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

export default function upload(option: UploadRequestOption) {
  const xhr = new window.XMLHttpRequest()

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      let percent = 0
      if (e.total > 0) {
        percent = (e.loaded / e.total) * 100
      }
      option.onProgress(option.file, e, percent)
    }
  }

  const formData = new window.FormData()
  const optData = option?.data
  if (optData) {
    Object.keys(optData).forEach((key) => {
      formData.append(key, optData[key])
    })
  }

  formData.append(option.name, option.file as File)

  xhr.onerror = (e) => {
    option.onError(option.file, e, {})
  }

  xhr.onload = function onload(e) {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(option.file, e, formatBody(xhr))
    }

    option.onSuccess(option.file, formatBody(xhr))
  }

  xhr.open(option.method ?? 'POST', option.action, true)

  const { timeout } = option

  if (typeof timeout === 'number' && timeout > 0) {
    xhr.timeout = timeout
    xhr.ontimeout = (e) => {
      option.onError(option.file, e, formatBody(xhr))
    }
  }

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}

  // 跨域等场景设置该头会报错，需要设为 null 来关闭
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  }

  for (const h in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h])
    }
  }
  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    },
  }
}
