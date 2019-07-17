## Upload 


### Normal

:::demo

Normal

```js
constructor(props) {
	super(props)
	this.state={param:{id:'uid',channel:'youpin'}}
}
render () {
	const param = this.state.param
	return (
		<div>
			<Upload
				type="normal"
				uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
				headers={{name: 'mi'}}
        tips="Only upload image type files, no more than 500kb, upload up to two files"
        maxSize={500}
        maxCount={2}
        accept='image/*'
				param={param}
				name={'files[]'}
				onChange = {(file, fileList, response) => {
					console.log('upload callback', file, fileList, response)
					// if(response&&response.status !== 200) return false // 返回 false 则该文件会从列表里删除
				}}
				disabled={false}
			/>
		</div>
	)
}
```
:::


### Default FileList

:::demo

Default FileList

```js
constructor(props) {
	super(props)
	this.state={param:{id:'uid',channel:'youpin'}}
}
render () {
	const param = this.state.param
	return (
		<div>
			<Upload
				type="normal"
				uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
				buttonText="Upload File"
        param={param}
        accept='image/jpeg'
				name={'files[]'}
				onChange = {(file, fileList, response) => {
					console.log('upload callback', file, fileList, response)
				}}
				defaultFileList={[
					{
						name: 'a.png',
						fileType: 'img',
						uploadState: 'success',
						url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
					},
					{
						name: 'b.png',
						fileType: 'img',
						uploadState: 'error',
						url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
					}
				]}
			/>
		</div>
	)
}
```
:::


### Disabled

:::demo

Disabled

```js
render () {
	return (
		<Upload
			type="normal"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			buttonText="Upload File"
			param={{id:'uid',channel:'youpin'}}
			disabled={true}
		/>
	)
}
```
:::


### Drag and drop

:::demo

Drag and drop

```js
render () {
	return (
		<Upload
			type="drag"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			headers={{name: 'mi'}}
			onChange = {(file, fileList, response) => {
				console.log('upload callback', file, fileList, response)
      }}
      hasBorder={true}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
      multiple={true}
      tips='Only images'
		/>
	)
}
```
:::


### Picture

:::demo

Picture

```js
render () {
	return (
		<Upload
			type="photo"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			onChange = {(file, fileList, response) => {
				file.id = 'file唯一标识'
				console.log('upload callback', file, fileList, response)
			}}
			onRemove = {(file, fileList, index) => {
				console.log('remove callback', file, fileList, index)
				return new Promise((resolve, reject)=>resolve(true))
			}}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
			defaultFileList={[
				{
					name: 'a.png',
					fileType: 'img',
					uploadState: 'success',
					url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
				},
				{
					name: 'b.png',
					fileType: 'img',
					uploadState: 'success',
					url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
				}
			]}
		/>
	)
}
```
:::


### Avatar

:::demo

Avatar

```js
render () {
	return (
		<Upload
			type="avatar"
			width={180}
			height={180}
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			headers={{name: 'mi'}}
			param={{id:'uid',channel:'youpin'}}
			onChange = {(file, fileList, response) => {
				console.log('upload callback', file, fileList, response)
			}}
			name='uploadAvatar'
		/>
	)
}
```
:::


### PictureCard

:::demo

PictureCard

```js
render () {
	return (
		<Upload
			type="pictureCard"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			headers={{name: 'mi'}}
			onChange = {(file, fileList, response) => {
				console.log('upload callback', file, fileList, response)
			}}
			param={{id:'uid',channel:'youpin'}}
			name="pictureCard"
		/>
	)
}
```
:::


### Customer

:::demo

Customer

```js
constructor(props) {
	super(props)
	this.state={
		fileList: [
			{
				name: 'a.png',
				fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
				uploadState: 'success' // 上传状态，可取值success, error
			},
			{
				name: 'b.png',
				fileType: 'img',
				uploadState: 'error'
			}
		]
	}
}
render () {
	const {
		fileList
	} = this.state

	return (
		<div>
			<Upload
				type="normal"
				beforeUpload={(files, fileList) => {
					console.log('---------beforeUpload', files, fileList)
					return true
				}}
				customUpload={files => {
					const _fileList = fileList.concat({
						name: files[0].name,
						fileType: 'img',
						uploadState: 'success'
					})
					this.setState({
						fileList: _fileList
					})
				}}
				fileList={fileList}
			/>
		</div>
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
