/**
 * 弹窗内容组件
 * 次组件自身不维护任何数据，仅仅只是行为的执行，所有数据都由外部提供
 * @author xuhuihuang@xiaomi.com
 */
import React, { useMemo, useCallback } from 'react'
import Tree from '../../tree'
import { SelectedItem } from './selectedItem'
import { useSelectedItemInfos } from '../hooks/useSelectedItemInfos'

export const DialogContent = (props) => {
  const {
    prefixCls,
    data = [],
    leafNodeInfos = [],
    checkedIdsCache = [],
    onChange = () => {},
    onRemoveItem = () => {}
  } = props
  const minePrefixCls = useMemo(() => `${prefixCls}__dialog-content`, [prefixCls])

  // 由于只有叶节点点击才会被视作选择，故而，需要去除掉无用的节点
  const onCheckDel = useCallback(
    ({ checkedIds: newCheckedIds }) => {
      const leafNodeIds = leafNodeInfos.map((item) => item.id)
      const checkedLeafIds = newCheckedIds.filter((item) => leafNodeIds.includes(item))
      onChange(checkedLeafIds)
    },
    [leafNodeInfos, onChange]
  )

  // 已选择项信息{id: number,desc: string}[]
  const selectedItemInfos = useSelectedItemInfos(checkedIdsCache, leafNodeInfos)

  return (
    <div className={minePrefixCls}>
      <div className={`${minePrefixCls}__tree-container`}>
        <Tree
          checkedIds={checkedIdsCache}
          checkable
          editable={false}
          data={data}
          highlightable
          searchable
          onCheck={onCheckDel}
        />
      </div>
      <div className={`${minePrefixCls}__selected-container`}>
        <p className={`${minePrefixCls}__selected-num`}>{`已选：${selectedItemInfos.length}`}</p>
        <div className={`${minePrefixCls}__selected-items`}>
          {selectedItemInfos.map((item) => (
            <SelectedItem
              onRemoveClick={onRemoveItem}
              key={item.id}
              id={item.id}
              desc={item.desc}
              prefixCls={prefixCls}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
