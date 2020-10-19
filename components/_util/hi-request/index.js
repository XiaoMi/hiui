import Cookies from 'js-cookie'
import jsonp from './jsonp'
import download from './download'
import upload from './upload'
import axiosIns, { axios } from './axios'

/**
 * 请求方法
 * @param options
 * @param baseUrl
 */

const InternalRequest = (options, host) => {
  const { type = 'basics' } = options
  const url = host ? host + options.url : options.url
  if (type === 'jsonp' || type === 'download') {
    return type === 'jsonp' ? jsonp : download
  }
  return axiosIns(
    type === 'upload'
      ? {
          url,
          method: 'post',
          ...upload(options).options
        }
      : {
          url,
          type: 'basics',
          ...options
        }
  )
}
const HiRequest = (options, host) => {
  return InternalRequest(options, host)
}
// 请求语法糖： reguest.get HiRequest.post ……
const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options']
METHODS.forEach((method) => {
  HiRequest[method] = (url, options) => HiRequest({ ...options, method, url })
})
// 取消请求
const CANCEL = ['CancelToken', 'Cancel', 'isCancel']
CANCEL.forEach((type) => {
  HiRequest[type] = axios[type]
})

/**
 * 获取cookies中的值作为参数使用
 * @param key
 */
HiRequest.getCookiesParam = (key) => {
  return Cookies.get(key)
}
// add jsonp
HiRequest.jsonp = jsonp
// download
HiRequest.download = download
// upload
HiRequest.upload = (options, host) => {
  options.type = 'upload'
  return HiRequest(options, host)
}

// Expose all/spread
HiRequest.all = (promises) => {
  return Promise.all(promises)
}
HiRequest.spread = (callback) => {
  return (arr) => {
    return callback.apply(null, arr)
  }
}

export default HiRequest
