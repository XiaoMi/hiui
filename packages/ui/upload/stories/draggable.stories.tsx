import React from 'react'
import Upload from '../src'

export const Draggable = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="drag"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          tips="仅支持 jpg/png 文件，且不超过 500kb"
          hasBorder={true}
          data={{ id: 'uid', channel: 'youpin' }}
          name={'files[]'}
          multiple={true}
        />
      </div>
    </>
  )
}
