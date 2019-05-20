## Switch


### 基础用法

:::demo

基础用法

```js
render () {
  const datas = [{
      groupTitle: '2月',
      children: [{
        title: 'Title - 1',
        description: 'Here are some descriptions',
        timestamp: '10:00',
        extraTime: '02-23'
      }, {
        dot: 'circle',
        title: 'Title 2',
        description: 'Here are some descriptions',
        timestamp: '10:00',
        extraTime: '02-27'
      }]
    }, {
      groupTitle: '3月',
      children: [{
        dot: 'circle',
        title: 'Title 3',
        description: 'Here are some descriptions',
        timestamp: '12:00',
        extraTime: '03-02'
      }, {
        dot: 'circle',
        title: 'Title 4',
        description: 'Here are some descriptions',
        timestamp: '11:00',
        extraTime: '03-10'
      }]
    }]
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Timeline list={datas}/>
      </div>
    </div>
  )
}
```
:::

### 信息流

:::demo

基础用法

```js
render () {
  const datas = [{
        title: 'Title - 1',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 12:00:00'
      }, {
        dot: 'circle', 
        title: 'Title 2',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 14:24:00'
      },{
        dot: 'circle',
        title: 'Title 3',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 15:00:00'
      }, {
        dot: 'circle',
        title: 'Title 4',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 19:55:00'
      }]
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Timeline list={datas} layout='right'/>
      </div>
    </div>
  )
}
```
:::



### 可折叠

:::demo

可折叠

```js
render () {
  const datas = [{
        title: 'Title - 1',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 12:00:00'
      }, {
        dot: 'circle', 
        title: 'Title 2',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 14:24:00'
      },{
        dot: 'circle',
        title: 'Title 3',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 15:00:00',
        folding: true,
        children: [{
          title: 'Sub 1',
          description: 'Here are some descriptions'
        }, {
          title: 'Sub 2',
          description: 'Here are some descriptions'
        }]
      }, {
        dot: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
        title: 'Title 2-2',
        description: 'Here are some descriptions',
        timestamp: '12:00'
      }, {
        dot: 'circle',
        title: 'Title 4',
        description: 'Here are some descriptions',
        timestamp: '2019.02.24 19:55:00'
      }]
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Timeline list={datas} layout='right'/>
      </div>
    </div>
  )
}
```
:::


### 左右结构

:::demo

左右结构

```js
render () {
  const datas = [{
      groupTitle: '上午',
      children: [{
        // dot: <Icon name='circle' style={{fontSize: 16}} />,
        title: 'Title - 1',
        description: 'Here are some descriptions',
        timestamp: '9:00',
        extraTime: '02-25'
      }, {
        dot: 'circle',
        title: 'Title 1-2',
        description: 'Here are some descriptions',
        timestamp: '10:00'
      }]
    }, {
      groupTitle: '下午',
      children: [{
        dot: 'circle',
        title: 'Title 2-1',
        description: 'Here are some descriptions',
        timestamp: '12:00',
        folding: true,
        children: [{
          title: 'Sub 1',
          description: 'Here are some descriptions'
        }, {
          title: 'Sub 2',
          description: 'Here are some descriptions'
        }]
      }, {
        dot: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
        title: 'Title 2-2',
        description: 'Here are some descriptions',
        timestamp: '12:00'
      }]
    }, {
      groupTitle: 'Group 3',
      children: [{
        dot: 'circle',
        title: 'Title 3-1',
        description: 'Here are some descriptions',
        timestamp: '11:00',
        extraTime: '11-25'
      }, {
        dot: 'circle',
        title: 'Title 3-2',
        description: 'Here are some descriptions',
        timestamp: '12:00'
      }]
    }]
  return (
    <div>
      <Timeline list={datas} layout='cross'/>
    </div>
  )
}
```
:::


### Switch Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| layout |  布局形式 | String |  normal:基础布局 <br/> right:靠右布局 <br/> cross:交替布局 | normal |
| list |  数据 |  Array | - | - |


### List Options

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| title |  标题 |  String \| Element | - | - |
| description |   描述信息 |  String \| Element | - | - |
| timestamp |   时间点 |  String | - | - |
| extraTime |  额外展示时间点 |  String | - | - |
|  dot |  自定义图标 |  Element | - | - |

> 使用分组时间轴，需要结合groutTitle*

```json
{
  groupTitle: '分组标题',
  children: [{List Options}]
}
```


