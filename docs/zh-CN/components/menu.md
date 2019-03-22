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
        id: 4
      }
    ]
    return(
      <div>
        <Menu 
          mode="horizontal" 
          activeId={'xiaomi9'} 
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
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
          groupSubMenu
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
        icon: 'internet',
        id: 1
      },
      {
        content: '小米MIX',
        icon: 'internet',
        id: 2
      },
      {
        content: '手机',
        icon: 'internet',
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
        icon: 'internet',
        id: 4
      }
    ]
    return(
      <div>
        <Menu 
          mini
          mode="vertical" 
          activeId={'xiaomi9'} 
          onClick={(id, prevId)=>console.log('-----click', id, prevId)}
          datas={datas}
        />
      </div>
    )
  }

```
:::



### Menu Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| active | 是否激活 | boolean | true / false  | false |
| defaultActive | 默认激活（当  active 存在时，此项无效 | boolean | true / false | false |
| text | 文本 | string | - | - |
| value | 文本对应的值，可为空 | - | - |
| mode | 菜单排列模式 | string | horizontal / vertical | vertical |

### Menu Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onOpen | 打开某菜单事件 | - |
| onClose | 关闭某菜单事件 | - |
