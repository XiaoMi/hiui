import React from 'react'
import Table from '../src'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 可调节列宽
 */
export const Resizable = () => {
  return (
    <>
      <h1>Resizable for Table</h1>
      <div className="table-resizable__wrap" style={{ minWidth: 660 }}>
        <Table
          fixedToColumn={{ left: 'name', right: 'stock' }}
          resizable
          // 拖拽过程中想要实现表格宽度自由拉伸，可配置该参数
          // tableWidthAdjustOnResize
          onResizeStop={(e, data, index, columnsWidth) => {
            console.log('onResizeStop', e, data, index, columnsWidth)
          }}
          columns={[
            {
              title: '商品名',
              dataKey: 'name',
              width: 120,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: <EllipsisTooltip>这是个很长的标题</EllipsisTooltip>,
              dataKey: 'type',
              width: 80,
              // 注：当 title 过长且传入的是 block 元素时，需要设置 minWidth 来保证列头最小宽度
              minWidth: 60,
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },

            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },

            {
              title: '规格',
              dataKey: 'size',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 150,
              render(text) {
                return <EllipsisTooltip>{text}</EllipsisTooltip>
              },
            },
            {
              title: '门店',
              dataKey: 'address',
              width: 150,
            },
            {
              title: '库存',
              dataKey: 'stock',
              width: 100,
              fixed: true,
            },
          ]}
          data={[
            {
              name: '小米9',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '3299.00',
              address: '华润五彩城店',
              stock: '29,000',
              key: 1,
            },
            {
              name: '小米9 SE',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '1999.00',
              address: '清河店',
              stock: '10,000',
              key: 2,
            },
            {
              name: '小米8',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '2599.00',
              address: '双安店',
              stock: '12,000',
              key: 3,
            },
            {
              name: 'Redmi Note7',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '999.00',
              address: '华润五彩城店',
              stock: '140,000',
              key: 4,
            },
            {
              name: '小米8 SE',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '699.00',
              address: '双安店',
              stock: '12,000',
              key: 5,
            },
          ]}
        />
      </div>
    </>
  )
}
