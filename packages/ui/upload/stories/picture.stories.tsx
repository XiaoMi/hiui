import React from 'react'
import Upload from '../src'

export const Picture = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="photo"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          onChange={(file, fileList, response) => {
            file.id = 'file唯一标识'
            console.log('upload callback', file, fileList, response)
          }}
          onRemove={(file, fileList, index) => {
            console.log('remove callback', file, fileList, index)
            return new Promise((resolve, reject) => resolve(true))
          }}
          data={{ id: 'uid', channel: 'youpin' }}
          name={'files[]'}
        />
      </div>
    </>
  )
}
