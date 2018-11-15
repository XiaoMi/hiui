## Progress进度条

### 进度条类型

:::demo 

Progress组件

```js
render() {
  return (
    <div>
      <Progress percent={10} withOutText/>
      <br/>
      <Progress size='middle' status='success' text='成功' percent={40}/>
      <br/>
      <Progress size='small' status='warn' text='错误' percent={50}/>
      <br/>
      <Progress size='small' status='error' text='警示' percent={100}/>
    </div>
  )
}
```
:::

### 进度条动态

:::demo 

Progress动态

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

### 环形进度条

:::demo 

环形进度条

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

### 仪表盘进度条

:::demo 

环形进度条

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
        <Progress percent={this.state.percent} type='dashBoard' radius={50}/>
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


### 进度条文字内显

:::demo 

Progress组件

```js
render() {
  return (
    <div>
      <Progress percent={20} inside height={20}/>
      <br/>
      <Progress percent={30} inside status='success' text='成功' height={20}/>
      <br/>
      <Progress percent={10} inside status='warn' height={20}/>
    </div>
  )
}
```
:::