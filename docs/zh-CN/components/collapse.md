## Collapse

折叠面板

### 默认激活

:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('切换了！');}} 
        activeKey='2' 
        arrow="left"
      >
        <Collapse.Panel
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }

```
:::

### 手风琴模式
:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('切换了！');}} 
        accordion={true} 
        arrow="right"
      >
        <Collapse.Panel
          disabled={true}
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }

```
:::

### 无底部灰底
:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('切换了！');}} 
        accordion={true} 
        type="simple"
        arrow="right"
      >
        <Collapse.Panel
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }

```
:::

###  Collapse Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| accordion | 手风琴模式 |  Boolean | true \| false | false（不激活） |
| onChange | 切换回调 | Function | - | 无 |
| activeKey | 默认激活的面板 | String \| String[] | - | - |
| type | collapse 类型 | String | default \| simple | default |
| arrow | 箭头所在位置 | String | left \| right \| none | left |


###  Collapse Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| key | 面板唯一标识 |  String | - | index |
| header | 面板头部 | String \| Element | - | - |
| disabled | 面板是否可点击 | Boolean | - | false |
