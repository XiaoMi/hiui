## Select 选择器

选择器是一种接收数据的容器，为用户提供选择一部分数据的能力。

### 何时使用

- 需要从大量的离散型数据中选择一部分时使用
- 备选项数量5个以上时
- 不需要将全部备选项都展示给用户时

### 类型
#### 单选

:::demo

单选

```js
constructor () {
	super()
	this.state = {
		value: '3',
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
				clearable={false}
				style={{width: '200px'}}
				list={this.state.singleList}
				value={this.state.value}
				onChange={(item) => {
					console.log('单选结果', item)
					item[0] && this.setState({value: item[0].id})
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
				list={this.state.singleList}
				searchable={true}
				onChange={(item) => {
						console.log('单选结果', item)
				}}
				dropdownRender={(item, isSelected) => {
					return (
						<React.Fragment>
							<span style={{float: 'left'}}>{item.name}</span>
							<span style={{float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
						</React.Fragment>
					)
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
					headers: {token: 'tokenXXXXXXX'},
					mode: 'cors',
					credentials: 'same-origin',
					url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
					func: (res) => {
						console.log('----', res)
						return res.data
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
		<React.Fragment>
			<Select
				mode='multiple'
				style={{width: '300px'}}
				list={this.state.multipleList}
				value={['5']}
				searchable={true}
				placeholder='请选择...'
				noFoundTip='无匹配数据'
				onChange={(item) => {
						console.log('多选结果', item)
				}}
			/>
		</React.Fragment>
	)
}
```
:::


### 单行多选

:::demo

单行多选

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
			{ name:'笔记本', id:'4' },
			{ name:'生活周边', id:'5' },
			{ name:'其它', id:'6' }
		]
	}
}

render () {
	return (
		<React.Fragment>
			<Select
				mode='multiple'
				style={{width: '300px'}}
				optionWidth={400}
				multipleMode="nowrap"
				list={this.state.multipleList}
				value={['4', '5','2','3']}
				searchable={true}
				showCheckAll={true}
				placeholder='请选择...'
				noFoundTip='无匹配数据'
				onChange={(item) => {
						console.log('多选结果', item)
				}}
			/>
		</React.Fragment>
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
				multipleMode="nowrap"
				value="1"
				origin={{
					type: 'get',
					key: 'text',
					keyword: 'xiaomi',
					url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
					func: (res) => {
						console.log('----', res)
						return res.data
					},
					error: err => console.log('error:', err)
				}}
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
| mode | 下拉框类型 | String | single \| multiple | single |
| multipleMode (1.4新增) | 多选模式，wrap会显示所有已选中项，超出换行；nowrap只显示一行，超出的以数字显示 | String | wrap \|  nowrap | wrap |
| list | 下拉框选项，一般为 {name: '', id: ''} 形式。可以加入 'disabled' 属性，表示是否禁止选择 | Array | - | - |
| origin | 异步选择配置，详见下表 | Object | - | - |
| value | 默认值被选中项，值与被选中的id相同，多个以,分割或者传递数组| String \| Number \| Array | - | - |
| showCheckAll | 是否显示全选，只对多选生效 | Boolean | true \| false | false |
| open (1.5新增) | 是否显示下拉菜单 | Boolean | true \| false | true |
| searchable | 是否可以筛选 | Boolean | true \| false | false |
| clearable | 是否可以清空 | Boolean | true \| false | true |
| autoload | origin从远端获取数据，初始时是否自动加载 | Boolean | true \| false | false |
| disabled | 禁用该下拉框 | Boolean | true \| false | false |
| placeholder | 提示信息 | String | - | 请选择 |
| noFoundTip | 没有选项时的提示 | String | - | 无内容 |
| style | 自定义样式 | Object | - | - |
| optionWidth (1.4新增) | 选项的宽度 | Number | - | 默认和select宽度一致 |


### origin Options
| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| url | 请求的url | String | - | - |
| type | 请求方法 | String | get \| post | get |
| data | post请求时的参数 | Object | - | - |
| key | 搜索关键字参数key | String | - | keyword |
| keyword | autoload为true时的默认搜索关键词 | String | - | - |
| func | 成功时的回调 | Function | - | - |
| error | 失败时的回调 | Function | - | - |
| - | 其他的一些fetch设置，如headers,credentials等 | Object | - | - |


### Select.Option Attributes
**已废弃，自定义模板使用dropdownRender**

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| name | option标签 | String | - | - |
| id | option value | String | - | - |


### Select Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 改变选项时触发函数 | (item: Object\|Array) |
