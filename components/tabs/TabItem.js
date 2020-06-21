import React from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
const TabItem = ({ index, prefixCls, item, draggable, activeId, type, editable, crossBorder, handleClick, deleteTab, dragStart, dragEnd }) => {
  const { tabTitle, tabId, tabDesc, disabled, closeable } = item

  const itemClasses = classNames(`${prefixCls}__item`, {
    [`${prefixCls}__item--active`]: tabId === activeId,
    [`${prefixCls}__item--disabled`]: disabled,
    [`${prefixCls}__item--flex1`]: crossBorder && (tabId !== activeId)
  })

  const toggleTooltip = (e, item) => {
    e.target = e.target.closest('.hi-tabs__item')
    if (type === 'editable') {
      if (e.type === 'mouseenter') {
        item.tabId !== activeId && Tooltip.open(e.target, { title: item.tabTitle, placement: 'top', key: `tab-${item.tabId}` })
      } else {
        Tooltip.close(`tab-${item.tabId}`)
      }
    }
  }

  return <div data-id={index}
    onClick={e => handleClick(item, e)}
    className={itemClasses}
    draggable={draggable}
    data-item={JSON.stringify({ ...item, newIndex: index })}
    onDragEnd={(e) => dragEnd(e, item)}
    onDragStart={(e) => dragStart(e, item)}
    onMouseEnter={(e) => toggleTooltip(e, item)}
    onMouseLeave={(e) => toggleTooltip(e, item)}
  >
    <span className={`${prefixCls}__item-name`} >{tabTitle}</span>
    {
      type === 'desc' &&
      <span className={`${prefixCls}__item-desc`} >{tabDesc}</span>
    }
    {
      editable && closeable &&
      <span className={`${prefixCls}__item-close`}>
        <Icon onClick={e => deleteTab(e, tabId, index)} name='close' />
      </span>
    }
  </div>
}
export default TabItem
