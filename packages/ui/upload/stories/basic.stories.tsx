import React from 'react'
import Upload from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="default"
          // uploadAction="https://mife-gallery.test.mi.com/hiui/upload"
          uploadAction="https://jsonplaceholder.typicode.com/posts/"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          content="上传文件"
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
