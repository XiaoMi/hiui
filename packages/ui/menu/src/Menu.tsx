import React, {
  forwardRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { MenuItem } from './MenuItem'
import MenuContext from './context'
import { getAncestorIds } from './util'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { MenuDataItem, MenuFooterRenderProps } from './types'
import Tooltip from '@hi-ui/tooltip'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { getTreeNodesWithChildren } from '@hi-ui/tree-utils'
import { isFunction, isArrayNonEmpty } from '@hi-ui/type-assertion'
import { useResizeObserver } from '@hi-ui/use-resize-observer'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { uuid } from '@hi-ui/use-id'

const MENU_PREFIX = getPrefixCls('menu')

const DEFAULT_EXPANDED_IDS = [] as []
const NOOP_ARRAY = [] as []
const MIN_WIDTH = 56

const MENU_MORE_ID = `MENU_MORE_${uuid()}`

/**
 * TODO: What is Menu
 */
export const Menu = forwardRef<HTMLDivElement | null, MenuProps>(
  (
    {
      prefixCls = MENU_PREFIX,
      role = 'menu',
      className,
      data = NOOP_ARRAY,
      placement = 'vertical',
      showCollapse = false,
      // 仅对垂直模式有效
      expandedType = 'collapse',
      showAllSubMenus = false,
      defaultExpandAll = false,
      defaultExpandedIds = DEFAULT_EXPANDED_IDS,
      expandedIds: expandedIdsProp,
      onExpand,
      defaultActiveId = '',
      activeId: activeIdProp,
      onClickSubMenu,
      collapsed,
      defaultCollapsed = false,
      overlayClassName,
      onCollapse,
      footerRender,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [activeId, updateActiveId] = useUncontrolledState(defaultActiveId, activeIdProp, onClick)

    const [activeParents, updateActiveParents] = useState(() => getAncestorIds(activeId, data))

    useEffect(() => {
      updateActiveParents(getAncestorIds(activeId, data))
    }, [activeId, data])

    const [expandedIds, updateExpandedIds] = useUncontrolledState(
      () => {
        return defaultExpandAll
          ? getTreeNodesWithChildren(data).map((node) => node.id)
          : defaultExpandedIds
      },
      expandedIdsProp,
      onExpand
    )

    const clickMenu = useCallback(
      (id: React.ReactText, raw: MenuDataItem) => {
        updateActiveId(id, raw)
      },
      [updateActiveId]
    )

    const clickSubMenu = useCallback(
      (id: React.ReactText) => {
        const nextExpandedIds = expandedIds.includes(id)
          ? expandedIds.filter((expandedId) => expandedId !== id)
          : expandedIds.concat(id)
        updateExpandedIds(nextExpandedIds)
        if (onClickSubMenu) {
          onClickSubMenu(id, nextExpandedIds)
        }
      },
      [onClickSubMenu, expandedIds, updateExpandedIds]
    )

    const closePopper = useCallback(
      (id: React.ReactText) => {
        updateExpandedIds(expandedIds.filter((expandedId) => expandedId !== id))
      },
      [expandedIds, updateExpandedIds]
    )

    const closeAllPopper = useCallback(() => {
      updateExpandedIds([])
    }, [updateExpandedIds])

    const [mini, miniToggleAction] = useUncontrolledToggle({
      defaultVisible: defaultCollapsed,
      visible: collapsed,
      onToggle: onCollapse,
    })

    const showVertical = placement === 'vertical'
    const canToggle = showVertical && showCollapse
    const showMini = showVertical && mini

    const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
    const [containerWidth = 0, setContainerWidth] = useState<number>()

    useResizeObserver({
      element: containerElement,
      disabled: showVertical,
      getSize: (element) => {
        const itemRect = element.getBoundingClientRect()
        return itemRect.width
      },
      onResize: (el, width) => {
        setContainerWidth(width)
      },
    })

    const [tagMaxCount, setTagMaxCount] = useState(0)

    const mergedTagList = useMemo(() => {
      if (showVertical) return data
      if (containerWidth < MIN_WIDTH) return data
      return data.slice(0, Math.min(data.length, containerWidth / MIN_WIDTH))
    }, [showVertical, data, containerWidth])

    const restTagList = useMemo(() => {
      if (tagMaxCount > 0) return data.slice(tagMaxCount)
      return []
    }, [data, tagMaxCount])

    const getTagWidth = useCallback(
      (index: number) => {
        if (!containerElement) return MIN_WIDTH
        const elements = containerElement.getElementsByClassName('hi-v4-menu-item')
        const element = elements && elements[index]
        if (!element) return MIN_WIDTH
        return element.getBoundingClientRect().width
      },
      [containerElement]
    )

    useLayoutEffect(() => {
      if (showVertical) return

      let tagMaxCount = 0

      if (isArrayNonEmpty(mergedTagList)) {
        const len = mergedTagList.length
        const lastIndex = len - 1

        let totalWidth = 72 // 更多

        for (let i = 0; i < len; ++i) {
          const currentTagWidth = getTagWidth(i)

          if (currentTagWidth === undefined) {
            break
          }

          totalWidth += currentTagWidth

          if (
            (lastIndex === 0 && totalWidth <= containerWidth) ||
            (i === lastIndex - 1 && totalWidth + getTagWidth(lastIndex) <= containerWidth)
          ) {
            tagMaxCount = lastIndex
            break
          } else if (totalWidth > containerWidth) {
            tagMaxCount = i - 1
            break
          }
        }
      } else {
        tagMaxCount = 0
      }

      // 保底要展示 1 个
      setTagMaxCount(isArrayNonEmpty(mergedTagList) && tagMaxCount < 1 ? 1 : tagMaxCount + 1)
    }, [showVertical, getTagWidth, containerWidth, mergedTagList])

    const renderFooter = () => {
      const collapseNode = canToggle ? (
        <div className={cx(`${prefixCls}__toggle`)} onClick={miniToggleAction.not}>
          {mini ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      ) : null

      return (
        <>
          {isFunction(footerRender)
            ? footerRender({ collapsed: showMini, collapseNode })
            : collapseNode}
        </>
      )
    }

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${placement}`,
      mini && `${prefixCls}--mini`,
      (expandedType === 'pop' || showAllSubMenus || mini) && `${prefixCls}--popup`
    )

    return (
      <div ref={useMergeRefs(ref, setContainerElement)} role={role} className={cls} {...rest}>
        <MenuContext.Provider
          value={{
            placement,
            expandedType,
            showAllSubMenus,
            mini,
            clickMenu,
            clickSubMenu,
            closePopper,
            closeAllPopper,
            activeParents,
            activeId: activeId,
            expandedIds: expandedIds,
            overlayClassName,
          }}
        >
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {mergedTagList.map((item, index) => {
              return showMini ? (
                <Tooltip title={item.title} key={item.id} placement="right">
                  <MenuItem {...item} level={1} render={renderMenuItemMini} raw={item} />
                </Tooltip>
              ) : (
                <MenuItem
                  hidden={!showVertical && index >= tagMaxCount}
                  {...item}
                  key={item.id}
                  level={1}
                  raw={item}
                />
              )
            })}
            {showVertical || restTagList.length === 0 ? null : (
              <MenuItem key={MENU_MORE_ID} id={MENU_MORE_ID} title="更多" children={restTagList} />
            )}
          </ul>

          <div className={`${prefixCls}__footer`}>{renderFooter()}</div>
        </MenuContext.Provider>
      </div>
    )
  }
)

export interface MenuProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'> {
  /**
   * 菜单项数据列表
   */
  data: MenuDataItem[]
  /**
   * 默认激活的菜单项 id
   */
  defaultActiveId?: React.ReactText
  /**
   * 激活的菜单项 id
   */
  activeId?: React.ReactText
  /**
   * 设置菜单水平或垂直展示
   */
  placement?: 'horizontal' | 'vertical'
  /**
   * 是否收起子菜单，菜单垂直展示时有效
   */
  collapsed?: boolean
  /**
   * 默认是否收起子菜单，菜单垂直展示时有效
   */
  defaultCollapsed?: boolean
  /**
   * 是否显示收缩开关，菜单垂直展示时有效
   */
  showCollapse?: boolean
  /**
   * 是否以胖菜单的形式展开所有子菜单（仅在水平菜单时有效）
   */
  showAllSubMenus?: boolean
  /**
   * 手风琴模式，菜单水平展示时有效
   */
  accordion?: boolean
  /**
   * 下拉框根类名
   */
  overlayClassName?: string
  /**
   * 弹出层展开方式
   */
  expandedType?: 'collapse' | 'pop'
  /**
   * 首次渲染默认展开所有菜单项，为非受控模式
   */
  defaultExpandAll?: boolean
  /**
   * 首次渲染默认展开菜单项 ids 列表，为非受控模式
   */
  defaultExpandedIds?: React.ReactText[]
  /**
   * 展开菜单项 ids 列表，开启受控
   */
  expandedIds?: React.ReactText[]
  /**
   * 展开菜单时回调
   */
  onExpand?: (expandedIds: React.ReactText[]) => void
  /**
   * 点击菜单选项时的回调
   */
  onClick?: (menuId: React.ReactText, menuItem: MenuDataItem) => void
  /**
   * 点击父菜单项时的回调
   */
  onClickSubMenu?: (subMenuId: React.ReactText, expandedIds: React.ReactText[]) => void
  /**
   * 点击收缩开关时的回调
   */
  onCollapse?: (collapsed: boolean) => void
  /**
   * 底部渲染器
   */
  footerRender?: (props: MenuFooterRenderProps) => React.ReactNode
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}

/**
 * Mini 模式下渲染 item
 */
const renderMenuItemMini = (menu: MenuDataItem) => {
  if (typeof menu.icon !== 'undefined') {
    return menu.icon
  }

  if (typeof menu.title === 'string') {
    return menu.title.substring(0, 1)
  }

  return menu.title
}
