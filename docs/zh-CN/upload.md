## Upload 上传

Upload 上传

### 点击上传

:::demo

点击上传

```js
render () {
	return (
		<Upload
			uploadType="normal"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			buttonText="上传文件"
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			deleteParam={{
				deleteAction: 'http://10.236.94.247:3005/del',
				type: 'POST',
				hearders:{"Content-type":"application/x-www-form-urlencoded",name: 'mi'},
				data: {type:'del',id:3},
				onDeleteSuccess: function(res) {console.log(res,'delete callback')}
			}}
			disabled={false}
		/>
	)
}
```
:::


### 禁用状态

:::demo

禁用状态

```js
render () {
	return (
		<Upload
			uploadType="normal"
			uploadAction= "http://10.236.94.247:3005/jvid"
			buttonText="上传文件"
			param={{id:'uid',channel:'youpin'}}
			disabled={true}
		/>
	)
}
```
:::


### 拖拽上传

:::demo

拖拽上传

```js
render () {
	return (
		<Upload
			uploadType="drag"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			multiple={true}
		/>
	)
}
```
:::


### 照片墙上传

:::demo

照片墙上传

```js
render () {
	return (
		<Upload
			uploadType="photo"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
			defaultFileList={[
				{
					name: 'a.png',
					url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528693612926&di=d93c60813466295d3a5189dafc960093&imgtype=0&src=http%3A%2F%2Fpic1.5442.com%2F2015%2F0604%2F10%2F09.jpg'
				},
				{
					name: 'b.png',
					url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528693593598&di=d26eeb830f40abb2664c04d0392f8ee1&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1108%2F19%2Fc1%2F8697694_8697694_1313719805021.jpg'
				}
			]}
		/>
	)
}
```
:::


### 头像上传

:::demo

头像上传

```js
render () {
	return (
		<Upload
			uploadType="avatar"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			param={{id:'uid',channel:'youpin'}}
			deleteParam={{
				deleteAction: 'http://10.236.94.247:3005/del',
				type: 'POST',
				hearders:{"Content-type":"application/x-www-form-urlencoded",name: 'mi'},
				data: {type:'del',id:3},
				onDeleteSuccess: function(res) {console.log(res,'delete callback')}
			}}
			name='uploadAvatar'
		/>
	)
}
```
:::


### 照片卡片

:::demo

照片卡片

```js
render () {
	return (
		<Upload
			uploadType="pictureCard"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			deleteParam={{
				deleteAction: 'http://10.236.94.247:3005/del',
				type: 'GET',
				hearders:{"Content-type":"application/x-www-form-urlencoded",name: 'mi'},
				data: {type:'del',id:3},
				onDeleteSuccess: function(res) {console.log(res,'delete callback')}
			}}
			param={{id:'uid',channel:'youpin'}}
			name="pictureCard"
		/>
	)
}
```
:::


### Upload Attributes

|参数|说明|类型|是否必填|默认值|
|-----|---|----|----|----|
|accept|接收上传的文件类型|string|否|无|
|limit|上传大小限制|double|否|无|
|buttonText|按钮文案|string|否|'上传'|
|buttonIcon|按钮文案前面的图标|string|否|'upload'|
|uploadAction|必选，上传的地址|string|是|无|
|data|除了上传文件外的其他需参数|object|否|无|
|name|发到后台文件参数名|string|否|'file'|
|disabled|是否禁用|boolean|否|false|
|headers|设置上传的请求头部|object|否|无|
|showUploadList|是否展示uploadList|boolean|否|true|
|uploadType|上传类型，支持三种样式 normal，drag，pictureCard，avatar，和photo|string|是|'normal'|
|multiple|是否支持多选文件|boolean|否|false|
|onUploadSuccess|上传成功后的回调|function|否|无|
|onDeleteSuccess|删除上传的文件，不删除服务器值删除前端展示，如果同时还写了deleteParam则使用deleteParam删除|function|否|无|
|deleteParam|删除照片的一些参数|object(deleteAction删除ajax地址，type删除ajax的类型，data删除的参数，headers删除ajax请求头设置，onDeleteSuccess删除成功回调)|否|无|
|defaultFileList|默认的图片列表（现在只支持照片墙上传）|array[object],name,url|否|无|
