### 多选

:::demo Table 表格代码说明

```js



constructor(props){
  super(props)

  this.columns = [
   
    {
      title: 'Column 1',
       dataIndex: 'name', 
       key: '1',
    },
    {
      dataIndex: 'age', 
      key: '2',
      sorter(pre,next){
        return pre.age - next.age
      }
    },
    { title: 'Column 1', dataIndex: 'address', key: '3'},
    { 
      title: ()=><div>自定义标题</div>, 
      dataIndex: 'address', key: '3',
      render(text,record,index){
      return (
        <div>
            {text} --- {index} --- 自定义渲染
        </div>
      )
    }},
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: () => <a href="javascript:;">action</a>,
    },
  ]
  
  const data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i + 1,
      name: `Don Diablo ${i}`,
      age: `${i}`,
      address: `EDC Las Vegas no. ${i}`,
    });
  }
  
  this.state =  {
     selectedRowKeys: [], // Check here to configure the default column
     data
   }
}

render() {
  const { selectedRowKeys ,data} = this.state
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys)=>{
      console.log('onchange',selectedRowKeys)
      this.setState({selectedRowKeys})
    }
  }
  return <Table2 columns={[]} data={[]} rowSelection={rowSelection} />
}
```
:::
