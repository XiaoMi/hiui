import React, { useRef } from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Icon from '../icon'
import Tooltip from '../tooltip'

const TabItem = ({
  index,
  prefixCls,
  item,
  draggable,
  activeId,
  type,
  editable,
  handleClick,
  deleteTab,
  dragStart,
  dragEnd,
  canScroll,
  handleKeyDown
}) => {
  const tabItemRef = useRef(null)
  const { tabTitle, tabId, tabDesc, disabled, closeable } = item
  const itemClasses = classNames(`${prefixCls}__item`, {
    [`${prefixCls}__item--active`]: tabId === activeId,
    [`${prefixCls}__item--disabled`]: disabled
  })

  const toggleTooltip = (e, item) => {
    e.target = e.target.closest('.hi-tabs__item')
    if (canScroll) {
      return
    }
    if (type === 'editable') {
      if (e.type === 'mouseenter') {
        item.tabId !== activeId &&
          Tooltip.open(e.target, {
            title: item.tabTitle,
            placement: 'top',
            key: `tab-${item.tabId}`
          })
      } else {
        Tooltip.close(`tab-${item.tabId}`)
      }
    }
  }

  return (
    <div
      data-id={index}
      ref={tabItemRef}
      onClick={(e) => handleClick(item, e)}
      className={itemClasses}
      draggable={draggable}
      tabIndex={tabId === activeId && !disabled ? 0 : -1}
      onKeyDown={(e) => {
        handleKeyDown(e, index, tabItemRef)
      }}
      data-item={JSON.stringify({ ..._.omit(item, 'tabTitle'), newIndex: index })}
      onDragEnd={(e) => dragEnd(e, item)}
      onDragStart={(e) => dragStart(e, item)}
      onMouseEnter={(e) => toggleTooltip(e, item)}
      onMouseLeave={(e) => toggleTooltip(e, item)}
    >
      <span className={`${prefixCls}__item-name`}>{tabTitle}</span>
      {type === 'desc' && <span className={`${prefixCls}__item-desc`}>{tabDesc}</span>}
      {editable && closeable && (
        <span className={`${prefixCls}__item-close`}>
          <Icon
            onClick={(e) => {
              if (!item.disabled) {
                deleteTab(e, tabId, index, item)
              }
            }}
            name="close"
          />
        </span>
      )}
    </div>
  )
}
export default TabItem
