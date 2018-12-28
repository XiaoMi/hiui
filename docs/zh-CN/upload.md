## Upload 上传

Upload 上传

### 点击上传

:::demo

点击上传

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
				uploadType="normal"
				uploadAction= "http://10.236.91.199:3005/upload"
				headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
				buttonText="上传文件"
				param={param}
				name={'files[]'}
				onChange = {(file, fileList, response) => {
					console.log('upload callback', file, fileList, response)
				}}
				disabled={false}
			/>
		</div>
	)
}
```
:::


### 带默认列表的上传

:::demo

点击上传

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
				uploadType="normal"
				uploadAction= "http://10.236.91.199:3005/upload"
				buttonText="上传文件"
				param={param}
				name={'files[]'}
				onChange = {(file, fileList, response) => {
					console.log('upload callback', file, fileList, response)
				}}
				defaultFileList={[
					{
						name: 'a.png',
						fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
						uploadState: 'success', // 上传状态，可取值success, error
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


### 禁用状态

:::demo

禁用状态

```js
render () {
	return (
		<Upload
			uploadType="normal"
			uploadAction= "http://10.236.91.199:3005/upload"
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
			uploadAction= "http://10.236.91.199:3005/upload"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onChange = {(file, fileList, response) => {
				console.log('upload callback', file, fileList, response)
			}}
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
			uploadAction= "http://10.236.91.199:3005/upload"
			onChange = {(file, fileList, response) => {
				file.id = 'file唯一标识'
				console.log('upload callback', file, fileList, response)
			}}
			onRemove = {(file, fileList) => {
				console.log('remove callback', file, fileList)
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


### 头像上传

:::demo

头像上传

```js
render () {
	return (
		<Upload
			uploadType="avatar"
			uploadAction= "http://10.236.91.199:3005/upload"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
			onUploadSuccess = {(res) => {console.log(res,'success callback')}}
			onDeleteSuccess = {(res) => {console.log(res,'normal delete callback')}}
			param={{id:'uid',channel:'youpin'}}
			deleteParam={{
				deleteAction: 'http://10.236.91.199:3005/del',
				type: 'POST',
				hearders:{"Content-type":"application/x-www-form-urlencoded",name: 'mi'},
				param: {type:'del',id:3},
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
			uploadAction= "http://10.236.91.199:3005/upload"
			headers={{"Content-type":"application/x-www-form-urlencoded",name: 'mi'}}
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


### Upload Attributes

|参数|说明|类型|是否必填|默认值|
|-----|---|----|----|----|
|uploadType|上传类型，可取值：normal，drag，pictureCard，avatar，和photo|string|是|normal|
|accept|接收上传的文件类型|string|否|''|
|buttonText|按钮文案|string|否|上传|
|buttonIcon|按钮文案前面的图标|string|否|upload|
|uploadAction|必选，上传的地址|string|是|无|
|param|除了上传文件外的其他需参数|object|否|无|
|name|发到后台文件参数名|string|否|file|
|disabled|是否禁用|boolean|否|false|
|headers|设置上传的请求头部|object|否|{'Content-type': 'application/x-www-form-urlencoded'}|
|showUploadList|是否展示uploadList|boolean|否|true|
|multiple|是否支持多选文件|boolean|否|false|
|defaultFileList|带默认列表的上传|array[object](object参见上面demo)|否|无|
|onChange|上传回调|function(file, fileList, response)|否|无|
|onRemove|删除上传的文件,为false时不可删除。当function返回true或者返回promise（如果promise resolve(true)）则会在前端删除文件（可参考demo：照片墙上传）|function(file, fileList)，boolean|否|一个返回true的库空函数，即前端删除|
