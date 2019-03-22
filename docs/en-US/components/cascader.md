## Cascader

### Basic

:::demo

Basic

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::



### Disable

:::demo

disable

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          disabled={true}
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::


### Disable Option

:::demo

Disable Option

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3',
                  disabled: true
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              disabled: true,
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::


### Instant change

:::demo

Instant change

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          changeOnSelect={true}
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::



### No emptying

:::demo

No emptying

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          clearable={false}
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::




### Custom field name

:::demo

Custom field name

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          goodsId: 'Phone',
          goodsName: 'Phone',
          subGoods: [
            {
              goodsId: 'XiaoMi',
              goodsName: 'XiaoMi',
              subGoods: [
                {
                  goodsId: 'XiaoMi 3',
                  goodsName: 'XiaoMi 3'
                },
                {
                  goodsId: 'XiaoMi 4',
                  goodsName: 'XiaoMi 4'
                },
              ]
            },
            {
              goodsId: 'RedMi',
              goodsName: 'RedMi',
              subGoods: [
                {
                  goodsId: 'RedMi 3',
                  goodsName: 'RedMi 3'
                },
                {
                  goodsId: 'RedMi 4',
                  goodsName: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          goodsId: 'TV',
          goodsName: 'TV',
          subGoods: [
            {
              goodsId: 'XiaoMi TV4A',
              goodsName: 'XiaoMi TV4A'
            },
            {
              goodsId: 'XiaoMi TV4C',
              goodsName: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          fieldNames={{
            label: 'goodsName',
            value: 'goodsId',
            children: 'subGoods',
          }}
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::



### Default Value

:::demo

Default Value

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          value={['Phone', 'RedMi', 'RedMi 4']}
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::



### Custom display

:::demo

Custom display

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '220px'}}
          displayRender={values => {
            return values.join(' > ')
          }}
        />
      </div>
    )
  }

```
:::



### Search

:::demo

Search

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi1',
                  label: 'XiaoMi1'
                },
                {
                  value: 'XiaoMi2',
                  label: 'XiaoMi2',
                  disabled: true
                },
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
                {
                  value: 'XiaoMi5',
                  label: 'XiaoMi5'
                },
                {
                  value: 'XiaoMi6',
                  label: 'XiaoMi6'
                },
                {
                  value: 'XiaoMi7',
                  label: 'XiaoMi7'
                },
                {
                  value: 'XiaoMi8',
                  label: 'XiaoMi8'
                }
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              disabled: true,
              children: [
                {
                  value: 'RedMi1',
                  label: 'RedMi1'
                },
                {
                  value: 'RedMi2',
                  label: 'RedMi2'
                },
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A 55寸 1GB+4GB RAM 64-bit quad-core processor'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            },
            {
              value: 'XiaoMi TV4X',
              label: 'XiaoMi TV4X'
            },
            {
              value: 'XiaoMi TV4',
              label: 'XiaoMi TV4'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          noFoundTip="No related content found"
          searchable={true}
          options={this.state.options} 
          style={{width: '220px'}}
        />
      </div>
    )
  }

```
:::




### Dynamic loading

:::demo

Dynamic loading

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: 'Phone',
          label: 'Phone',
          children: [
            {
              value: 'XiaoMi',
              label: 'XiaoMi',
              children: [
                {
                  value: 'XiaoMi1',
                  label: 'XiaoMi1'
                },
                {
                  value: 'XiaoMi2',
                  label: 'XiaoMi2',
                  disabled: true
                },
                {
                  value: 'XiaoMi 3',
                  label: 'XiaoMi 3'
                },
                {
                  value: 'XiaoMi 4',
                  label: 'XiaoMi 4'
                },
                {
                  value: 'XiaoMi5',
                  label: 'XiaoMi5'
                },
                {
                  value: 'XiaoMi6',
                  label: 'XiaoMi6'
                },
                {
                  value: 'XiaoMi7',
                  label: 'XiaoMi7'
                },
                {
                  value: 'XiaoMi8',
                  label: 'XiaoMi8'
                }
              ]
            },
            {
              value: 'RedMi',
              label: 'RedMi',
              children: [
                {
                  value: 'RedMi1',
                  label: 'RedMi1'
                },
                {
                  value: 'RedMi2',
                  label: 'RedMi2'
                },
                {
                  value: 'RedMi 3',
                  label: 'RedMi 3'
                },
                {
                  value: 'RedMi 4',
                  label: 'RedMi 4'
                }
              ]
            }
          ]
        },
        {
          value: 'TV',
          label: 'TV',
          children: [
            {
              value: 'XiaoMi TV4A',
              label: 'XiaoMi TV4A'
            },
            {
              value: 'XiaoMi TV4C',
              label: 'XiaoMi TV4C'
            },
            {
              value: 'XiaoMi TV4X',
              label: 'XiaoMi TV4X'
            },
            {
              value: 'XiaoMi TV4',
              label: 'XiaoMi TV4'
            }
          ]
        },
        {
          value: 'mix',
          label: 'Mix',
          children: []
        }
      ]
    }
  }
  render(){
    return(
      <div>
        <Cascader 
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '220px'}}
          onActiveItemChange={values=>{
            if(values[0] == 'mix') {
              setTimeout(()=>{
                this.state.options[2].children = [
                  {
                    value: 'mix1',
                    label: 'Mix1'
                  },{
                    value: 'mix2',
                    label: 'Mix2'
                  },{
                    value: 'mix3',
                    label: 'Mix3'
                  }
                ]
                this.forceUpdate()
              }, 1000)
            }
          }}
        />
      </div>
    )
  }

```
:::



### Cascader Attributes

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| options | data source | array | -  | - |
| value | default value | array | - | [] |
| fieldNames | customize options : label,value,children | object | - | {label:'label', value:'value', children:'children'} |
| searchable | searchable | bool | true, false | false |
| clearable | clearable | bool | true, false | true |
| disabled | disabled | bool | true, false | false |
| changeOnSelect | instant change | bool | true, false | false |
| placeholder | placeholder | string | - | please select |
| noFoundTip | no result tips | string | - | no result |
| className | customize class | string | - | - |
| style | customize style | object | - | - |
| displayRender | customize selected tabs | function | - | - |

### Cascader Events

| Attribute | Description | Callback params
| -------- | ----- | ---- |
| onChange | selected callback | selected values |
| onActiveItemChange | Callback when the parent option changes | selected values |
