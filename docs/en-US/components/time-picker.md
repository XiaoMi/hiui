## TimePicker

### Basis

:::demo 

```js
render() {
  return (
    <div style={{display:'flex', flexWrap: 'wrap'}}>
      <div style={{margin: '10px'}}>
        <p>Time Picker</p>
        <TimePicker
          onChange={date => console.log('time', date)}
        />
      </div>
    </div>
  )
}
```
:::


### Events

| Attribute| Description   | Parameters | 
| -------- | ----- | ---- | 
| onChange | callback when selected | (date: Date) |