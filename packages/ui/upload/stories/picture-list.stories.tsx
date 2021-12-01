import React from 'react'
import Upload from '../src'

export const PictureList = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="pictureCard"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          content="上传文件"
          data={{ id: 'uid', channel: 'youpin' }}
          name="pictureCard"
        />
      </div>
    </>
  )
}
