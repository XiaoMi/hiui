import React from 'react'
import CheckCascader from '../src'

/**
 * @title 禁用 checkbox 级联
 * @desc 禁用后只能用于展示勾选状态，无法进行操作
 */
export const DisabledCheckboxCascaded = () => {
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
        disabledCheckboxCascaded: true,
        children: [
          {
            id: '小米电视4A',
            title: '小米电视4At',
            disabled: true,
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
          item.checkable = true
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
      <h1>DisabledCheckboxCascaded</h1>
      <div className="cascader-disabled-checkbox-cascaded__wrap">
        <CheckCascader
          style={{ width: 240 }}
          changeOnSelect={false}
          checkedMode="CHILD"
          defaultValue={[['小米电视4A']]}
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        />
      </div>
    </>
  )
}
