import React from 'react'
import Upload from '../src'

/**
 * @title 自定义上传实现
 * @desc 设置后，默认的上传行为会被覆盖，上传请求由开发者在 customRequest 回调中实现。
 * @desc 如果设置了 uploadAction 则 customRequest 设置会无效
 */
export const CustomRequest = () => {
  const formatBody = (xhr: XMLHttpRequest) => {
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

  const action = 'https://jsonplaceholder.typicode.com/posts/'

  return (
    <>
      <h1>CustomRequest</h1>
      <div className="upload-custom-request__wrap">
        <Upload
          type="default"
          customRequest={(option) => {
            console.log('option', option)

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
              console.log('自定义错误处理', e)
              option.onError(option.file, e, {})
            }

            xhr.onload = function onload(e) {
              if (xhr.status < 200 || xhr.status >= 300) {
                return option.onError(option.file, e, formatBody(xhr))
              }

              option.onSuccess(option.file, formatBody(xhr))
            }

            xhr.open('POST', action, true)

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
          }}
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          data={[]}
          name={'files[]'}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
            // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
          }}
          disabled={false}
        />
      </div>
    </>
  )
}
