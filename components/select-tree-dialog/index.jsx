import React, { useState } from 'react'
import Cls from 'classnames'
import Modal from '../modal'
import { PureDisplay } from './components/pureDisplay'
import { DialogContent } from './components/dialogContent'
import './style/index'

const prefixCls = 'hi-select-tree-dialog'

export const SelectTreeDialogStyle = {
  SIMPLE: 'simple',
  WITH_BORDER: 'with-border'
}

const SelectTreeDialog = (props) => {
  const [isShowDialog, setIsShowDialog] = useState(false)
  // 已选择项信息{id: number,desc: string}[]
  const [selectedItemInfos] = useState([])

  const {
    desTitle = '',
    data,
    // lazyLoadNodeDel = () => {},
    // checkedIds = [],
    // onConfirm = () => {},
    // onCancel = () => {},
    // maskCloseable = false,
    dialogTitle = '',
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
      <PureDisplay
        selectedItems={selectedItemInfos}
        desString={desTitle}
        styleType={styleType}
        prefixCls={prefixCls}
        onAddClick={() => setIsShowDialog(true)}
      />
      <Modal
        title={dialogTitle}
        visible={isShowDialog}
        size="large"
        onConfirm={() => {}}
        onCancel={() => setIsShowDialog(false)}
      >
        {isShowDialog && <DialogContent prefixCls={prefixCls} data={data} />}
      </Modal>
    </div>
  )
}

export default SelectTreeDialog
