import React from 'react'
import { NormalUpload, DragUpload, PictureUpload, PictureListUpload, AvatarUpload } from '../src'

/**
 * @title 按需引用
 * @desc 支持单个组件按需引用，有利于打包时做 Tree Shaking
 */
export const SingleImport = () => {
  return (
    <>
      <h1>SingleImport</h1>
      <div className="upload-single-import__wrap">
        <NormalUpload
          // uploadAction="https://jsonplaceholder.typicode.com/posts/"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
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
