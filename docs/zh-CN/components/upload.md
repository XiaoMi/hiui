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
        tips="只能上传图片类型文件，且不超过500kb，最多上传两个文件"
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
        accept='image/jpeg'
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
      hasBorder={true}
			param={{id:'uid',channel:'youpin'}}
			name={'files[]'}
      multiple={true}
      tips='只能上传 jpg/png 文件'
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
					const _fileList = fileList.concat({
						name: files[0].name,
						fileType: 'img',
						uploadState: 'success'
					})
					this.setState({
						fileList: _fileList
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



| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 上传组件类型 | String | normal: 普通上传按钮<br/> drag: 拖拽上传<br/>  pictureCard:照片卡片上传<br/>  avatar: 头像上传（裁剪）<br/> photo:照片上传（预览）<br/> | normal |
| width | 仅对avatar生效，头像上传的裁切框尺寸,最大450 | Number | - | 200 |
| height | 仅对avatar生效，头像上传的裁切框尺寸,最大450 | Number | - | 200 |
| accept | 接收上传的文件类型,用逗号隔开的 MIME 类型列表 | String | - | - |
| maxSize |  文件大小限制，（单位：KB） | Number | - | - |
| maxCount |   可上传文件最大数量 | Number | - | - |
| buttonText | 按钮文案 | String | - | 上传 |
| buttonIcon | 按钮文案前面的图标 | String | - | upload |
| uploadAction | 必选，上传的地址 | String | - | - |
| param | 除了上传文件外的其它form参数 | Object | - | - |
| name  | 发到后台文件参数名 | String | - | file |
| disabled | 是否禁用 | Boolean | true \| false | false |
| headers | 设置上传的请求头部 | Object | - | {'Content-type': 'multipart/form-data'} |
| showUploadList | 是否展示uploadList | Boolean |  true \| false | true |
| multiple | 是否支持多选文件 | Boolean |  true \| false | false |
| defaultFileList | 带默认列表的上传 | Array[object] (object参见上面demo) | - | 无 |
| beforeUpload | 上传文件前的钩子,返回true继续上传，其他终止上传 | Function(files, fileList) | - | 一个返回true的空函数 |
| customUpload | 自定义上传，此时不会再触发onChange，所有上传逻辑转移到该函数  | Function(files) | - | - |
| onChange | 上传回调。当function返回false或者返回promise（如果promise resolve(false)）则已上传的文件列表不会展示该文件 | Function(file, fileList, response) | - | - |
| onRemove | 删除上传的文件,为false时不可删除。当function返回true或者返回promise（如果promise resolve(true)）则会在前端删除文件（可参考demo：照片墙上传）| Function(file, fileList, index)，boolean | - | 一个返回true的空函数，即前端删除 |
