## Select 下拉框

Select 下拉框


### 单选

:::demo

单选

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


### 禁止状态

:::demo

禁止状态

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


### 选项带标签

:::demo

选项带标签

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


### 异步单选

:::demo

异步单选

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


### 多选

:::demo

多选

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


### 异步多选

:::demo

异步多选

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


### 联级

:::demo

联级

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

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| mode | 下拉框类型 | string | single,abel,multiple,cascader | single |
| list | 下拉框选项，一般为 {name: '', id: ''} 形式。mode='label'时需要加入 'label' 属性。mode='cascader'时可参考 demo。可以加入 'disabled' 属性，表示是否禁止选择 | array | - | - |
| origin | 异步选择配置，有 type / url / func 三种属性，分别代表请求类型／请求路径／请求返回后的数据处理函数 | object | - | - |
| value | 默认值被选中项，值与被选中的id相同 | string | - | - |
| disabled | 禁用该下拉框 | string | - | - |
| placeholder | 提示信息 | string | - | - |
| style | 自定义样式 | object | — | — |
| value | 联级下拉框的默认值 | array | - | - |

### Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 改变选项时触发函数 | (item: Object\|Array) |
