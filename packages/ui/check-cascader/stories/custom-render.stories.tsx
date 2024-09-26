import React from 'react'
import CheckCascader from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义触发器
 */
export const CusotmRender = () => {
  const [dataOnlyLeafCheckable] = React.useState(() => {
    const data = [
      {
        id: '手机',
        title: '手机t',
        children: [
          {
            id: '小米',
            title: '小米t',
            children: [
              {
                id: '小米3',
                title: '小米3t',
              },
              {
                id: '小米4',
                title: '小米4t',
              },
            ],
          },
          {
            id: '红米',
            title: '红米t',
            children: [
              {
                id: '红米3',
                title: '红米3t',
              },
              {
                id: '红米4',
                title: '红米4t',
              },
            ],
          },
        ],
      },
      {
        id: '电视',
        title: '电视t',
        children: [
          {
            id: '小米电视4A',
            title: '小米电视4At',
          },
          {
            id: '小米电视4C',
            title: '小米电视4Ct',
          },
        ],
      },
    ]

    const getDataOnlyLeafCheckable = (data: any) => {
      return data.map((item: any) => {
        if (item.children) {
          item.checkable = item.checkable ?? false
          item.children = getDataOnlyLeafCheckable(item.children)
        }

        return item
      })
    }

    const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

    return dataOnlyLeafCheckable
  })

  return (
    <>
      <h1>CusotmRender</h1>
      <div className="check-cascader-custom-render__wrap">
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          placeholder="请选择品类"
          changeOnSelect
          data={dataOnlyLeafCheckable}
          onChange={console.log}
          customRender={(data) => {
            let value = ''
            if (data) {
              value = data?.map((item) => item?.title).join(',')
            }
            return <Input value={!value ? '' : value} placeholder="请选择" />
          }}
        ></CheckCascader>
      </div>
    </>
  )
}
