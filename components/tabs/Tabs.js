import React, {
  useCallback,
  cloneElement,
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import ItemDropdown from './ItemDropdown'
import TabItem from './TabItem'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
const noop = () => {}

const Tabs = ({
  onDrop,
  onDropEnd,
  onDragStart,
  defaultActiveId,
  activeId: activeIdProps,
  children,
  type,
  placement,
  max,
  onEdit,
  editable,
  className,
  theme,
  prefixCls,
  draggable,
  onTabClick
}) => {
  const getTabItems = () => {
    const showTabItems = []
    const hiddenTabItems = []

    React.Children.map(children, (child) => {
      if (child) {
        const {
          tabTitle,
          tabId,
          tabDesc,
          disabled,
          closeable,
          animation
        } = child.props
        const item = {
          tabTitle,
          tabId,
          tabDesc,
          disabled,
          closeable,
          animation
        }

        if (
          (type === 'card' || type === 'line') &&
          placement === 'horizontal' &&
          showTabItems.length >= max
        ) {
          // 卡片式标签超过max时，其余标签的隐藏
          hiddenTabItems.push(item)
        } else {
          showTabItems.push(item)
        }
      }
    })
    return { showTabItems, hiddenTabItems }
  }
  const tabItems = getTabItems()
  const [showTabItems, setShowTabItems] = useState(tabItems.showTabItems)
  const [hiddenTabItems, setHiddentab] = useState(tabItems.hiddenTabItems)
  const [activeId, setActiveId] = useState(
    activeIdProps !== undefined
      ? activeIdProps
      : defaultActiveId ||
          (showTabItems && showTabItems[0] && showTabItems[0].tabId)
  )
  const [dragged, setDragged] = useState()
  const [over, setOver] = useState()
  const [deletetabId, setDeletetabId] = useState()
  const latestActiveId = useRef(activeId)
  const containRef = useRef()
  const inkRef = useRef()
  useEffect(() => {
    if (deletetabId && latestActiveId.current === activeId) {
      setActiveId(children[0] && children[0].props.tabId)
    }
  }, [deletetabId])

  useEffect(() => {
    latestActiveId.current = activeId

    if (type === 'line') {
      const index = showTabItems.findIndex((item) => item.tabId === activeId)

      pseudoPosition(index === -1 ? max : index)
    }
  }, [activeId])

  useEffect(() => {
    if (!activeId && showTabItems.length) {
      setActiveId(showTabItems[0].tabId)
    }
    judgepseudoPosition()
    if (type === 'line') {
      const index = showTabItems.findIndex((item) => item.tabId === activeId)

      pseudoPosition(index === -1 ? max : index)
    }
  }, [showTabItems])

  useEffect(() => {
    const tabItems = getTabItems()

    setShowTabItems(tabItems.showTabItems)
    setHiddentab(tabItems.hiddenTabItems)
  }, [children])

  const judgepseudoPosition = () => {
    if (type === 'line') {
      const index = showTabItems.findIndex(
        (item) => item.tabId === defaultActiveId
      )

      if (index !== -1) {
        pseudoPosition(index)
      } else {
        pseudoPosition(max)
      }
    }
  }
  // 计算激活状态下选中横线
  const pseudoPosition = useCallback((index) => {
    const parentNode = containRef.current
    if (!parentNode.childNodes.length) {
      return
    }
    const child = parentNode.childNodes[index]

    const { width } = child.getBoundingClientRect()
    const ink = inkRef.current
    if (placement === 'horizontal') {
      const offsetLeft = child.offsetLeft
      ink.style.width = `${width - 34}px`
      ink.style.transform = `translateX(${offsetLeft + 17}px)`
    } else {
      const offsetTop = child.offsetTop
      ink.style.transform = `translateY(${offsetTop}px)`
    }
  }, [])

  const addTab = useCallback(() => {
    if (editable) {
      onEdit('add', children.length + 1)
    }
  }, [children, editable])

  const deleteTab = useCallback(
    (e, tabId, index) => {
      e.stopPropagation()
      setDeletetabId(tabId)

      if (editable) {
        onEdit('delete', index, tabId)
        Tooltip.close(`tab-${tabId}`)
      }
    },
    [editable]
  )

  const checkEditable = useCallback(() => editable && type === 'editable', [
    editable
  ])

  const renderTabContent = useCallback(
    (child, index) => {
      const { tabId, animation } = child.props
      return cloneElement(child, {
        show: tabId === activeId,
        latestActiveIdIndex: latestActiveId.current
          ? latestActiveId.current.split('-')[1]
          : -1,
        activeIdIndex: activeId ? activeId.split('-')[1] : -1,
        index,
        animation,
        placement
      })
    },
    [activeId]
  )

  const dragStart = useCallback((e, item) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      setDragged(e.currentTarget)
      onDragStart(item)
    }
  }, [])

  const dragEnd = useCallback(
    (e, item) => {
      if (type === 'card' || type === 'line' || type === 'editable') {
        if (!over || !dragged) {
          return
        }
        var data = [...showTabItems]
        var from = Number(dragged.dataset.id)
        var to = Number(over.dataset.id)
        onDropEnd(item, showTabItems[to])
        data.splice(to, 0, data.splice(from, 1)[0])
        data = data.map((doc, index) => {
          doc.newIndex = index + 1
          return doc
        })
        setShowTabItems(data)
      }
    },
    [over, showTabItems, dragged]
  )

  const handleClick = useCallback(
    (tab, e) => {
      if (tab.disabled) {
        return false
      }

      onTabClick(tab.tabId, e)

      setActiveId(tab.tabId)
    },
    [showTabItems]
  )

  const dragOver = useCallback(
    (e) => {
      if (type === 'card' || type === 'line' || type === 'editable') {
        e.preventDefault()

        e.target = e.target.closest('.hi-tabs__item')

        if (!e.target || !dragged) {
          return
        }

        const taIndex = JSON.parse(e.target.dataset.item).newIndex
        const dgIndex = JSON.parse(dragged.dataset.item).newIndex
        onDrop(showTabItems[taIndex], showTabItems[dgIndex])
        if (taIndex === dgIndex) {
          if (!over) return
          setOver(e.target)
          return
        }
        setOver(e.target)
      }
    },
    [over, dragged]
  )

  const tabsClasses = classNames(
    prefixCls,
    className,
    `${prefixCls}--${type}`,
    `theme__${theme}`,
    {
      [`${prefixCls}--${placement}`]: type === 'card' || type === 'line'
    }
  )

  const editableFlag = checkEditable()

  const animateDone = (tabId) => {
    Tooltip.close(`tab-${tabId}`)
  }
  let activeTabInHiddenItems = true

  return (
    <div className={tabsClasses}>
      <div className={`${prefixCls}__header`}>
        <div
          className={`${prefixCls}__nav contain`}
          onDragOver={dragOver}
          ref={containRef}
        >
          <TransitionGroup component={null}>
            {showTabItems.map((item, index) => {
              const { tabId } = item
              activeTabInHiddenItems =
                activeTabInHiddenItems && tabId !== activeId
              return (
                <CSSTransition
                  key={tabId}
                  timeout={200}
                  unmountOnExit
                  onExit={() => animateDone(tabId)}
                  classNames={`${prefixCls}__tab-items`}
                >
                  <TabItem
                    key={`${prefixCls}__item-${index}`}
                    index={index}
                    prefixCls={prefixCls}
                    item={item}
                    draggable={draggable}
                    activeId={activeId}
                    type={type}
                    showTabItems={showTabItems}
                    editable={editableFlag}
                    handleClick={handleClick}
                    deleteTab={deleteTab}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                  />
                </CSSTransition>
              )
            })}
          </TransitionGroup>

          {hiddenTabItems.length > 0 && (
            <div
              className={classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: activeTabInHiddenItems
              })}
            >
              <ItemDropdown
                active={activeTabInHiddenItems}
                activeId={activeId}
                theme={theme}
                defaultActiveId={defaultActiveId}
                items={hiddenTabItems}
                onChoose={(item, e) => {
                  handleClick(item, e)
                }}
              />
            </div>
          )}
          {type === 'line' && (
            <div className={`${prefixCls}--line__ink`} ref={inkRef} />
          )}
        </div>
        {editableFlag && (
          <div className={`${prefixCls}__add`}>
            <Icon onClick={addTab} name='plus' />
          </div>
        )}
      </div>
      <div className={`${prefixCls}__content`}>
        {React.Children.map(
          children,
          (item, index) => item && renderTabContent(item, index)
        )}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  type: PropTypes.oneOf(['desc', 'card', 'button', 'editable', 'line']),
  placement: PropTypes.oneOf(['horizontal', 'vertical']),
  activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultActiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.number,
  editable: PropTypes.bool,
  className: PropTypes.string,
  renderTabBar: PropTypes.func,
  onTabClick: PropTypes.func,
  onEdit: PropTypes.func,
  draggable: PropTypes.bool
}

Tabs.defaultProps = {
  prefixCls: 'hi-tabs',
  type: 'card',
  placement: 'horizontal',
  className: '',
  max: 6,
  editable: true,
  onTabClick: noop,
  onEdit: noop,
  onDrop: noop,
  onDropEnd: noop,
  onDragStart: noop,
  draggable: false
}
export default Tabs
