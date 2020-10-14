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

export const SelectTreeDialogCheckedType = {
  ALL: 'all',
  CHILD: 'child',
  PARENT: 'parent'
}

const paramValidCheck = (value, belongMap, desc) => {
  if (!Object.values(belongMap).includes(value)) {
    const validValue = Object.values(belongMap).toString()
    throw new Error(`SelectTreeDialog props ${desc} 应该为 ${validValue} 中的一个`)
  }
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
    className = '',
    checkedType = SelectTreeDialogCheckedType.ALL
  } = props

  // 字符串枚举参数校验
  paramValidCheck(styleType, SelectTreeDialogStyle, 'styleType')
  paramValidCheck(checkedType, SelectTreeDialogCheckedType, 'checkedType')

  const [isShowDialog, setIsShowDialog] = useState(false)
  // 勾选信息缓存，用作暂时存储弹窗时的勾选数据
  const [checkedIdsCache, setCheckedIdsCache] = useState([])

  const onAddClickDel = useCallback(() => {
    setCheckedIdsCache(checkedIds)
    setIsShowDialog(true)
  }, [checkedIds])

  // 遍历数组中的树，找到所有的节点、叶节点，并根据需要返回对应的可用节点数据
  // checkedType --> all 返回所有节点数据
  // checkedType --> parent 返回所有节点数据
  // checkedType --> child 返回叶节点数据
  const usefulNodeInfos = useMemo(() => {
    const leafNodes = []
    const allNodes = []

    const cacheLeafNode = (rootNode) => {
      allNodes.push(rootNode)
      // 当没有后代或者显示的表明为叶节点
      // 只要存在 children 值，不论是否为空数组，都判定为，非叶节点
      if (!rootNode.children || rootNode.isLeaf) {
        leafNodes.push(rootNode)
      } else {
        // 递归继续寻找叶节点
        rootNode.children.forEach(cacheLeafNode)
      }
    }
    data.forEach(cacheLeafNode)

    const resultMap = {
      [SelectTreeDialogCheckedType.ALL]: allNodes,
      [SelectTreeDialogCheckedType.CHILD]: leafNodes,
      [SelectTreeDialogCheckedType.PARENT]: allNodes
    }
    return resultMap[checkedType]
  }, [data, checkedType])

  // 已选择项信息{id: number,desc: string}[]
  const selectedItemInfos = useSelectedItemInfos(checkedIds, usefulNodeInfos)

  const onConfirmDel = useCallback(() => {
    onChange(checkedIdsCache)
    setIsShowDialog(false)
  }, [onChange, checkedIdsCache])

  const onRemoveCheckedIds = useRemoveItemCallback(checkedIds, onChange, usefulNodeInfos, checkedType)
  const onRemoveCheckedIdsCache = useRemoveItemCallback(
    checkedIdsCache,
    setCheckedIdsCache,
    usefulNodeInfos,
    checkedType
  )

  // 由于用户给予的信息有可能仅仅只是被勾选的叶节点，所以需要 后续遍历 树，恢复非叶节点勾选状态
  // 当用户 处于 parent 状态的时候，需要恢复其子节点的勾选状态
  const recoveredCheckedIdsCache = useMemo(() => {
    // 先将所有已勾选叶节点id作为初始值
    let result = [...checkedIdsCache]
    // 恢复子节点勾选状态
    const recoverChildId = (rootNode) => {
      if (rootNode.children && rootNode.children.length) {
        if (result.includes(rootNode.id)) {
          const childrenIds = rootNode.children.map((item) => item.id)
          result = [...result, ...childrenIds]
        }

        rootNode.children.forEach(recoverChildId)
      }
    }
    // 恢复父节点的勾选状态
    const recoverParentId = (rootNode) => {
      // 存在children值，但为空数组，则永远不会被判定为勾选
      if (!result.includes(rootNode.id) && rootNode.children && rootNode.children.length) {
        rootNode.children.forEach(recoverParentId)
        const childrenIds = rootNode.children.map((item) => item.id)
        const isAllChildrenChecked = childrenIds.every((item) => result.includes(item))
        if (isAllChildrenChecked) {
          result.push(rootNode.id)
        }
      }
    }

    if (checkedType === SelectTreeDialogCheckedType.PARENT) {
      data.forEach(recoverChildId)
    } else {
      data.forEach(recoverParentId)
    }

    return result
  }, [checkedIdsCache, data, checkedType])

  const onDialogChangeDel = useCallback(
    (newCheckedIds) => {
      if (checkedType === SelectTreeDialogCheckedType.PARENT) {
        const disposedCheckedIds = [...newCheckedIds]
        // 如果某个节点的子节点全部被勾选了，那么，只返回其父节点
        // 从 disposedCheckedIds 中移除一个id
        const removeOneId = (id) => {
          const index = disposedCheckedIds.indexOf(id)
          if (index > -1) {
            disposedCheckedIds.splice(index, 1)
          }
        }
        // 裁剪勾选项
        const tailor = (id) => {
          const info = usefulNodeInfos.find((item) => item.id === id)
          // 已被勾选，并且存在后代，将后代从勾选列表中直接删除
          if (info && info.children && info.children.length) {
            const needTailorChildIds = info.children.map((item) => item.id)
            needTailorChildIds.forEach(removeOneId)
          }
        }
        // 由于 disposedCheckedIds 在轮询时会变化其长度，故而使用原始数据轮询
        newCheckedIds.forEach(tailor)
        setCheckedIdsCache(disposedCheckedIds)
      } else {
        setCheckedIdsCache(newCheckedIds)
      }
    },
    [checkedType, usefulNodeInfos]
  )
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
            onChange={onDialogChangeDel}
            data={data}
            checkedType={checkedType}
            checkedIdsCache={checkedIdsCache}
            recoveredCheckedIdsCache={recoveredCheckedIdsCache}
            usefulNodeInfos={usefulNodeInfos}
            onRemoveItem={onRemoveCheckedIdsCache}
          />
        )}
      </Modal>
    </div>
  )
}

export default SelectTreeDialog
