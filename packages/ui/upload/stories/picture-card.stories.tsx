import React from 'react'
import Upload from '../src'

/**
 * @title 卡片图片
 */
export const PictureCard = () => {
  return (
    <>
      <h1>PictureCard</h1>
      <div className="upload-picture-list__wrap">
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
