## Panel

面板

### 带有注脚

:::demo

带有注脚

```js
  render(){
    return(
      <Panel 
        title={
          <div>
            <i className="hi-icon icon-user" style={{marginRight: '5px'}}></i>
            我是标题
          </div>
        }
        footer="我是注脚"
      >
        <p>Panel content</p>
        <p>Panel content</p>
        <p>Panel content</p>
      </Panel>
    )
  }

```
:::


### 没有注脚

:::demo

没有注脚

```js
  render(){
    return(
      <Panel 
        title="我是标题"
        icon="icon-date"
      >
        <p>Panel content</p>
        <p>Panel content</p>
        <p>Panel content</p>
      </Panel>
    )
  }

```
:::


### Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值  |
| -------- | ----- | ----  | ----  |   ----  |
| icon | panel 标题 icon | string | - | 无 |
| title | panel 标题 | string <br/> Node <br/> React.Component | - | 无 |
| footer | panel 注脚  | string <br/> Node <br/> React.Component  | - | 无 |

