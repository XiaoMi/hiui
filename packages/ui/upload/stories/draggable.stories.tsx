import React from 'react'
import Upload from '../src'

/**
 * @title 拖拽上传
 * @desc 附件上传的区域固定且宽敞，上传附件数量较多，拖拽可有效提高效率
 */
export const Draggable = () => {
  return (
    <>
      <h1>Draggable</h1>
      <div className="upload-draggable__wrap">
        <Upload
          type="drag"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          accept="image/png,image/jpeg"
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          data={{ id: 'uid', channel: 'youpin' }}
          name={'files[]'}
          multiple={true}
        />
      </div>
    </>
  )
}
