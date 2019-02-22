## Progress

### Basic

:::demo 

Progress

```js
render() {
  return (
    <div>
      <Progress percent={10} withOutText/>
      <br/>
      <Progress size='middle' status='success' text='Success' percent={40}/>
      <br/>
      <Progress size='small' status='warn' text='Error' percent={50}/>
      <br/>
      <Progress size='small' status='error' text='Warning' percent={100}/>
    </div>
  )
}
```
:::

### Dynamic

:::demo 


```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <Progress percent={this.state.percent}/>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::

### Ring

:::demo 

Ring

```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <div style={{display:'inline-block'}}>
        <Progress percent={this.state.percent} type='circle'/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='warn' text={<i className='hi-icon icon-close' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='error' text={<i className='hi-icon icon-alarm' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='success' text={<i className='hi-icon icon-check' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='success' radius={60} text={<i className='hi-icon icon-check' style={{fontSize: '25px'}}/>}/>
      </div>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::

### Dashboard

:::demo 

Dashboard

```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <div style={{display:'inline-block'}}>
        <Progress percent={this.state.percent} type='dashboard' radius={50}/>
      </div>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::


### Inner Text

:::demo 


```js
render() {
  return (
    <div>
      <Progress percent={20} inside height={20}/>
      <br/>
      <Progress percent={30} inside status='success' text='Success' height={20}/>
      <br/>
      <Progress percent={10} inside status='warn' height={20}/>
    </div>
  )
}
```
:::