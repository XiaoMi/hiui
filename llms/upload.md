# Upload 上传

用来上传多种格式的附件。

## 使用示例

### 基础用法

突出上传附件的操作入口，节省页面空间


```tsx
import React from 'react'
import Upload from '@hi-ui/upload' 
export const Basic = () => {
 return (
 <> 
 <div className="upload-basic__wrap">
 <Upload
 type="default"
 content="上传文件"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={[
 {
 name: 'a.png',
 fileId: '1',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'loading', // 上传状态，可取值success, error
 progressNumber: 50,
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'b.png',
 fileId: '2',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'c.png',
 fileId: '3',
 fileType: 'img',
 uploadState: 'error',
 url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
 },
 ]}
 name={'files[]'}
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
 }}
 disabled={false}
 />
 </div>
 </>
 )
}

```


### 受控用法


```tsx
import React from 'react'
import Upload, { UploadFileItem } from '@hi-ui/upload' 
export const Controlled = () => {
 const [fileList, setFileList] = React.useState<UploadFileItem[]>([])

 return (
 <> 
 <div className="upload-controlled__wrap">
 <Upload
 type="default"
 content="上传文件"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 multiple
 headers={{ name: 'mi' }}
 data={[]}
 fileList={fileList}
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 setFileList(fileList)
 }}
 onRemove={(file, fileList) => {
 console.log('remove callback', file, fileList)
 setFileList([...fileList.filter((item) => item.fileId !== file.fileId)])
 return true
 }}
 disabled={false}
 name={'files[]'}
 />
 </div>
 </>
 )
}

```


### 按需引用

支持单个组件按需引用，有利于打包时做 Tree Shaking


```tsx
import React from 'react'
import { NormalUpload, DragUpload, PictureUpload, PictureListUpload, AvatarUpload } from '@hi-ui/upload' 
export const SingleImport = () => {
 return (
 <> 
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

```


### 大小

上传文件列表的大小


```tsx
import React from 'react'
import Upload, { UploadFileItem } from '@hi-ui/upload' 
export const Size = () => {
 const defaultFileList: UploadFileItem[] = [
 {
 name: 'a.png',
 fileId: '1',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'loading', // 上传状态，可取值success, error
 progressNumber: 50,
 size: 1435417,
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'b.png',
 fileId: '2',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 size: 1435417,
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'c.png',
 fileId: '3',
 fileType: 'img',
 uploadState: 'error',
 size: 1435417,
 url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
 },
 ]

 return (
 <> 
 <div className="upload-size__wrap">
 <h2>xs</h2>
 <Upload
 type="default"
 size="xs"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={defaultFileList}
 name={'files[]'}
 disabled={false}
 />
 <h2>md</h2>
 <Upload
 type="default"
 size="md"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={defaultFileList}
 name={'files[]'}
 disabled={false}
 />
 <h2>lg</h2>
 <Upload
 type="default"
 size="lg"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={defaultFileList}
 name={'files[]'}
 disabled={false}
 />
 </div>
 </>
 )
}

```


### 拖拽上传

附件上传的区域固定且宽敞，上传附件数量较多，拖拽可有效提高效率


```tsx
import React from 'react'
import Upload from '@hi-ui/upload' 
export const Draggable = () => {
 return (
 <> 
 <div className="upload-draggable__wrap">
 <Upload
 type="drag"
 // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 headers={{ name: 'mi' }}
 accept=".png,.jpg,.jpeg"
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

```


### 卡片图片


```tsx
import React from 'react'
import Upload from '@hi-ui/upload' 
export const PictureCard = () => {
 return (
 <> 
 <div className="upload-picture-list__wrap">
 <Upload
 type="pictureCard"
 // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
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

```


### 照片墙上传

展示一组照片内容


