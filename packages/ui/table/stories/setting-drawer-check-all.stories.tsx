import React from 'react'
import Button from '@hi-ui/button'
import Table, { SettingDrawer } from '../src'

/**
 * @title 设置抽屉-全选
 */
export const SettingDrawerCheckAll = () => {
  const [dataSource] = React.useState([
    {
      name: '小米9',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      size1: '6G+64G 幻彩蓝',
      price1: '3299.00',
      size2: '6G+64G 幻彩蓝',
      price2: '3299.00',
      size3: '6G+64G 幻彩蓝',
      price3: '3299.00',
      size4: '6G+64G 幻彩蓝',
      price4: '3299.00',
      size5: '6G+64G 幻彩蓝',
      price5: '3299.00',
      size6: '6G+64G 幻彩蓝',
      price6: '3299.00',
      size7: '6G+64G 幻彩蓝',
      price7: '3299.00',
      address: '华润五彩城店',
      stock: '29,000',
      key: 1,
    },
    {
      name: '小米9 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '1999.00',
      size1: '6G+64G 幻彩蓝',
      price1: '3299.00',
      size2: '6G+64G 幻彩蓝',
      price2: '3299.00',
      size3: '6G+64G 幻彩蓝',
      price3: '3299.00',
      size4: '6G+64G 幻彩蓝',
      price4: '3299.00',
      size5: '6G+64G 幻彩蓝',
      price5: '3299.00',
      size6: '6G+64G 幻彩蓝',
      price6: '3299.00',
      size7: '6G+64G 幻彩蓝',
      price7: '3299.00',
      address: '清河店',
      stock: '10,000',
      key: 2,
    },
    {
      name: '小米8',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '2599.00',
      size1: '6G+64G 幻彩蓝',
      price1: '3299.00',
      size2: '6G+64G 幻彩蓝',
      price2: '3299.00',
      size3: '6G+64G 幻彩蓝',
      price3: '3299.00',
      size4: '6G+64G 幻彩蓝',
      price4: '3299.00',
      size5: '6G+64G 幻彩蓝',
      price5: '3299.00',
      size6: '6G+64G 幻彩蓝',
      price6: '3299.00',
      size7: '6G+64G 幻彩蓝',
      price7: '3299.00',
      address: '双安店',
      stock: '12,000',
      key: 3,
    },
    {
      name: 'Redmi Note7',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '999.00',
      size1: '6G+64G 幻彩蓝',
      price1: '3299.00',
      size2: '6G+64G 幻彩蓝',
      price2: '3299.00',
      size3: '6G+64G 幻彩蓝',
      price3: '3299.00',
      size4: '6G+64G 幻彩蓝',
      price4: '3299.00',
      size5: '6G+64G 幻彩蓝',
      price5: '3299.00',
      size6: '6G+64G 幻彩蓝',
      price6: '3299.00',
      size7: '6G+64G 幻彩蓝',
      price7: '3299.00',
      address: '华润五彩城店',
      stock: '140,000',
      key: 4,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      size1: '6G+64G 幻彩蓝',
      price1: '3299.00',
      size2: '6G+64G 幻彩蓝',
      price2: '3299.00',
      size3: '6G+64G 幻彩蓝',
      price3: '3299.00',
      size4: '6G+64G 幻彩蓝',
      price4: '3299.00',
      size5: '6G+64G 幻彩蓝',
      price5: '3299.00',
      size6: '6G+64G 幻彩蓝',
      price6: '3299.00',
      size7: '6G+64G 幻彩蓝',
      price7: '3299.00',
      address: '双安店',
      stock: '12,000',
      key: 5,
    },
  ])

  const columnsMemo = React.useMemo(() => {
    return [
      {
        title: '商品名',
        dataKey: 'name',
        width: 150,
      },
      {
        title: '品类',
        dataKey: 'type',
        width: 150,
      },
      {
        title: '规格',
        dataKey: 'size',
        width: 150,
      },
      {
        title: '单价',
        dataKey: 'price',
        width: 150,
      },
      {
        title: '门店',
        dataKey: 'address',
        width: 150,
      },
      {
        title: '库存',
        dataKey: 'stock',
        width: 150,
      },
    ]
  }, [])

  const [columns, setColumns] = React.useState(columnsMemo)
  const [hiddenColKeys, setHiddenColKeys] = React.useState<string[]>(['price'])
  const [sortedColKeys, setSortColKeys] = React.useState<string[]>()

  const onSetColKeysChange = (
    sortedColKeys: string[],
    hiddenColKeys: string[],
    newColumns: any[]
  ) => {
    console.log('onColKeysChange', { sortedColKeys, hiddenColKeys, newColumns })

    setSortColKeys(sortedColKeys)
    setHiddenColKeys(hiddenColKeys)
    setColumns(newColumns)
  }

  const [visible, setVisible] = React.useState<boolean>(false)

  return (
    <>
      <h1>Check All for Table Setting Drawer</h1>
      <div className="table-setting-drawer-check-all__wrap" style={{ minWidth: 660 }}>
        <div style={{ marginBottom: '1em' }}>
          <Button onClick={() => setVisible(true)}>列设置抽屉</Button>
        </div>
        <Table columns={columns} data={dataSource} />
        <SettingDrawer
          visible={visible}
          showCheckAll
          onClose={() => setVisible(false)}
          drawerProps={{ width: 400, title: '表格字段设置' }}
          columns={columnsMemo}
          checkDisabledColKeys={['name', 'type']}
          // 禁用拖拽的列
          dragDisabledColKeys={['name', 'type']}
          hiddenColKeys={hiddenColKeys}
          sortedColKeys={sortedColKeys}
          onSetColKeysChange={onSetColKeysChange}
        />
      </div>
    </>
  )
}
