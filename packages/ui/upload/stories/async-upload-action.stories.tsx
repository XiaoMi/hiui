import React from 'react'
import Upload from '../src'

/**
 * @title 上传前的处理
 * @desc uploadAction 接收一个函数，返回一个 Promise
 */
export const AsyncUploadAction = () => {
  return (
    <>
      <h1>AsyncUploadAction</h1>
      <div className="upload-before-uplod__wrap">
        <h2>异步的 UploadAction</h2>
        <Upload
          type="default"
          uploadAction={() => {
            console.log('上传前的处理')
            return new Promise((resolve) => {
              setTimeout(() => resolve('https://jsonplaceholder.typicode.com/posts/'), 1000)
            })
          }}
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          multiple
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