```tsx
import React from 'react'
import Upload, { UploadFileItem } from '@hi-ui/upload' 
export const Photo = () => {
 const defaultFileList: UploadFileItem[] = [
 {
 name: 'a.png',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'b.png',
 fileType: 'img',
 uploadState: 'error',
 url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black2.png',
 },
 ]

 return (
 <> 
 <div className="upload-photo__wrap">
 <h2>sm</h2>
 <Upload
 type="photo"
 photoSize="sm"
 content="上传"
 preview={{
 title(url, index) {
 return `title_${index}`
 },
 }}
 // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 }}
 onRemove={(file, fileList, index) => {
 console.log('remove callback', file, fileList, index)
 return new Promise((resolve) => resolve(true))
 }}
 defaultFileList={defaultFileList}
 data={{ id: 'uid', channel: 'youpin' }}
 name={'files[]'}
 />
 <h2>md</h2>
 <Upload
 type="photo"
 photoSize="md"
 content="上传图片"
 // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 }}
 onRemove={(file, fileList, index) => {
 console.log('remove callback', file, fileList, index)
 return new Promise((resolve) => resolve(true))
 }}
 defaultFileList={defaultFileList}
 data={{ id: 'uid', channel: 'youpin' }}
 name={'files[]'}
 />
 <h2>lg</h2>
 <Upload
 type="photo"
 photoSize="lg"
 content="上传图片"
 // uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 }}
 onRemove={(file, fileList, index) => {
 console.log('remove callback', file, fileList, index)
 return new Promise((resolve) => resolve(true))
 }}
 defaultFileList={defaultFileList}
 data={{ id: 'uid', channel: 'youpin' }}
 name={'files[]'}
 />
 </div>
 </>
 )
}

```


### 头像上传

与其它组件配合使用，常见于名片、通讯录、账号管理等


```tsx
import React from 'react'
import Upload from '@hi-ui/upload' 
export const Avatar = () => {
 return (
 <> 
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

```


### 自定义上传

完全自定义上传逻辑，适合复杂上传逻辑场景


```tsx
import React from 'react'
import Upload, { UploadFileItem } from '@hi-ui/upload' 
export const CustomUpload = () => {
 const [fileList, setFileList] = React.useState<UploadFileItem[]>([
 {
 name: 'a.png',
 fileId: '1',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 },
 {
 name: 'b.png',
 fileId: '2',
 fileType: 'img',
 uploadState: 'error',
 },
 ])

 return (
 <> 
 <div className="upload-custom-upload__wrap">
 <Upload
 type="default"
 customUpload={(files) => {
 const nextFileList = fileList.concat({
 name: files?.[0]?.name,
 fileId: '3',
 fileType: files?.[0]?.name
 ?.slice(files?.[0]?.name?.lastIndexOf('.') + 1)
 .toLowerCase(),
 uploadState: 'success',
 })

 setFileList(nextFileList)
 }}
 content="上传文件"
 fileList={fileList}
 />
 </div>
 </>
 )
}

```


### 自定义渲染操作区


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import Upload from '@hi-ui/upload' 
export const ActionRender = () => {
 return (
 <> 
 <div className="upload-action-render__wrap">
 <Upload
 type="default"
 // uploadAction="https://jsonplaceholder.typicode.com/posts/"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 defaultFileList={[
 {
 name: 'a.png',
 fileId: '1',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'b.png',
 fileId: '2',
 fileType: 'img',
 uploadState: 'error',
 url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png',
 },
 ]}
 name={'files[]'}
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
 }}
 actionRender={({ file }) => {
 return (
 <Button appearance="link" size="sm">
 {file.uploadState === 'loading' ? '加载中' : '删除'}
 </Button>
 )
 }}
 />
 </div>
 </>
 )
}

