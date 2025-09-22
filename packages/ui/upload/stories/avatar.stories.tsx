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
          size="md"
          content="上传"
          // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
          uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
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
          avatarOptions={{
            background: false, // 是否显示网格背景
            viewMode: 1, // 限制裁剪框不能超出图片
            dragMode: 'move', // 拖动模式，'move' 表示可以拖动图片
            autoCropArea: 0.5, // 裁剪区域占图片百分比
            restore: false, // 窗口调整大小后是否恢复裁剪区域
            guides: false, // 是否在裁剪框上方显示引导线
            center: false, // 是否在裁剪框上方显示中心指示器
            cropBoxMovable: true, // 是否可移动裁剪框
            aspectRatio: 324 / 220, // 裁剪框比例
            cropBoxResizable: false, // 是否可调整裁剪框大小
            toggleDragModeOnDblclick: false, // 双击时是否切换拖动模式
            outputWidth: 972, // 输出图像的宽度
            outputHeight: 660, // 输出图像的高度
          }}
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
