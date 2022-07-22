import axiosInstance, { axios } from './axios'
import jsonp from './jsonp'
import download from './download'
import upload from './upload'
import { isHTTPLink } from './utils'
import type {
  HiRequestType,
  HiRequestOptions,
  HiRequestMethod,
  HiRequestStaticAxios,
  HiRequestStatic,
} from './type'

// Mixed Request
const InternalRequest = (
  type: HiRequestType | null,
  url: string | HiRequestOptions,
  options?: HiRequestOptions
) => {
  const baseOptions = typeof url === 'string' ? { url } : url
  const {
    url: urlOption,
    type: typeOption,
    baseURL,
    responseType = 'json',
    ...restOptions
  } = Object.assign({}, baseOptions, options)

  const _url = isHTTPLink(urlOption) ? urlOption : baseURL ? baseURL + urlOption : urlOption
  const _type = type || typeOption

  const _options = Object.assign({}, restOptions, { url: _url, responseType })

  switch (_type) {
    case 'jsonp':
      return jsonp(_options)
    case 'download':
      return download(_options)
    case 'upload':
      return upload(_options)
    default:
      return axiosInstance(_options)
  }
}

// @ts-ignore
const HiRequest: HiRequestStatic = (url: string | HiRequestOptions, options?: HiRequestOptions) =>
  InternalRequest(null, url, options)

// 请求语法糖： HiRequest.get HiRequest.post ……
const AXIOS_METHODS: HiRequestMethod[] = [
  'get',
  'post',
  'delete',
  'put',
  'patch',
  'head',
  'options',
]

AXIOS_METHODS.forEach((method) => {
  // @ts-ignore
  HiRequest[method] = (url: string, options?: HiRequestOptions) =>
    HiRequest({ ...options, method, url })
})

// 扩展的 axios 静态方法：cancels、all\spread
const AXIOS_REST_STATIC: HiRequestStaticAxios[] = [
  'CancelToken',
  'Cancel',
  'isCancel',
  'all',
  'spread',
]

AXIOS_REST_STATIC.forEach((type) => {
  // @ts-ignore
  HiRequest[type] = axios[type]
})

// jsonp
HiRequest.jsonp = (url: string | HiRequestOptions, options?: HiRequestOptions) =>
  InternalRequest('jsonp', url, options)

// download
HiRequest.download = (url: string | HiRequestOptions, options?: HiRequestOptions) =>
  InternalRequest('download', url, options)

// upload
HiRequest.upload = (url: string | HiRequestOptions, options?: HiRequestOptions) =>
  InternalRequest('upload', url, options)

export default HiRequest
