/**
 * 树状多选弹窗的外部已选择部分显示
 * @author xuhuihuang@xiaomi.com
 */
import React, { useMemo } from 'react'
import Cls from 'classnames'
import { SelectTreeDialogStyle } from '..'
import Icon from '../../icon'
import { SelectedItem } from './selectedItem'

export const PureDisplay = (props) => {
  const {
    desString,
    selectedItems,
    prefixCls,
    styleType,
    onAddClick = () => {} /*, onItemRemoveClick = () => {} */
  } = props
  const minePrefix = useMemo(() => `${prefixCls}__pure-display`, [prefixCls])
  const selectedContainerClass = useMemo(
    () =>
      Cls({
        [`${minePrefix}__items-container--simple`]: styleType === SelectTreeDialogStyle.SIMPLE,
        [`${minePrefix}__items-container--with-border`]: styleType === SelectTreeDialogStyle.WITH_BORDER
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
        return <SelectedItem id={id} desc={desc} prefixCls={prefixCls} key={id} />
      }),
    []
  )
  return (
    <div className={minePrefix}>
      <p className={`${minePrefix}__desc-title`}>{desString}</p>
      <div className={selectedContainerClass}>
        {isShowNoSelectedPlaceholder && <span className={`${minePrefix}__placeholder`}>请选择</span>}
        {selectedItemsCom}
        {styleType === SelectTreeDialogStyle.SIMPLE && (
          <div className={`${minePrefix}__add-button--simple`} onClick={onAddClick}>
            <Icon name="plus" className={`${minePrefix}__add-button--simple__add-icon`} />
            请选择
          </div>
        )}
        {styleType === SelectTreeDialogStyle.WITH_BORDER && (
          <div className={`${minePrefix}__add-button--with-border`}>
            <Icon onClick={onAddClick} name="plus" className={`${minePrefix}__add-button--with-border__add-icon`} />
          </div>
        )}
      </div>
    </div>
  )
}
