import React from 'react'
import CheckCascader from '../src'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'

/**
 * @title 前置后置内容扩展
 */
export const Addon = () => {
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
      <h1>Addon</h1>
      <div className="cascader-addon__wrap">
        <CheckCascader
          style={{ width: 240 }}
          placeholder="请选择品类"
          changeOnSelect
          data={dataOnlyLeafCheckable}
          prefix={<AppStoreOutlined />}
          suffix={<InfoCircleOutlined style={{ marginRight: 8 }} />}
          tagInputProps={{ wrap: true }}
          onChange={console.log}
        ></CheckCascader>
      </div>
    </>
  )
}
