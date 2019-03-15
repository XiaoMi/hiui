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
				type="normal"
				uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
				headers={{name: 'mi'}}
				buttonText="上传文件"
				param={param}
				name={'files[]'}
				onChange = {(file, fileList, response) => {
					console.log('upload callback', file, fileList, response)
					if(response&&response.status !== 200) return false
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
				type="normal"
				uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
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
			type="normal"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
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
			type="drag"
			uploadAction= "https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/upload"
			headers={{name: 'mi'}}
			onChange = {(file, fileList, response) => {
				console.log('upload callback', file, fileList, response)
			}}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
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


### 头像上传

:::demo

头像上传

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


### 照片卡片

:::demo

照片卡片

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


### 自定义上传

:::demo

自定义上传

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
					fileList.push({
						name: files[0].name,
						fileType: 'img',
						uploadState: 'success'
					})
					this.setState({
						fileList
					})
				}}
				buttonText="上传文件"
				defaultFileList={fileList}
			/>
		</div>
	)
}
```
:::

### Upload Attributes

|参数|说明|类型|是否必填|默认值|
|-----|---|----|----|----|
|type|上传类型，可取值：normal，drag，pictureCard，avatar，和photo|string|是|normal|
|width, height|仅对avatar生效，头像上传的裁切框尺寸，最大450x450|number|否|200x200|
|accept|接收上传的文件类型|string|否|''|
|buttonText|按钮文案|string|否|上传|
|buttonIcon|按钮文案前面的图标|string|否|upload|
|uploadAction|必选，上传的地址|string|是|无|
|param|除了上传文件外的其他需参数|object|否|无|
|name|发到后台文件参数名|string|否|file|
|disabled|是否禁用|boolean|否|false|
|headers|设置上传的请求头部|object|否|{'Content-type': 'multipart/form-data'}|
|showUploadList|是否展示uploadList|boolean|否|true|
|multiple|是否支持多选文件|boolean|否|false|
|defaultFileList|带默认列表的上传|array[object] (object参见上面demo)|否|无|
|beforeUpload|上传文件前的钩子,返回true继续上传，其他终止上传|function(files, fileList)|否|一个返回true的空函数|
|customUpload|自定义上传，此时不会再触发onChange，所有上传逻辑由用户完全控制|function(files)|否|-|
|onChange|上传回调。当function返回false或者返回promise（如果promise resolve(false)）则已上传的文件列表不会展示该文件|function(file, fileList, response)|否|无|
|onRemove|删除上传的文件,为false时不可删除。当function返回true或者返回promise（如果promise resolve(true)）则会在前端删除文件（可参考demo：照片墙上传）|function(file, fileList, index)，boolean|否|一个返回true的空函数，即前端删除|
