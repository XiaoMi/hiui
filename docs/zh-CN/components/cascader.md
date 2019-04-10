## Cascader 级联选择

### 基础用法

:::demo

基础用法

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::



### 禁用

:::demo

禁用

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::


### 禁用选项

:::demo

禁用选项

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3',
                  disabled: true
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              disabled: true,
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::


### 选择即改变

:::demo

选择即改变

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::



### 不可清空

:::demo

不可清空

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::




### 自定义字段名

:::demo

自定义字段名

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          goodsId: '手机',
          goodsName: '手机',
          subGoods: [
            {
              goodsId: '小米',
              goodsName: '小米',
              subGoods: [
                {
                  goodsId: '小米3',
                  goodsName: '小米3'
                },
                {
                  goodsId: '小米4',
                  goodsName: '小米4'
                },
              ]
            },
            {
              goodsId: '红米',
              goodsName: '红米',
              subGoods: [
                {
                  goodsId: '红米3',
                  goodsName: '红米3'
                },
                {
                  goodsId: '红米4',
                  goodsName: '红米4'
                }
              ]
            }
          ]
        },
        {
          goodsId: '电视',
          goodsName: '电视',
          subGoods: [
            {
              goodsId: '小米电视4A',
              goodsName: '小米电视4A'
            },
            {
              goodsId: '小米电视4C',
              goodsName: '小米电视4C'
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
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::



### 默认值

:::demo

默认值

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          value={['手机', '红米', '红米4']}
          onChange={(value)=>{
            console.log('on change', value)
          }} 
          options={this.state.options} 
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::



### 自定义显示

:::demo

自定义显示

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
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
          style={{width: '240px'}}
          displayRender={values => {
            return values.join(' > ')
          }}
        />
      </div>
    )
  }

```
:::



### 搜索

:::demo

搜索

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米1',
                  label: '小米1'
                },
                {
                  value: '小米2',
                  label: '小米2',
                  disabled: true
                },
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
                {
                  value: '小米5',
                  label: '小米5'
                },
                {
                  value: '小米6',
                  label: '小米6'
                },
                {
                  value: '小米7',
                  label: '小米7'
                },
                {
                  value: '小米8',
                  label: '小米8'
                }
              ]
            },
            {
              value: '红米',
              label: '红米',
              disabled: true,
              children: [
                {
                  value: '红米1',
                  label: '红米1'
                },
                {
                  value: '红米2',
                  label: '红米2'
                },
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A 55寸 1GB+4GB大内存 64位四核处理器'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            },
            {
              value: '小米电视4X',
              label: '小米电视4X'
            },
            {
              value: '小米电视4',
              label: '小米电视4'
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
          noFoundTip="未搜索到相关内容"
          searchable={true}
          options={this.state.options} 
          style={{width: '240px'}}
        />
      </div>
    )
  }

```
:::




### 动态加载选项

:::demo

动态加载选项

```js
  constructor () {
    super()
    this.state = {
      options: [
        {
          value: '手机',
          label: '手机',
          children: [
            {
              value: '小米',
              label: '小米',
              children: [
                {
                  value: '小米1',
                  label: '小米1'
                },
                {
                  value: '小米2',
                  label: '小米2',
                  disabled: true
                },
                {
                  value: '小米3',
                  label: '小米3'
                },
                {
                  value: '小米4',
                  label: '小米4'
                },
                {
                  value: '小米5',
                  label: '小米5'
                },
                {
                  value: '小米6',
                  label: '小米6'
                },
                {
                  value: '小米7',
                  label: '小米7'
                },
                {
                  value: '小米8',
                  label: '小米8'
                }
              ]
            },
            {
              value: '红米',
              label: '红米',
              children: [
                {
                  value: '红米1',
                  label: '红米1'
                },
                {
                  value: '红米2',
                  label: '红米2'
                },
                {
                  value: '红米3',
                  label: '红米3'
                },
                {
                  value: '红米4',
                  label: '红米4'
                }
              ]
            }
          ]
        },
        {
          value: '电视',
          label: '电视',
          children: [
            {
              value: '小米电视4A',
              label: '小米电视4A'
            },
            {
              value: '小米电视4C',
              label: '小米电视4C'
            },
            {
              value: '小米电视4X',
              label: '小米电视4X'
            },
            {
              value: '小米电视4',
              label: '小米电视4'
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
          style={{width: '240px'}}
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

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| options | 可选项数据源 | Array | -  | - |
| value | 默认值 | Array | - | [] |
| fieldNames | 自定义options中label,value,children的字段 | Object | - | {label:'label', value:'value', children:'children'} |
| searchable | 是否可搜索 | Boolean | true \| false | false |
| clearable | 是否可清空 | Boolean | true \| false | true |
| disabled | 是否禁止使用 | Boolean | true \| false | false |
| changeOnSelect | 是否启用选择即改变功能 | Boolean | true \| false | false |
| placeholder | placeholder | String | - | 请选择 |
| noFoundTip | 未搜索到的提示 | String | - | 无匹配数据 |
| className | 自定义class | String | - | - |
| style | 自定义样式 | Object | - | - |
| displayRender | 自定义选中的标签展示 | Function | - | - |

### Cascader Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 选择完成后回调 | 选中的值 |
| onActiveItemChange | 父级选项变化时的回调 | 选中的值 |
