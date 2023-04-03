import React from 'react'
import Button from '@hi-ui/button'
import Table, { SettingDrawer as TableSettingDrawer } from '../src'

/**
 * @title 设置抽屉
 */
export const SettingDrawer = () => {
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
        title: '规格1',
        dataKey: 'size1',
        width: 150,
      },
      {
        title: '单价1',
        dataKey: 'price1',
        width: 150,
      },
      {
        title: '规格2',
        dataKey: 'size2',
        width: 150,
      },
      {
        title: '单价2',
        dataKey: 'price2',
        width: 150,
      },
      {
        title: '规格3',
        dataKey: 'size3',
        width: 150,
      },
      {
        title: '单价3',
        dataKey: 'price3',
        width: 150,
      },
      {
        title: '规格4',
        dataKey: 'size4',
        width: 150,
      },
      {
        title: '单价4',
        dataKey: 'price4',
        width: 150,
      },
      {
        title: '规格5',
        dataKey: 'size5',
        width: 150,
      },
      {
        title: '单价5',
        dataKey: 'price5',
        width: 150,
      },
      {
        title: '规格6',
        dataKey: 'size6',
        width: 150,
      },
      {
        title: '单价6',
        dataKey: 'price6',
        width: 150,
      },

      {
        title: '规格7',
        dataKey: 'size7',
        width: 150,
      },
      {
        title: '单价7',
        dataKey: 'price7',
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
  const [hiddenColKeys, setHiddenColKeys] = React.useState<string[]>([])
  const [sortedColKeys, setSortColKeys] = React.useState<string[]>([])

  const onSetColKeysChange = (sortedColKeys: string[], hiddenColKeys: string[], newColumns) => {
    console.log('onColKeysChange', { sortedColKeys, hiddenColKeys, newColumns })

    setSortColKeys(sortedColKeys)
    setHiddenColKeys(hiddenColKeys)
    setColumns(newColumns)
  }

  const [visible, setVisible] = React.useState<boolean>(false)

  return (
    <>
      <h1>Setting Drawer for Table</h1>
      <div className="table-setting-drawer__wrap" style={{ minWidth: 660 }}>
        <div style={{ marginBottom: '1em' }}>
          <Button onClick={() => setVisible(true)}>打开 setting 抽屉</Button>
        </div>
        <Table columns={columns} data={dataSource} />
        <TableSettingDrawer
          visible={visible}
          onClose={() => setVisible(false)}
          drawerProps={{ width: 400, title: '字段设置' }}
          columns={columnsMemo}
          checkDisabledColKeys={['name', 'type']}
          hiddenColKeys={hiddenColKeys}
          sortedColKeys={sortedColKeys}
          onSetColKeysChange={onSetColKeysChange}
        />
      </div>
    </>
  )
}
