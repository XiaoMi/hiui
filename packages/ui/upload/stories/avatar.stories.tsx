import React from 'react'
import Upload from '../src'

/**
 * @title 头像上传
 * @desc 与其它组件配合使用，常见于名片、通讯录、账号管理等
 */
export const Avatar = () => {
  return (
    <>
      <h1>Avatar</h1>
      <div className="upload-avatar__wrap">
        <h2>sm</h2>
        <Upload
          type="avatar"
          size="sm"
          content="上传"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          data={{ id: 'uid', channel: 'youpin' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          onRemove={(file, fileList, index) => {
            console.log('remove callback', file, fileList, index)
            return new Promise((resolve) => resolve(true))
          }}
          name="uploadAvatar"
        />
        <h2>md</h2>
        <Upload
          type="avatar"
          size="md"
          content="上传头像"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          data={{ id: 'uid', channel: 'youpin' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          onRemove={(file, fileList, index) => {
            console.log('remove callback', file, fileList, index)
            return new Promise((resolve) => resolve(true))
          }}
          name="uploadAvatar"
        />
        <h2>lg</h2>
        <Upload
          type="avatar"
          size="lg"
          content="上传头像"
          uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          headers={{ name: 'mi' }}
          data={{ id: 'uid', channel: 'youpin' }}
          onChange={(file, fileList, response) => {
            console.log('upload callback', file, fileList, response)
          }}
          onRemove={(file, fileList, index) => {
            console.log('remove callback', file, fileList, index)
            return new Promise((resolve) => resolve(true))
          }}
          name="uploadAvatar"
        />
      </div>
    </>
  )
}
