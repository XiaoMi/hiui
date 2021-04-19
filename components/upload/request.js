function formatError(option, xhr, msg) {
  msg = msg || `Upload ${option.action} error`
  const err = new Error(msg)
  err.status = xhr.status
  err.url = option.action
  return err
}

function formatBody(xhr) {
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

// option {
//  onProgress: (file, event: { percent: number }): void,
//  onError: (file, event: Error, body?: Object): void,
//  onSuccess: (file, body: Object): void,
//  data: Object,
//  name: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
//  timeout: Number
// }
export default function upload(option) {
  const xhr = new window.XMLHttpRequest()

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100
      }
      option.onProgress(option.file, e)
    }
  }

  const formData = new window.FormData()

  if (option.data) {
    Object.keys(option.data).forEach((key) => {
      formData.append(key, option.data[key])
    })
  }
  // 兼容 2.x params 属性
  if (option.params) {
    Object.keys(option.params).forEach((key) => {
      formData.append(key, option.params[key])
    })
  }

  formData.append(option.name, option.file)

  xhr.onerror = (e) => {
    option.onError(option.file, e, {})
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(option.file, formatError(option, xhr), formatBody(xhr))
    }

    option.onSuccess(option.file, formatBody(xhr))
  }

  xhr.open('POST', option.action, true)

  const { timeout } = option

  if (typeof timeout === 'number' && timeout > 0) {
    xhr.timeout = timeout
    xhr.ontimeout = () => {
      const msg = `Upload abort for exceeding time (timeout: ${timeout}ms)`
      option.onError(formatError(option, xhr, msg), formatBody(xhr))
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
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h])
    }
  }
  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    }
  }
}
