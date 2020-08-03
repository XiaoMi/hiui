import axios from 'axios'
import qs from 'qs'

const axiosInstance = axios.create({
  type: 'basics',
  url: '',
  responseType: 'json'
})
const axiosIns = (options) => {
  const {
    beforeResponse,
    errorResponse,
    beforeRequest,
    errorRequest,
    data,
    errorCallback
  } = options
  if (
    options.headers &&
    options.headers['content-type'] &&
    options.headers['content-type'].toLocaleLowerCase() === 'application/x-www-form-urlencoded' &&
    options.data
  ) {
    Object.assign(options, { data: qs.stringify(data) })
  }

  axiosInstance.interceptors.request.use(
    (config) => {
      if (beforeRequest) {
        return beforeRequest(config)
      }
      return config
    },
    (error) => {
      if (errorRequest) {
        return errorRequest(error)
      }
      errorCallback && errorCallback(error)
      return error
    }
  )
  axiosInstance.interceptors.response.use(
    (response) => {
      if (beforeResponse) {
        return beforeResponse(response)
      }
      return response
    },
    (error) => {
      if (errorResponse) {
        return errorResponse(error)
      }
      errorCallback && errorCallback(error)

      return error
    }
  )

  return axiosInstance({ ...options })
}
export { axios }
export default axiosIns
