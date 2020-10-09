import React, { useMemo } from 'react'

export const SelectedDisplay = (props) => {
  const test = [
    {
      id: '1',
      desc: '张涛'
    },
    {
      id: '2',
      desc: '李想'
    }
  ]

  const { desString, selectedItems = test, prefixCls } = props

  const selectedItemsCom = useMemo(
    () =>
      selectedItems.map(({ id, desc }) => {
        return <span key={id}>{desc}</span>
      }),
    []
  )
  return (
    <div className={`${prefixCls}__display-part`}>
      <p>{desString}</p>
      <div>{selectedItemsCom}</div>
    </div>
  )
}
