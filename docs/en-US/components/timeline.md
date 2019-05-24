## Timeline

### Basic

:::demo

Basic

```js
render () {
  const datas = [{
      groupTitle: 'Feb.',
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
      groupTitle: 'Mar.',
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

### Information Flow

:::demo

Information Flow

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

### Foldable

:::demo

Foldable

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

### Cross

:::demo

Cross

```js
render () {
  const datas = [{
      groupTitle: 'a.m.',
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
      groupTitle: 'p.m.',
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

### Timeline Attributes

| Attribute | Description | Type   | Options                        | Default |
| --------- | ----------- | ------ | ------------------------------ | ------- |
| layout    | layout      | String | normal <br/> right <br/> cross | normal  |
| list      | datas       | Array  | -                              | -       |

### List Options

| Attribute   | Description         | Type              | Options | Default |
| ----------- | ------------------- | ----------------- | ------- | ------- |
| title       | Display title       | String \| Element | -       | -       |
| description | Display description | String \| Element | -       | -       |
| timestamp   | Display timestamp   | String            | -       | -       |
| extraTime   | Extra show time     | String            | -       | -       |
| dot         | Custom icon         | Element           | -       | -       |

> Use group timeline, you need to combine groutTitle

```json
{
  groupTitle: 'Group Title',
  children: [{List Options}]
}
```
