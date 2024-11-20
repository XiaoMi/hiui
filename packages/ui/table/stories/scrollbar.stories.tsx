import React from 'react'
import Table from '../src'

/**
 * @title 设置滚动条
 * @desc 解决Windows环境下滚动条样式不美观问题
 */
export const Scrollbar = () => {
  const [column] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
      width: 120,
    },
    {
      title: '品类',
      dataKey: 'type',
      width: 80,
      fixed: true,
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
      title: '规格',
      dataKey: 'size1',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price1',
      width: 150,
    },
    {
      title: '规格',
      dataKey: 'size2',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price2',
      width: 150,
    },
    {
      title: '规格',
      dataKey: 'size3',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price3',
      width: 150,
    },
    {
      title: '规格',
      dataKey: 'size4',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price4',
      width: 150,
    },

    {
      title: '规格',
      dataKey: 'size5',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price5',
      width: 150,
    },
    {
      title: '规格',
      dataKey: 'size6',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price6',
      width: 150,
    },

    {
      title: '规格',
      dataKey: 'size7',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price7',
      width: 150,
    },
    {
      title: '门店',
      dataKey: 'address',
      width: 150,
      fixed: true,
    },
    {
      title: '库存',
      dataKey: 'stock',
      width: 150,
    },
  ])
  const [data] = React.useState([
    {
      name: '小米9',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      price1: '3299.00',
      price2: '3299.00',
      price3: '3299.00',
      price4: '3299.00',
      price5: '3299.00',
      price6: '3299.00',
      price7: '1999.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '华润五彩城店',
      stock: '29,000',
      key: 1,
    },
    {
      name: '小米9 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '1999.00',
      price1: '1999.00',
      price2: '1999.00',
      price3: '1999.00',
      price4: '1999.00',
      price5: '1999.00',
      price6: '1999.00',
      price7: '1999.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '清河店',
      stock: '10,000',
      key: 2,
    },
    {
      name: '小米8',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '2599.00',
      price1: '2599.00',
      price2: '2599.00',
      price3: '2599.00',
      price4: '2599.00',
      price5: '2599.00',
      price6: '2599.00',
      price7: '2599.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 3,
    },
    {
      name: 'Redmi Note7',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '999.00',
      price1: '999.00',
      price2: '999.00',
      price3: '999.00',
      price4: '999.00',
      price5: '999.00',
      price6: '999.00',
      price7: '999.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '华润五彩城店',
      stock: '140,000',
      key: 4,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 5,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 6,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 7,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 8,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 9,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      price1: '699.00',
      price2: '699.00',
      price3: '699.00',
      price4: '699.00',
      price5: '699.00',
      price6: '699.00',
      price7: '699.00',
      size1: '6G+64G 幻彩蓝',
      size2: '6G+64G 幻彩蓝',
      size3: '6G+64G 幻彩蓝',
      size4: '6G+64G 幻彩蓝',
      size5: '6G+64G 幻彩蓝',
      size6: '6G+64G 幻彩蓝',
      size7: '6G+64G 幻彩蓝',
      address: '双安店',
      stock: '12,000',
      key: 10,
    },
  ])

  const scrollbarInnerRef = React.useRef<any>(null)
  const update = () => scrollbarInnerRef.current?.update?.()

  // 在外部滚动时更新 Scrollbar 滚动条的位置
  // 该处理是针对 scrollbarXStickToBottom 参数为 true 的情况，让滚动条始终保持在底部，详见 Scrollbar 组件文档
  React.useEffect(() => {
    document.addEventListener('scroll', update)

    return () => {
      document.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <>
      <h1>Scrollbar for Table</h1>
      <div className="table-scrollbar__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table
          fixedToColumn={{ left: 'type', right: 'address' }}
          columns={column}
          data={data}
          maxHeight={300}
          scrollbar={
            // 根据需要进行以下配置
            {
              // 保持滚动条始终可见
              keepVisible: true,
              innerRef: scrollbarInnerRef,
              // 设置滚动条的 z-index 值
              zIndex: 9,
              settings: {
                // 垂直滑动时，让横向滚动条一直显示在容器底部
                scrollbarXStickToBottom: true,
                // 横向滚动条距离底部的距离
                scrollbarXStickToBottomGap: 20,
              },
            }
          }
        />
      </div>
    </>
  )
}
