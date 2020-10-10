import React from 'react'
import Cls from 'classnames'
import { SelectedDisplay } from './components/selectedDisplay'
import './style/index'

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
    styleType = SelectTreeDialogStyle.SIMPLE,
    style = {},
    className = ''
  } = props

  // 参数校验
  if (!Object.values(SelectTreeDialogStyle).includes(styleType)) {
    const validValue = Object.values(SelectTreeDialogStyle).toString()
    throw new Error(`styleType 应该为 ${validValue} 中的一个`)
  }

  return (
    <div className={Cls(prefixCls, className)} style={style}>
      <SelectedDisplay desString={desTitle} styleType={styleType} prefixCls={prefixCls} />
    </div>
  )
}

export default SelectTreeDialog
