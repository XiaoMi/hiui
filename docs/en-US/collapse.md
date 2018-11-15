## Collapse

### Default active

:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('changed');}} 
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

### Accordion
:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('changed');}} 
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

### No footers
:::demo

```js
  render(){
    return(
      <Collapse 
        onChange={()=>{console.log('changed');}} 
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

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ---- | ---- | ---- |
| accordion | Accordion mode |  bool | true, false | false|
| onChange | Callback | function | - | 无 |
| activeKey | Default active | string, string[] | - | 无 |
| type | Collapse type | string | default, simple | default |
| arrow | Arrow position | string | left, right, none | left |


###  Collapse Attributes

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ---- | ---- | ---- |
| key | key |  string | - | index |
| header | header | string <br/> Node <br/> React.Component | - | null |
| disabled | disabled | bool | - | false |
