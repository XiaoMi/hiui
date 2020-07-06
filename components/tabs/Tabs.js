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
  onAdd,
  onDropEnd,
  onDragStart,
  defaultActiveId,
  activeId: activeIdProps,
  children,
  type,
  placement,
  max,
  overScroll,
  onDelete,
  editable,
  className,
  theme,
  prefixCls,
  draggable,
  onTabClick,
  onBeforeDelete
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
          closeable = true,
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
  const childRef = useRef()
  useEffect(() => {
    if (deletetabId && latestActiveId.current === activeId) {
      setActiveId(children[0] && children[0].props.tabId)
    }
  }, [deletetabId])

  useEffect(() => {
    const index = showTabItems.findIndex((item) => item.tabId === activeId)
    latestActiveId.current = index

    if (index === -1 && type === 'editable') {
      setActiveId(showTabItems[0].tabId)
    }

    if (type === 'line') {
      pseudoPosition(index === -1 ? max : index)
    }
  }, [activeId, showTabItems, type])

  useEffect(() => {
    const tabItems = getTabItems()

    setShowTabItems(tabItems.showTabItems)
    setHiddentab(tabItems.hiddenTabItems)
    console.log(childRef.current)
    console.log(children.length)
    if (overScroll && (children.length > childRef.current)) {
      const contain = containRef.current
      console.log(contain)
      // ???
      setTimeout(() => {
        contain.scrollLeft += 1000
      }, 0)
    }
  }, [children])

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
      onAdd(children.length + 1)
      childRef.current = children.length
    }
  }, [children, editable])

  const deleteTab = useCallback(
    (e, tabId, index, item) => {
      e.stopPropagation()
      setDeletetabId(tabId)
      if (editable) {
        if (onBeforeDelete) {
          const result = onBeforeDelete(item)
          if (result === true) {
            onDelete(item, index)
            Tooltip.close(`tab-${tabId}`)
          }
        } else {
          onDelete(item, index)
          Tooltip.close(`tab-${tabId}`)
        }
      }
    },
    [editable, activeId]
  )

  const checkEditable = useCallback(() => editable && type === 'editable', [
    editable
  ])

  const renderTabContent = useCallback(
    (child, index) => {
      const { tabId, animation } = child.props
      const activeIndex = showTabItems.findIndex(
        (item) => item.tabId === activeId
      )

      return cloneElement(child, {
        show: tabId === activeId,
        latestActiveIdIndex: latestActiveId.current
          ? latestActiveId.current
          : -1,
        activeIdIndex: activeId ? activeIndex : -1,
        index,
        animation,
        placement
      })
    },
    [activeId, showTabItems]
  )

  const dragStart = useCallback((e, item) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      setDragged(e.currentTarget)
      e.currentTarget.classList.add('hi-tabs__item--disabled')
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
        e.currentTarget.classList.remove('hi-tabs__item--disabled')
        const items = containRef.current.getElementsByClassName(
          'hi-tabs__item'
        )
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove('hi-tabs__item--adsorbent')
        }
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
        } else {
          const items = containRef.current.getElementsByClassName(
            'hi-tabs__item'
          )
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('hi-tabs__item--adsorbent')
          }
          e.target.classList.add('hi-tabs__item--adsorbent')
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
    },
    {
      [`${prefixCls}--overScroll`]: overScroll
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
                    overScroll={overScroll}
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
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onDrop: PropTypes.func,
  onDropEnd: PropTypes.func,
  onDragStart: PropTypes.func,
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
  onBeforeDelete: noop,
  onDrop: noop,
  onDropEnd: noop,
  onDragStart: noop,
  onAdd: noop,
  onDelete: noop,
  draggable: false
}
export default Tabs
