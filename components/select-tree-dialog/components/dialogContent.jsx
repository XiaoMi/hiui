/**
 * 弹窗内容组件
 * @author xuhuihuang@xiaomi.com
 */
import React, { useMemo } from 'react'
import Tree from '../../tree'

export const DialogContent = (props) => {
  const { prefixCls, data = undefined } = props
  const minePrefixCls = useMemo(() => `${prefixCls}__dialog-content`, [prefixCls])

  return (
    <div className={minePrefixCls}>
      <div className={`${minePrefixCls}__tree-container`}>
        <Tree checkable editable={false} data={data} highlightable searchable />
      </div>
      <div className={`${minePrefixCls}__selected-container`}>balala</div>
    </div>
  )
}
