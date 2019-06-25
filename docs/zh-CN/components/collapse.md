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

### Props

**_Collapse_**

| 参数      | 说明           | 类型                | 可选值                | 默认值  |
| --------- | -------------- | ------------------- | --------------------- | ------- |
| accordion | 手风琴模式     | boolean             | true \| false         | false   |
| onChange  | 切换回调       | (id:string) => void | -                     | 无      |
| activeId  | 默认激活的面板 | string \| string[]  | -                     | -       |
| type      | collapse 类型  | string              | default \| simple     | default |
| arrow     | 箭头所在位置   | string              | left \| right \| none | left    |

**_Collapse.Panel_**

| 参数     | 说明           | 类型                | 可选值 | 默认值 |
| -------- | -------------- | ------------------- | ------ | ------ |
| id       | 面板唯一标识   | string              | -      | -      |
| title    | 面板标题       | string \| ReactNode | -      | -      |
| disabled | 面板是否可点击 | Boolean             | -      | false  |
