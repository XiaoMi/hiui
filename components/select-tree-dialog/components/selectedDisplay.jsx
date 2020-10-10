import React, { useMemo } from 'react'
import Cls from 'classnames'
import { SelectTreeDialogStyle } from '..'
import Icon from '../../icon'

export const SelectedDisplay = (props) => {
  const test = []

  // FIXME: TEST CODE
  for (let index = 0; index < 26; index++) {
    test.push({
      id: index,
      desc: '徐辉煌'
    })
  }

  const { desString, selectedItems = test, prefixCls, styleType } = props
  const minePrefix = useMemo(() => `${prefixCls}__pureDisplay`, [prefixCls])
  const selectedContainerClass = useMemo(
    () =>
      Cls({
        [`${minePrefix}__itemsContainer--simple`]: styleType === SelectTreeDialogStyle.SIMPLE,
        [`${minePrefix}__itemsContainer--withBorder`]: styleType === SelectTreeDialogStyle.WITH_BORDER
      }),
    [styleType]
  )
  // 是否展示没有被选择数据的时候的文字占位符(线框风格独有)
  const isShowNoSelectedPlaceholder = useMemo(
    () => styleType === SelectTreeDialogStyle.WITH_BORDER && selectedItems.length === 0,
    [styleType, selectedItems]
  )

  const selectedItemsCom = useMemo(
    () =>
      selectedItems.map(({ id, desc }) => {
        return (
          <div key={id} className={`${minePrefix}__item`}>
            <span className={`${minePrefix}__item__desc`}>{desc}</span>
            <Icon name="close" className={`${minePrefix}__item__button`} />
          </div>
        )
      }),
    []
  )
  return (
    <div className={minePrefix}>
      <p className={`${minePrefix}__descTitle`}>{desString}</p>
      <div className={selectedContainerClass}>
        {isShowNoSelectedPlaceholder && <span className={`${minePrefix}__placeholder`}>请选择</span>}
        {selectedItemsCom}
        {styleType === SelectTreeDialogStyle.SIMPLE && (
          <div className={`${minePrefix}__addButton--simple`}>
            <Icon name="plus" className={`${minePrefix}__addButton--simple__addIcon`} />
            请选择
          </div>
        )}
        {styleType === SelectTreeDialogStyle.WITH_BORDER && (
          <div className={`${minePrefix}__addButton--withBorder`}>
            <Icon name="plus" className={`${minePrefix}__addButton--withBorder__addIcon`} />
          </div>
        )}
      </div>
    </div>
  )
}
