## Select 下拉框


### Single selection

:::demo

Single selection

```js
constructor () {
	super()
	this.state = {
		singleList: [
			{ name:'手机', id:'2' },
			{ name:'电视', id:'3', disabled: true },
			{ name:'笔记本', id:'4', disabled: true },
			{ name:'生活周边', id:'5' },
			{ name:'办公', id:'6' },
		],
		tmp: [
			{name: 'json', id: '1'},
			{name: 'js', id: '2'}
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='single'
				list={this.state.singleList}
				placeholder='请选择品类'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item) => {
						console.log('单选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Prohibited state

:::demo

Prohibited state

```js
constructor () {
	super()
	this.state = {
		singleList: [
			{ name:'手机', id:'2' },
			{ name:'电视', id:'3', disabled: true },
			{ name:'笔记本', id:'4', disabled: true },
			{ name:'生活周边', id:'5' },
			{ name:'办公', id:'6' },
		],
		tmp: [
			{name: 'json', id: '1'},
			{name: 'js', id: '2'}
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='single'
				list={this.state.singleList}
				placeholder='请选择品类'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item) => {
						console.log('单选结果', item)
				}}
				disabled
			/>
		</div>
	)
}
```
:::


### Option with label

:::demo

Option with label

```js
constructor () {
	super()
	this.state = {
		singleList: [
			{ name:'较长的一段描述文本', label: '这是一段较长的描述文本', id:'2' },
			{ name:'手机', label: 'tanke', id:'3' },
			{ name:'笔记本', label: 'chaojitanke', id:'4', disabled: true },
			{ name:'生活周边', label: 'wurenji', id:'5' },
			{ name:'生态链', label: 'huojian', id:'6' },
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='label'
				list={this.state.singleList}
				placeholder='请选择种类'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item) => {
						console.log('单选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Asynchronous single selection

:::demo

Asynchronous single selection

```js
render () {
	return (
		<div>
			<Select
				mode='single'
				origin={{
					type: 'GET',
					url: 'http://10.236.90.223:3200/test/key',
					func: (body) => {
						console.log('----', body)
						return JSON.parse(body).data
					}
				}}
				placeholder='请选择种类'
				style={{width: '200px'}}
				onChange={(item) => {
						console.log('异步单选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Multiple selection

:::demo

Multiple selection

```js
constructor () {
	super()
	this.state = {
		multipleList: [
			{ name:'手机', id:'2' },
			{ name:'电脑', id:'3' },
			{ name:'笔记本', id:'4', disabled: true },
			{ name:'生活周边', id:'5' },
			{ name:'其它', id:'6' }
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='multiple'
				style={{width: '300px'}}
				list={this.state.multipleList}
				value='4,5'
				placeholder='请选择...'
				onChange={(item) => {
						console.log('多选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Asynchronous multiple selection

:::demo

Asynchronous multiple selection

```js
render () {
	return (
		<div>
			<Select 
				mode='multiple'
				style={{width: '300px'}}
				origin={{
					type: 'GET',
					url: 'http://10.236.90.223:3200/test/key',
					func: (body) => {
						console.log('----', body)
						return JSON.parse(body).data
					}
				}}
				placeholder='请选择...'
				onChange={(item) => {
						console.log('异步多选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Cascade

:::demo

Cascade

```js
constructor () {
	super()
	this.state = {
		cascaderList: [
			{ id:'1', level: 0, name: '电视', disabled: true,
				children:[
					{ id:'11', level: 1, name: '电视4' },
					{ id:'12', level: 1, name: '电视4 32寸' },
					{ id:'13', level: 1, name: '电视4 48寸' },
					{ id:'14', level: 1, name: '电视4 60寸' }
				]
			},
			{ id:'2', level: 0, name: '手机',
				children:[
					{ id:'21', level: 1, name: '红米手机',
						children: [
							{ id: '211', level: 2, name: '红米note' },
							{ id: '212', level: 2, name: '红米note5', disabled: true }
						]
					},
					{ id:'22', level: 1, name: '小米手机' },
					{ id:'23', level: 1, name: '其它手机' }
				]
			}
		]
	}
}

render () {
	return (
		<div>
			<Select mode='cascader'
				value={[1, 12]}
				style={{width: '300px'}} 
				list={this.state.cascaderList} 
				placeholder='请选择设备型号'
				onChange={(selectList)=>{
						console.log('异步多选结果', selectList)
				}}
			/>
		</div>
	)
}
```
:::


### Attributes

| Attribute | Description | Type | Options |Default |
| -------- | ----- | ---- | ---- | ---- |
| mode | drop-down box type | string | single,abel,multiple,cascader | single |
| list | drop-down box options, typically in the form {name: '', id: ''}. The 'label' attribute is required when mode='label'. | array | - | - |
| origin | Asynchronous selection configuration, there are three types of type / url / func, respectively representing the request type / request path / data processing function after the request returns | object | - | - |
| value | the value of the selected item/default value of the union drop-down box | string | - | - |
| disabled | disable the drop-down box | string | - | - |
| placeholder | prompt message | string | - | - |
| style | custom style | object | - | - |

### Events

| Attribute | Description | Parameters |
| -------- | ----- | ---- |
| onChange | callback when changing options | (item: Object\|Array) |
