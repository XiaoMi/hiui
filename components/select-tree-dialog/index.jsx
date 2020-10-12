import React, { useState, useMemo, useCallback } from 'react'
import Cls from 'classnames'
import Modal from '../modal'
import { PureDisplay } from './components/pureDisplay'
import { DialogContent } from './components/dialogContent'
import './style/index'
import { useSelectedItemInfos } from './hooks/useSelectedItemInfos'
import { useRemoveItemCallback } from './hooks/useRemoveItemCallback'

const prefixCls = 'hi-select-tree-dialog'

export const SelectTreeDialogStyle = {
  SIMPLE: 'simple',
  WITH_BORDER: 'with-border'
}

const SelectTreeDialog = (props) => {
  const {
    desTitle = '',
    data = [],
    checkedIds = [],
    onChange = () => {},
    maskCloseable = false,
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

  const [isShowDialog, setIsShowDialog] = useState(false)
  // 勾选信息缓存，用作暂时存储弹窗时的勾选数据
  const [checkedIdsCache, setCheckedIdsCache] = useState([])

  const onAddClickDel = useCallback(() => {
    setCheckedIdsCache(checkedIds)
    setIsShowDialog(true)
  }, [checkedIds])

  // 遍历数组中的树，找到所有的叶节点，将其缓存下来（只有叶节点才被允许点击）
  const leafNodeInfos = useMemo(() => {
    const result = []
    const cacheLeafNode = (rootNode) => {
      // 当没有后代或者显示的表明为叶节点
      // 只要存在 children 值，不论是否为空数组，都判定为，非叶节点
      if (!rootNode.children || rootNode.isLeaf) {
        result.push(rootNode)
      } else {
        // 递归继续寻找叶节点
        rootNode.children.forEach(cacheLeafNode)
      }
    }
    data.forEach(cacheLeafNode)

    return result
  }, [data])

  // 已选择项信息{id: number,desc: string}[]
  const selectedItemInfos = useSelectedItemInfos(checkedIds, leafNodeInfos)

  const onConfirmDel = useCallback(() => {
    onChange(checkedIdsCache)
    setIsShowDialog(false)
  }, [onChange, checkedIdsCache])

  const onRemoveCheckedIds = useRemoveItemCallback(checkedIds, onChange)
  const onRemoveCheckedIdsCache = useRemoveItemCallback(checkedIdsCache, setCheckedIdsCache)
  // 由于用户给予的信息仅仅只是被勾选的叶节点，所以需要 后续遍历 树，恢复非叶节点勾选状态
  const recoveredCheckedIdsCache = useMemo(() => {
    // 先将所有已勾选叶节点id作为初始值
    const result = [...checkedIdsCache]
    const recoverId = (rootNode) => {
      // 存在children值，但为空数组，则永远不会被判定为勾选
      if (!result.includes(rootNode.id) && rootNode.children && rootNode.children.length) {
        rootNode.children.forEach(recoverId)
        const childrenIds = rootNode.children.map((item) => item.id)
        const isAllChildrenChecked = childrenIds.every((item) => result.includes(item))
        if (isAllChildrenChecked) {
          result.push(rootNode.id)
        }
      }
    }
    data.forEach(recoverId)

    return result
  }, [checkedIdsCache, data])

  return (
    <div className={Cls(prefixCls, className)} style={style}>
      <PureDisplay
        selectedItems={selectedItemInfos}
        desString={desTitle}
        styleType={styleType}
        prefixCls={prefixCls}
        onAddClick={onAddClickDel}
        onRemoveItem={onRemoveCheckedIds}
      />
      <Modal
        title={dialogTitle}
        visible={isShowDialog}
        size="large"
        onConfirm={onConfirmDel}
        onCancel={() => setIsShowDialog(false)}
        maskCloseable={maskCloseable}
      >
        {/* 重新创建组件以重置数据 */}
        {isShowDialog && (
          <DialogContent
            prefixCls={prefixCls}
            onChange={setCheckedIdsCache}
            data={data}
            checkedIdsCache={recoveredCheckedIdsCache}
            leafNodeInfos={leafNodeInfos}
            onRemoveItem={onRemoveCheckedIdsCache}
          />
        )}
      </Modal>
    </div>
  )
}

export default SelectTreeDialog
