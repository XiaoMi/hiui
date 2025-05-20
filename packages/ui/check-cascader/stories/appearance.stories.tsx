import React from 'react'
import CheckCascader from '../src'

/**
 * @title 展现形式
 * @desc 设置展现形式
 */
export const Appearance = () => {
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
      <h1>Appearance</h1>
      <div className="cascader-appearance__wrap">
        <h2>Filled</h2>
        <CheckCascader
          style={{ width: 240 }}
          appearance="filled"
          searchable={false}
          placeholder="请选择品类"
          defaultValue={[['手机', '红米', '红米4']]}
          changeOnSelect
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        ></CheckCascader>
        <h2>Line</h2>
        <CheckCascader
          style={{ width: 240 }}
          appearance="line"
          searchable={false}
          placeholder="请选择品类"
          defaultValue={[['手机', '红米', '红米4']]}
          changeOnSelect
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        ></CheckCascader>
        <h2>Unset</h2>
        <CheckCascader
          style={{ width: 240 }}
          appearance="unset"
          searchable={false}
          placeholder="请选择品类"
          defaultValue={[['手机', '红米', '红米4']]}
          changeOnSelect
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        ></CheckCascader>
        <h2>Contained</h2>
        <CheckCascader
          style={{ width: 'auto' }}
          appearance="contained"
          searchable={false}
          label="选择品类"
          defaultValue={[['手机', '红米', '红米4']]}
          changeOnSelect
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        ></CheckCascader>
      </div>
    </>
  )
}
