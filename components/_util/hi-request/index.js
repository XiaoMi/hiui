import Cookies from 'js-cookie'
import jsonp from './jsonp'
import download from './download'
import upload from './upload'
import axiosIns, { axios } from './axios'

/**
 * 请求方法
 * @param options
 * @param host
 */

const HiRequest = (options, host) => {
  const { type = 'basics' } = options
  const url = host ? host + options.url : options.url
  if (type === 'jsonp' || type === 'download') {
    return type === 'jsonp' ? jsonp : download
  }
  return type === 'basics'
    ? axiosIns({
      url,
      type: 'basics',
      ...options
    })
    : axiosIns({
      url,
      method: 'post',
      ...upload(options).options
    })
}

// 请求语法糖： reguest.get HiRequest.post ……
const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options']
METHODS.forEach(method => {
  HiRequest[method] = (url, options) => HiRequest({ ...options, method, url })
})
// 取消请求
HiRequest.CancelToken = () => {
  return axios.CancelToken
}
/**
 * 获取cookies中的值作为参数使用
 * @param key
 */
HiRequest.getCookiesParam = key => {
  return Cookies.get(key)
}
// add jsonp
HiRequest.jsonp = jsonp
// download
HiRequest.download = download

export default HiRequest
