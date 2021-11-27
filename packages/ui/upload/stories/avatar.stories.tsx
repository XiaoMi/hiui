import React from 'react'
import Upload from '../src'

export const Avatar = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="upload-basic__wrap">
        <Upload
          type="avatar"
          width={180}
          height={180}
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          data={{ id: 'uid', channel: 'youpin' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          onRemove={(file, fileList, index) => {
            console.log('remove callback', file, fileList, index)
            return new Promise((resolve, reject) => resolve(true))
          }}
          name="uploadAvatar"
        />
      </div>
    </>
  )
}
