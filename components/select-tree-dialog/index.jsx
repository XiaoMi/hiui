import React from 'react'
import './style/index'
import { SelectedDisplay } from './components/selectedDisplay'

const prefixCls = 'hi-select-tree-dialog'

export const SelectTreeDialogStyle = {
  SIMPLE: 'simple',
  WITH_BORDER: 'with-border'
}

const SelectTreeDialog = (props) => {
  const {
    desTitle = '',
    // data,
    // lazyLoadNodeDel = () => {},
    // checkedIds = [],
    // onConfirm = () => {},
    // onCancel = () => {},
    // maskCloseable = false,
    // visible = false,
    styleType = SelectTreeDialogStyle.SIMPLE
  } = props

  // 参数校验
  if (!Object.values(SelectTreeDialogStyle).includes(styleType)) {
    const validValue = Object.values(SelectTreeDialogStyle).toString()
    throw new Error(`styleType 应该为 ${validValue} 中的一个`)
  }

  return (
    <div className={prefixCls}>
      <SelectedDisplay desString={desTitle} styleType={styleType} prefixCls={prefixCls} />
    </div>
  )
}

export default SelectTreeDialog
