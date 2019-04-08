## Upload 


### Click to upload

:::demo

Click to upload

```js
render () {
	return (
		<Upload
			uploadType="normal"
			uploadAction= "http://10.236.94.247:3005/jvid"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			buttonText="Upload files"
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


### Disabled state

:::demo


Disabled state

```js
render () {
	return (
		<Upload
			uploadType="normal"
			uploadAction= "http://10.236.94.247:3005/jvid"
			buttonText="Upload files"
			param={{id:'uid',channel:'youpin'}}
			disabled={true}
		/>
	)
}
```
:::


### Drag and drop upload

:::demo

Drag and drop upload

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


### Photo wall upload

:::demo

Photo wall upload

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


### Avatar upload

:::demo

Avatar upload

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


### Photo card

:::demo

Photo card

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


### Attribute

|Attribute|Description|Type|Options|Default|
|-----|---|----|----|----|
|accept|allowed upload file type|string|-|-|
|limit|upload size limit|double|-|-|
|buttonText|button text|string|-|upload|
|buttonIcon|icon before button text|string|-|upload|
|uploadAction|upload url|string|-|-|
|data|additional parameters|object|-|-|
|name|file name parameter|string|-|file|
|disabled|whether to disable|boolean|-|false|
|headers|request header|object|-|-|
|showUploadList|whether to show uploadList|boolean|-|true|
|uploadType|upload type(normal/drag/pictureCard/avatar/photo)|string|-|normal|
|multiple|whether to support multiple selection|boolean|-|false|
|onUploadSuccess|callback after successful upload|function|-|-|
|onDeleteSuccess|callback after deleting the file|function|-|-|
|deleteParam|parameters of deleting the file |object(deleteAction，type，data，headers，onDeleteSuccess)|-|-|
|defaultFileList|default image list (now only supports photo wall upload)|array[object],name,url|-|-|
