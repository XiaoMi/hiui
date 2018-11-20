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
			{ name:'电视', id:'3', disabled: true },
			{ name:'手机', id:'2' },
			{ name:'笔记本', id:'4', disabled: true },
			{ name:'生活周边', id:'5' },
			{ name:'办公', id:'6' },
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='single'
				list={this.state.singleList}
				style={{width: '200px'}}
				value='3'
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


### 自定义模板

:::demo

自定义模板

```js
constructor () {
	super()
	this.state = {
		singleList: [
			{ name:'平板', id:'1' },
			{ name:'较长的一段描述文本', id:'2' },
			{ name:'手机', id:'3' },
			{ name:'笔记本', id:'4', disabled: true },
			{ name:'生活周边', id:'5' },
			{ name:'生态链', id:'6' },
		]
	}
}

render () {
	return (
		<div>
			<Select
				placeholder='请选择种类'
				style={{width: '200px'}}
				value={'3'}
				searchable={true}
				onChange={(item) => {
						console.log('单选结果', item)
				}}
			>
				{
	        this.state.singleList.map(item => {
	          return (
	            <Select.Option key={item.id} name={item.name} id={item.id}>
	              <span style={{float: 'left'}}>{item.name}</span>
	              <span style={{float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
	            </Select.Option>
	          )
	        })
	      }
			</Select>
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
					url: 'http://10.236.91.218:7001/test/key',
					func: (body) => {
						console.log('----', body)
						return JSON.parse(body).data
					}
				}}
				list={[]}
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
			{ name:'小米2', id:'2-1' },
			{ name:'小米3', id:'2-2' },
			{ name:'小米4', id:'2-3' },
			{ name:'小米5', id:'2-4' },
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
				value={['4', '5']}
				searchable={true}
				placeholder='请选择...'
				noFoundTip='无匹配数据'
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
				autoload={true}
				style={{width: '300px'}}
				origin={{
					type: 'post',
					key: 'text',
					data: {
						time: new Date()
					},
					url: 'http://10.236.91.218:7001/test/key',
					func: (res) => {
						console.log('----', res)
						return res.data
					},
					error: err => console.log('error:', err)
				}}
				list={[]}
				onChange={(item) => {
					console.log('异步多选结果', item)
				}}
			/>
		</div>
	)
}
```
:::


### Select Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| mode | 下拉框类型 | string | single, multiple | single |
| list | 下拉框选项，一般为 {name: '', id: ''} 形式。可以加入 'disabled' 属性，表示是否禁止选择 | array | - | - |
| origin | 异步选择配置，详见下表 | object | - | - |
| value | 默认值被选中项，值与被选中的id相同，多个以,分割或者传递数组| string,number,array | - | - |
| searchable | 是否可以筛选 | bool | true, false | false |
| autoload | origin从远端获取数据，初始时是否自动加载 | bool | true, false | false |
| disabled | 禁用该下拉框 | bool | true, false | false |
| placeholder | 提示信息 | string | - | 请选择 |
| noFoundTip | 没有选项时的提示 | string | - | 无内容 |
| style | 自定义样式 | object | - | - |


### origin Options
| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| url | 请求的url | string | - | - |
| type | 请求方法 | string | get,post | get |
| data | post请求时的参数 | object | - | - |
| key | 搜索关键字参数key | string | - | keyword |
| func | 成功时的回调 | func | - | - |
| error | 失败时的回调 | func | - | - |


### Select.Option Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| name | option标签 | string | - | - |
| id | option value | string | - | - |


### Select Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 改变选项时触发函数 | (item: Object\|Array) |
