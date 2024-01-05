import React from 'react'
import { NormalUpload, DragUpload, PictureUpload, PictureListUpload, AvatarUpload } from '../src'

/**
 * @title 单个导入，按需引用
 * @desc 建议采用该方式引用，有利用打包时做 Tree Shaking
 */
export const SingleImport = () => {
  return (
    <>
      <h1>SingleImport</h1>
      <div className="upload-single-import__wrap">
        <NormalUpload
          uploadAction="https://jsonplaceholder.typicode.com/posts/"
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          accept="image/png,image/jpg"
          headers={{ name: 'mi' }}
          name={'files[]'}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
        />
      </div>
    </>
  )
}
