import React, { useMemo } from 'react'
import Cls from 'classnames'
import { SelectTreeDialogStyle } from '..'
import Icon from '../../icon'

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

  const { desString, selectedItems = test, prefixCls, styleType } = props
  const minePrefix = useMemo(() => `${prefixCls}__pureDisplay`, [prefixCls])
  const selectedContainerClass = useMemo(
    () =>
      Cls({
        [`${minePrefix}__itemsContainer--simple`]: styleType === SelectTreeDialogStyle.SIMPLE
      }),
    [styleType]
  )
  const selectedItemsCom = useMemo(
    () =>
      selectedItems.map(({ id, desc }) => {
        return (
          <div key={id} className={`${minePrefix}__itemsContainer__item`}>
            <span className={`${minePrefix}__itemsContainer__item__desc`}>{desc}</span>
            <Icon name="close" className={`${minePrefix}__itemsContainer__item__button`} />
          </div>
        )
      }),
    []
  )
  return (
    <div className={minePrefix}>
      <p className={`${minePrefix}__descTitle`}>{desString}</p>
      <div className={selectedContainerClass}>{selectedItemsCom}</div>
    </div>
  )
}
