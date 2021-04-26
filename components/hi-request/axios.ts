import axios from 'axios'
import type { HiRequestConfig } from './type'

const callBackInter = new Map()

const _axiosInstance = axios.create({
  baseURL: ''
})

_axiosInstance.interceptors.request.use(
  (config) => {
    if (callBackInter.has('beforeRequest')) {
      return callBackInter.get('beforeRequest')(config)
    }
    return config
  },
  (error) => {
    callBackInter.has('errorCallback') && callBackInter.get('errorCallback')(error)

    if (callBackInter.has('errorRequest')) {
      return callBackInter.get('errorRequest')(error)
    }
    return Promise.reject(error)
  }
)

_axiosInstance.interceptors.response.use(
  (response) => {
    if (callBackInter.has('beforeResponse')) {
      return callBackInter.get('beforeResponse')(response)
    }
    return response
  },
  (error) => {
    callBackInter.has('errorCallback') && callBackInter.get('errorCallback')(error)

    if (callBackInter.has('errorResponse')) {
      return callBackInter.get('errorResponse')(error)
    }
    return Promise.reject(error)
  }
)

const axiosInstance = (options: HiRequestConfig) => {
  const { beforeResponse, errorResponse, beforeRequest, errorRequest, errorCallback } = options

  beforeRequest && callBackInter.set('beforeRequest', beforeRequest)
  errorResponse && callBackInter.set('errorResponse', errorResponse)
  beforeResponse && callBackInter.set('beforeResponse', beforeResponse)
  errorRequest && callBackInter.set('errorRequest', errorRequest)
  errorCallback && callBackInter.set('errorCallback', errorCallback)

  return _axiosInstance(options)
}

export { axios }
export default axiosInstance