```


### 上传前的处理

uploadAction 接收一个函数，返回一个 Promise


```tsx
import React from 'react'
import Upload from '@hi-ui/upload' 
export const AsyncUploadAction = () => {
 return (
 <> 
 <div className="upload-before-uplod__wrap">
 <h2>异步的 UploadAction</h2>
 <Upload
 type="default"
 uploadAction={() => {
 console.log('上传前的处理')
 return new Promise((resolve) => {
 setTimeout(
 () => resolve('https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload'),
 1000
 )
 })
 }}
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 multiple
 data={[]}
 name={'files[]'}
 onChange={(file, fileList, response) => {
 console.log('upload callback', file, fileList, response)
 // if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
 }}
 disabled={false}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 对各子组件内部结构进行细粒度样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Upload, { UploadSemanticName, UploadFileItem } from '@hi-ui/upload' 
export const Semantic = () => {
 const [selected, setSelected] = useState<UploadSemanticName>()

 const fileList = [
 {
 name: 'a.png',
 fileId: '1',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'loading', // 上传状态，可取值success, error
 progressNumber: 50,
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 {
 name: 'b.png',
 fileId: '2',
 fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
 uploadState: 'success', // 上传状态，可取值success, error
 url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg',
 },
 ]

 return (
 <> 
 <div className="upload-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Upload
 type="default"
 content="上传文件"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={fileList as UploadFileItem[]}
 classNames={{
 root: 'my-upload__root',
 normalUpload: 'my-upload__normal',
 normalUploadTrigger: 'my-upload__normal-trigger',
 normalUploadTips: 'my-upload__normal-tips',
 normalUploadList: 'my-upload__normal-list',
 }}
 styles={{
 [selected as string]: { outline: '1px solid #ffbe0a' },
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'normalUpload', description: '普通上传' },
 { title: 'normalUploadTrigger', description: '普通上传按钮' },
 { title: 'normalUploadTips', description: '普通上传提示' },
 { title: 'normalUploadList', description: '普通上传文件列表' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 <Row gutter={12}>
 <Col span={18}>
 <Upload
 type="drag"
 content="上传文件"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={fileList as UploadFileItem[]}
 classNames={{
 root: 'my-upload__root',
 dragUpload: 'my-upload__drag',
 dragUploadDropArea: 'my-upload__drag-area',
 dragUploadDropDesc: 'my-upload__drag-desc',
 dragUploadDropTitle: 'my-upload__drag-title',
 dragUploadTips: 'my-upload__drag-tips',
 dragUploadList: 'my-upload__drag-list',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'dragUpload', description: '拖拽上传' },
 { title: 'dragUploadDropArea', description: '拖拽上传区域' },
 { title: 'dragUploadDropDesc', description: '拖拽上传描述' },
 { title: 'dragUploadDropTitle', description: '拖拽上传标题' },
 { title: 'dragUploadTips', description: '拖拽上传提示' },
 { title: 'dragUploadList', description: '拖拽上传列表' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 <Row gutter={12}>
 <Col span={18}>
 <Upload
 type="pictureCard"
 content="上传文件"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={fileList as UploadFileItem[]}
 classNames={{
 root: 'my-upload__root',
 pictureListUpload: 'my-upload__picture-list',
 pictureListUploadTrigger: 'my-upload__picture-list-trigger',
 pictureListUploadTips: 'my-upload__picture-list-tips',
 pictureListUploadList: 'my-upload__picture-list-list',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'pictureListUpload', description: '图片列表上传' },
 { title: 'pictureListUploadTrigger', description: '图片列表上传按钮' },
 { title: 'pictureListUploadTips', description: '图片列表上传提示' },
 { title: 'pictureListUploadList', description: '图片列表上传列表' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 <Row gutter={12}>
 <Col span={18}>
 <Upload
 type="photo"
 content="上传文件"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 defaultFileList={fileList as UploadFileItem[]}
 classNames={{
 root: 'my-upload__root',
 pictureUpload: 'my-upload__picture',
 pictureUploadList: 'my-upload__picture-list',
 pictureUploadItem: 'my-upload__picture-item',
 pictureUploadUploadTrigger: 'my-upload__picture-trigger',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'pictureUpload', description: '图片上传' },
 { title: 'pictureUploadList', description: '图片列表上传' },
 { title: 'pictureUploadItem', description: '图片上传项' },
 { title: 'pictureUploadUploadTrigger', description: '图片上传按钮' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 <Row gutter={12}>
 <Col span={18}>
 <Upload
 type="avatar"
 content="上传文件"
 uploadAction="https://ae97d8f3-cdda-48e5-98a6-40ffe37a94bc.mock.pstmn.io/upload"
 tips="仅支持 jpg/png 文件，且不超过 500kb"
 accept="image/png,image/jpg"
 headers={{ name: 'mi' }}
 data={[]}
 classNames={{
 root: 'my-upload__root',
 avatarUpload: 'my-upload__avatar',
 avatarUploadList: 'my-upload__avatar-list',
 avatarUploadItem: 'my-upload__avatar-item',
 avatarUploadUploadTrigger: 'my-upload__avatar-trigger',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'avatarUpload', description: '头像上传' },
 { title: 'avatarUploadList', description: '头像列表上传' },
 { title: 'avatarUploadItem', description: '头像上传项' },
 { title: 'avatarUploadUploadTrigger', description: '头像上传按钮' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as UploadSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### NormalUpload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | - |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | "md" |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | - |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | true |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | - |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


### DragUpload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | - |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | - |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | - |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | false |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | true |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | - |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


### PictureListUpload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | - |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | - |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | - |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | true |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | - |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


### PictureUpload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | - |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | - |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | - |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | - |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | - |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


### AvatarUpload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | - |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | "md" |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | - |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | - |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | "{}" |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


### Upload Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| classNames | 语义化 classNames（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, string>> \| UploadSemanticClassNames | Partial\<Record\<UploadSemanticName, string>> \| Readonly\<Partial\<Record\<UploadSemanticName, string>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, string>>> | - |
| styles | 语义化 styles（支持对象或函数，子组件内为合并后的对象） | Partial\<Record\<UploadSemanticName, CSSProperties>> \| UploadSemanticStyles | Partial\<Record\<UploadSemanticName, CSSProperties>> \| Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> \| (info: { props: UploadProps; }) => Readonly\<Partial\<Record\<UploadSemanticName, CSSProperties>>> | - |
| type | 上传组件类型 | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" \| "drag" \| "pictureCard" \| "avatar" \| "photo" | "default" |
| size | 上传文件列表大小 | "xs" \| "md" \| "lg" | "xs" \| "md" \| "lg" | - |
| accept | 接收上传的文件类型， 用逗号隔开的 MIME 类型列表，参考 \[MDN-MIME 类型]\(https\://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics\_of\_HTTP/MIME\_Types) | string | - | - |
| icon | 上传按钮icon，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| content | 上传按钮文案，仅在 type === 'default' 的时候有效 | ReactNode | - | - |
| tips | 上传文件信息提示 | ReactNode | - | - |
| maxSize | 接收上传的文件体积上限（单位：KB） | number | - | - |
| maxCount | 接收上传的文件最大数量 | number | - | - |
| uploadAction | 上传的地址 | string \| ((file: File) => Promise\<string>) | string \| (file: File) => Promise\<string> | - |
| data | 除了上传文件外的其它 form 参数 | Record\<string, any> | - | \[] |
| name | 发到后台文件参数名 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| method | 设置上传的请求类型 | "POST" \| "PUT" | "POST" \| "PUT" | - |
| headers | 设置上传的请求头部 | Record\<string, string> | - | - |
| withCredentials | 上传请求时是否携带 cookie | boolean | true \| false | - |
| timeout | 设置上传请求超时时间 | number | - | - |
| showUploadList | 是否展示 uploadList, 仅在 type === 'default' 和 type === 'pictureCard' 时有效 | boolean | true \| false | - |
| multiple | 是否支持多选文件 | boolean | true \| false | - |
| defaultFileList | 默认已上传文件列表 | UploadFileItem\[] | - | - |
| fileList | 已上传文件列表（受控） | UploadFileItem\[] | - | - |
| loading | 文件上传按钮是否 loading，为 true 时按钮不可点击。仅在 type='default' 时有效 | boolean | true \| false | - |
| avatarOptions | 头像裁切配置项（透传扩展后的 react-cropper props） | AvatarOptions | - | - |
| photoSize | 设置上传按钮大小,仅在 type === 'photo' 时有效 | UploadPhotoSizeEnum | "md" \| "lg" \| "sm" | - |
| preview | 预览透传 props | Omit\<PreviewProps, "visible" \| "src"> | Omit\<PreviewProps, "visible" \| "src"> | - |
| beforeUpload | 上传文件前的钩子，返回 true 继续上传，其他终止上传 | ((file: UploadFileItem, fileList: UploadFileItem\[]) => boolean) | - | - |
| customUpload | 自定义上传，此时不会再触发 onChange，所有上传逻辑转移到该函数 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| onChange | 上传请求成功后回调 | ((file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], response: object) => boolean \| void \| Promise\<boolean> | - |
| onRemove | 删除上传的文件 | ((file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean>) | (file: UploadFileItem, fileList: UploadFileItem\[], index: number) => boolean \| Promise\<boolean> | - |
| onDownload | 点击已上传的文件时的回调 | ((file: UploadFileItem) => void) | - | - |
| actionRender | 操作区自定义渲染，暂仅在 type="default" 下有效 | ((props: ActionRenderProps) => ReactNode) | - | - |


## Type

### UploadFileItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------- | ------------ | ------ | --------------------------------- | ------ |
| fileId | 上传文件 id | string | - | - |
| fileType | 文件类型 | string | - | - |
| name | 文件名 | string | - | - |
| uploadState | 上传文件状态 | string | 'success' \| 'loading' \| 'error' | - |
| url | 上传文件地址 | string | - | - |

### avatarOptions

avatarOptions 扩展了 react-cropper 的 props，添加了 `outputWidth` 和 `outputHeight` 两个额外属性。更多 props 参考以下文档：

- [ReactCropperProps](https://github.com/react-cropper/react-cropper#readme)
- [cropperjs v1 Options](https://github.com/fengyuanchen/cropperjs/blob/v1/README.md#options)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------ | -------------------------------------------------------- | ------ | -------------------------- | ------ |
| aspectRatio | 定义裁剪框的固定宽高比（默认情况下，裁剪框具有自由比例） | number | - | - |
| dragMode | 定义裁剪器的拖拽模式 | string | 'crop' \| 'move' \| 'none' | 'crop' |
| outputWidth | 裁剪后生成的图片宽度 | number | - | - |
| outputHeight | 裁剪后生成的图片高度 | number | - | - |
