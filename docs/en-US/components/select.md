## Select


### Single selection

:::demo

Single selection

```js
constructor () {
	super()
	this.state = {
		singleList: [
			{ name:'Phone', id:'2' },
			{ name:'TV', id:'3', disabled: true },
			{ name:'Laptop', id:'4', disabled: true },
			{ name:'Daily necessities', id:'5' },
			{ name:'Office', id:'6' },
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
				placeholder='Please Select'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
			{ name:'Phone', id:'2' },
			{ name:'TV', id:'3', disabled: true },
			{ name:'Laptop', id:'4', disabled: true },
			{ name:'Daily necessities', id:'5' },
			{ name:'Office', id:'6' },
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
				placeholder='Please Select'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
			{ name:'Longer description text', label: 'Longer description text', id:'2' },
			{ name:'Phone', label: 'tanke', id:'3' },
			{ name:'Laptop', label: 'chaojitanke', id:'4', disabled: true },
			{ name:'Daily necessities', label: 'wurenji', id:'5' },
			{ name:'Office', label: 'huojian', id:'6' },
		]
	}
}

render () {
	return (
		<div>
			<Select
				mode='label'
				list={this.state.singleList}
				placeholder='Please Select...'
				style={{width: '200px'}}
				value={'3'}
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
				placeholder='Please Select...'
				style={{width: '200px'}}
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
			{ name:'Phone', id:'2' },
			{ name:'TV', id:'3', disabled: true },
			{ name:'Laptop', id:'4'},
			{ name:'Daily necessities', id:'5' },
			{ name:'Office', id:'6' },
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
				placeholder='Please Select...'
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
				placeholder='Please...'
				onChange={(item, changedItem) => {
						console.log('Result', item, changedItem)
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
| open (1.5 added) | whether to display the dropdown menu | Boolean | true \| false | true |
| disabled | disable the drop-down box | string | - | - |
| placeholder | prompt message | string | - | - |
| style | custom style | object | - | - |

### Events

| Attribute | Description | Parameters |
| -------- | ----- | ---- |
| onChange | callback when changing options | (item: Object\|Array, changedItem:Object\|Array) |
