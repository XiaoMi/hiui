## Menu

### 水平排列

:::demo

水平排列

```js
  render(){
    const datas = [
      {
        content: '电视',
        id: 1,
        icon: 'internet'
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        children: [
          {
            content: '小米',
            icon: 'phone',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8',
                disabled: true
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            id: 'hongmi'
          },
          {
            content: '小米note',
            disabled: true,
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          mode="horizontal"
          activeId={'xiaomi9'}
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          onClickSubMenu={index => console.log('-----onClickSubMenu', index)}
          datas={datas}
        />
      </div>
    )
  }

```

:::

### 胖菜单

:::demo

胖菜单

```js
  render(){
    const datas = [
      {
        content: '电视',
        id: 1,
        icon: 'internet'
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        icon: 'phone',
        children: [
          {
            content: '小米',
            icon: 'phone',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8'
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            children: [
              {
                content: '红米 7',
                id: 'hongmi 7'
              },
              {
                content: '红米 6',
                id: 'hongmi 6'
              },
              {
                content: '红米 5',
                id: 'hongmi 5'
              },
              {
                content: '红米 4',
                id: 'hongmi 4'
              },
              {
                content: '红米 3',
                id: 'hongmi 3'
              }
            ]
          },
          {
            content: '小米note',
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          mode="horizontal"
          activeId={'xiaomi9'}
          fatMenu
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          datas={datas}
        />
      </div>
    )
  }

```

:::

### 竖向展开菜单

:::demo

竖向展开菜单

```js
  render(){
    const datas = [
      {
        content: '电视',
        icon: 'internet',
        id: 1
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        icon: 'phone',
        children: [
          {
            content: '小米',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8'
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            icon: 'phone',
            id: 'hongmi'
          },
          {
            content: '小米note',
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          mode="vertical"
          activeId={'xiaomi9'}
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          onClickSubMenu={index => console.log('-----onClickSubMenu', index)}
          datas={datas}
        />
      </div>
    )
  }

```

:::

### 非手风琴菜单

:::demo

非手风琴菜单

```js
  render(){
    const datas = [
      {
        content: '电视',
        icon: 'internet',
        id: 1
      },
      {
        content: '小米MIX',
        id: 2
      },
      {
        content: '手机',
        icon: 'phone',
        children: [
          {
            content: '小米',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8'
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            icon: 'phone',
            id: 'hongmi'
          },
          {
            content: '小米note',
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          accordion={false}
          mode="vertical"
          activeId={'xiaomi9'}
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          onClickSubMenu={index => console.log('-----onClickSubMenu', index)}
          datas={datas}
        />
      </div>
    )
  }

```

:::

### 竖向收起菜单

:::demo

竖向收起菜单

```js
  render(){
    const datas = [
      {
        content: '电视',
        icon: 'alarm',
        id: 1
      },
      {
        content: '小米MIX',
        icon: 'internet',
        id: 2
      },
      {
        content: '手机',
        icon: 'phone',
        children: [
          {
            content: '小米',
            children: [
              {
                content: '小米9',
                id: 'xiaomi9'
              },
              {
                content: '小米8',
                id: 'xiaomi8'
              },
              {
                content: '小米7',
                id: 'xiaomi7'
              },
              {
                content: '小米6',
                id: 'xiaomi6'
              },
              {
                content: '小米5',
                id: 'xiaomi5'
              },
              {
                content: '小米4',
                id: 'xiaomi4'
              },
              {
                content: '小米3',
                id: 'xiaomi3'
              }
            ]
          },
          {
            content: '红米',
            id: 'hongmi'
          },
          {
            content: '小米note',
            children: [
              {
                content: '小米 note7',
                id: 'xiaomi note7'
              },
              {
                content: '小米 note6',
                id: 'xiaomi note6'
              },
              {
                content: '小米 note5',
                id: 'xiaomi note5'
              },
              {
                content: '小米 note4',
                id: 'xiaomi note4'
              },
              {
                content: '小米 note3',
                id: 'xiaomi note3'
              }
            ]
          }
        ]
      },
      {
        content: '超长超长超长字符超长超长超长字符',
        icon: 'document',
        id: 4
      }
    ]
    return(
      <div>
        <Menu
          mini
          miniToggle={true}
          mode="vertical"
          activeId={'xiaomi9'}
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          onMiniChange={toggle => console.log('-----onMiniChange', toggle)}
          onClickSubMenu={index => console.log('-----onClickSubMenu', index)}
          datas={datas}
        />
      </div>
    )
  }

```

:::

### Props

| 参数            | 说明                         | 类型                             | 可选值                 | 默认值   |
| --------------- | ---------------------------- | -------------------------------- | ---------------------- | -------- |
| data            | 菜单选项                     | DataItem []                      | -                      | -        |
| activeId        | 激活的菜单 id                | string                           | -                      | -        |
| placement       | 菜单位置                     | string                           | horizontal \| vertical | vertical |
| collapsed       | 垂直菜单时，是否收起         | boolean                          | true \| false          | false    |
| showCollpse     | 垂直菜单时，是否显示收缩开关 | boolean                          | true \| false          | true     |
| showAllSubMenus | 所有子菜单一起展示           | boolean                          | true \| false          | false    |
| accordion       | 手风琴模式，水平时生效       | boolean                          | true \| false          | true     |
| onClick         | 点击菜单选项触发的回调       | function(activeId, prevActiveId) | -                      | -        |
| onClickSubMenu  | 点击父菜单选项触发的回调     | function(subMenuIndexs)          | -                      | -        |
| onCollapse      | 点击收缩开关触发的回调       | (collapsed:boolean) => void      | -                      | -        |

### Type

**_DataItem_**

| 参数     | 说明                                               | 类型                | 可选值        | 默认值 |
| -------- | -------------------------------------------------- | ------------------- | ------------- | ------ |
| content  | 菜单选项标题                                       | string \| ReactNode | -             | -      |
| icon     | 菜单选项 icon，为 string 时会作文 Icon 组件的 name | string \| ReactNode | -             | -      |
| id       | 菜单选项唯一标识                                   | string \| number    | -             | -      |
| disabled | 菜单选项是否禁止                                   | boolean             | true \| false | false  |
| children | 字菜单选项配置                                     | DataItem []         | -             | -      |
