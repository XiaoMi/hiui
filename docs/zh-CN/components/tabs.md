## Tabs 切换

切换

:::demo Tabs 切换代码说明

```js
render() {
  return (
    <div>
      <Tabs activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
        <Tabs.Pane tabName="用户管理" tabKey="1">用户管理</Tabs.Pane>
        <Tabs.Pane tabName="Tab2" tabKey="2">配置管理</Tabs.Pane>
        <Tabs.Pane tabName="Tab3" tabKey="3">角色管理</Tabs.Pane>
        <Tabs.Pane tabName="Tab4" tabKey="4">定时补偿任务</Tabs.Pane>
      </Tabs>
    </div>
  )
}
```
:::