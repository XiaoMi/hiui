## Panel

### Footers

:::demo

```js
  render(){
    return(
      <Panel 
        title={
          <div>
            <i className="hi-icon icon-user" style={{marginRight: '5px'}}></i>
            Title
          </div>
        }
        footer="Footers"
      >
        <p>Panel content</p>
        <p>Panel content</p>
        <p>Panel content</p>
      </Panel>
    )
  }

```
:::


### No Footers

:::demo


```js
  render(){
    return(
      <Panel 
        title="Title"
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

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ----  | ----  |   ----  |
| icon | panel title icon | string | - | null |
| title | panel title | string <br/> Node <br/> React.Component | - | null |
| footer | panel footer  | string <br/> Node <br/> React.Component  | - | null |

