import React from 'react'
import ReactDOM from 'react-dom'
import Avatar from '@hi-ui/avatar'
import { EllipsisTooltip, IconButton } from '@hi-ui/hiui'
import Layout, {
  AppListPopover,
  ActionItem,
  FloatMenuContainer,
  ProfilePopover,
  SearchTrigger,
  Sider,
} from '@hi-ui/layout'
import { GroupMenu, SideMenu, useSideMenuCascade } from '@hi-ui/menu'
import { FeedbackColorful, MenuOutlined, QuestionCircleFilled } from '@hi-ui/icons'
import type { ReactNode } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutContentProvider,
  type LayoutContentContextValue,
} from './components/layout/layout-content-context'
import { TypicalPageHostBridge } from './components/layout/typical-page-host'
import { PromptCopyFloatingButton } from './components/prompt-copy-floating-button'
import { type SupportedLocale, useTranslation } from '../translation'

type AppRouteLike = {
  title?: string
  path?: string
  icon?: ReactNode
  showInMenu?: boolean
  examplePrompt?: string
  children?: AppRouteLike[]
  element?: ReactNode
}

type MenuDataItem = {
  id: string
  title: ReactNode
  icon?: ReactNode
  children?: MenuDataItem[]
}

const LOCALE_OPTIONS: Array<{ id: SupportedLocale; nativeLabel: string }> = [
  { id: 'zh-CN', nativeLabel: '简体中文' },
  { id: 'zh-TW', nativeLabel: '繁體中文' },
  { id: 'en-US', nativeLabel: 'English' },
  { id: 'id-ID', nativeLabel: 'Bahasa Indonesia' },
  { id: 'th-TH', nativeLabel: 'ไทย' },
  { id: 'de-DE', nativeLabel: 'Deutsch' },
  { id: 'ar-SA', nativeLabel: 'العربية' },
]

const USER_CENTER_LABEL: Record<SupportedLocale, string> = {
  'zh-CN': '用户中心',
  'zh-TW': '使用者中心',
  'en-US': 'User Center',
  'id-ID': 'Pusat Pengguna',
  'th-TH': 'ศูนย์ผู้ใช้',
  'de-DE': 'Benutzerzentrum',
  'ar-SA': 'مركز المستخدم',
}

const APP_LIST_ITEMS = [
  {
    id: 'sales-system',
    titleKey: '销售系统',
    iconBgColor: 'BLUE',
    icon: '销',
  },
  {
    id: 'after-sales-system',
    titleKey: '售后系统',
    iconBgColor: 'CYAN',
    icon: '售',
  },
  {
    id: 'customer-service-system',
    titleKey: '客服系统',
    iconBgColor: 'GREEN',
    icon: '客',
  },
] as const

const EXAMPLE_LOGO_SRC = [
  'data:image/png;base64,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',
].join('')

function getLanguageFieldLabel(locale: SupportedLocale, translate: (key: string) => string) {
  const localizedLabel = translate('语言')
  if (locale === 'en-US') return localizedLabel
  return `${localizedLabel} / Language`
}

function resolveTranslatedTitle(title: ReactNode | undefined, translate: (key: string) => string) {
  if (typeof title !== 'string') return title
  return translate(title)
}

function normalizeRoutePath(path: string | undefined) {
  if (!path) return ''
  if (path === '/') return '/'

  return path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '')
}

function joinRoutePath(parentPath: string, routePath: string | undefined) {
  const parent = normalizeRoutePath(parentPath)
  const seg = normalizeRoutePath(routePath)

  if (seg === '/') return parent || '/'
  if (!parent || parent === '/') return seg || parent
  if (!seg) return parent

  return `${parent}/${seg}`
}

function normalizeLocationPath(path: string) {
  const normalized = normalizeRoutePath(path)

  return normalized || '/'
}

function findRouteTitle(
  routes: AppRouteLike[],
  path: string,
  parentPath = '',
  translateTitle: (key: string) => string,
): string | null {
  const normalizedPath = normalizeLocationPath(path)
  const pathname = normalizedPath === '/' ? '/' : `/${normalizedPath}`

  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || '')
    const routeTitle = resolveTranslatedTitle(route.title, translateTitle)

    if (currentPath === normalizedPath || (normalizedPath === '/' && currentPath === '/')) {
      return typeof routeTitle === 'string' ? routeTitle : null
    }

    const pattern = currentPath === '/' ? '/' : `/${currentPath}`
    const matched = currentPath && matchPath({ path: pattern, end: true }, pathname)
    if (matched && typeof routeTitle === 'string') {
      return routeTitle
    }

    if (route.children?.length) {
      const childTitle = findRouteTitle(
        route.children,
        normalizedPath,
        currentPath,
        translateTitle,
      )
      if (childTitle) {
        return childTitle
      }
    }
  }

  return null
}

function findRoutePrompt(routes: AppRouteLike[], path: string, parentPath = ''): string | null {
  const normalizedPath = normalizeLocationPath(path)
  const pathname = normalizedPath === '/' ? '/' : `/${normalizedPath}`

  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || '')

    if (currentPath === normalizedPath || (normalizedPath === '/' && currentPath === '/')) {
      return route.examplePrompt ?? null
    }

    const pattern = currentPath === '/' ? '/' : `/${currentPath}`
    const matched = currentPath && matchPath({ path: pattern, end: true }, pathname)
    if (matched) {
      return route.examplePrompt ?? null
    }

    if (route.children?.length) {
      const childPrompt = findRoutePrompt(route.children, normalizedPath, currentPath)
      if (childPrompt) {
        return childPrompt
      }
    }
  }

  return null
}

function convertRoutesToMenuData(
  routes: AppRouteLike[],
  parentPath = '',
  parentId = 0,
  translateTitle: (key: string) => string,
): MenuDataItem[] {
  let currentId = parentId

  return routes
    .map((route) => {
      if (!route.title || route.showInMenu === false) return null

      const path = joinRoutePath(parentPath, route.path || '')
      const id = path || `route-${currentId++}`
      const menuItem: MenuDataItem = {
        id,
        title: resolveTranslatedTitle(route.title, translateTitle),
        ...(parentPath === '' && route.icon ? { icon: route.icon } : {}),
      }

      if (route.children?.length) {
        menuItem.children = convertRoutesToMenuData(
          route.children,
          path,
          currentId,
          translateTitle,
        )
      }

      return menuItem
    })
    .filter(Boolean) as MenuDataItem[]
}

function collectMenuPathIds(routes: AppRouteLike[], parentPath = ''): string[] {
  const ids: string[] = []

  for (const route of routes) {
    if (!route.title || route.showInMenu === false) continue

    const currentPath = joinRoutePath(parentPath, route.path || '')
    const id = currentPath || '/'
    ids.push(id)

    if (route.children?.length) {
      ids.push(...collectMenuPathIds(route.children, currentPath))
    }
  }

  return ids
}

function findMenuActiveIdForPath(routes: AppRouteLike[], locationPath: string) {
  const normalized = normalizeLocationPath(locationPath)
  const allIds = collectMenuPathIds(routes)
  const matches = allIds.filter((id) => {
    if (normalized === id) return true
    if (id === '/') return false
    return normalized.startsWith(id.endsWith('/') ? id : `${id}/`)
  })

  if (matches.length === 0) return normalized

  matches.sort((a, b) => b.length - a.length)
  return matches[0]!
}

function findPathById(
  routes: AppRouteLike[],
  id: string | number,
  parentPath = '',
): string | null {
  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || '')
    const routeId = currentPath || `route-${routes.indexOf(route)}`

    if (routeId === id || String(routeId) === String(id)) {
      return currentPath || '/'
    }

    if (route.children?.length) {
      const childPath = findPathById(route.children, id, currentPath)
      if (childPath) return childPath
    }
  }

  return null
}

function findFirstLeafId(item: MenuDataItem): string | number {
  let current: MenuDataItem = item

  while (current.children?.length) {
    current = current.children[0]!
  }

  return current.id
}

const HOST_CONTENT_VIEWPORT_GUTTER = 16

const styles = {
  root: {
    height: '100%',
    minHeight: 0,
    backgroundColor: '#f5f8fc',
    overflow: 'hidden',
  } as const,
  sider: {
    backgroundColor: '#edf2ff',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  } as const,
  siderBody: {
    flex: '1 1 0%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  } as const,
  sideMenuWrapper: {
    flex: '1 1 0%',
    minHeight: 0,
    overflow: 'hidden',
  } as const,
  siderHeader: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  } as const,
  siderHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as const,
  siderHeaderLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as const,
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgb(124 135 166 / 12%)',
  } as const,
  logoImg: {
    width: 28,
    height: 28,
  } as const,
  siderHeaderTitle: {
    fontWeight: 500,
    color: '#1a1d26',
  } as const,
  siderFooter: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    margin: '12px 8px',
    marginBlockStart: 'auto',
  } as const,
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as const,
  profileHeaderMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  } as const,
  profileHeaderName: {
    fontSize: 16,
    fontWeight: 500,
    color: '#1a1d26',
    lineHeight: '22px',
  } as const,
  profileHeaderEmail: {
    fontSize: 14,
    color: '#91959e',
    lineHeight: '22px',
    fontWeight: 400,
  } as const,
  main: {
    flex: '1 1 0%',
    minWidth: 0,
    minHeight: 0,
    backgroundColor: '#f5f8fc',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as const,
  headerSlot: {
    flex: '0 0 auto',
    width: '100%',
    minWidth: 0,
    minHeight: 60,
    backgroundColor: '#f5f8fc',
    display: 'flex',
    alignItems: 'center',
  } as const,
  outlet: {
    flex: '1 1 0%',
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
  } as const,
  footerSlot: {
    flex: '0 0 auto',
    width: '100%',
    minWidth: 0,
  } as const,
} satisfies Record<string, React.CSSProperties>

function getTimezoneLabel() {
  const offsetInMinutes = -new Date().getTimezoneOffset()
  const sign = offsetInMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetInMinutes)
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, '0')
  const minutes = String(absoluteMinutes % 60).padStart(2, '0')

  return `UTC${sign}${hours}:${minutes}`
}

export function TypicalPageAppFrame({
  routes,
  children,
}: {
  routes: AppRouteLike[]
  children: ReactNode
}) {
  const { dir, locale, setLocale, t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const layoutRef = React.useRef<HTMLDivElement>(null)
  const siderRef = React.useRef<HTMLDivElement>(null)
  const floatMenuPortalRef = React.useRef<HTMLDivElement | null>(null)
  const sideMenuRef = React.useRef<HTMLDivElement>(null)
  const floatContainerRef = React.useRef<HTMLDivElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef2 = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [, setPortalReady] = React.useState(false)
  const timezoneLabel = React.useMemo(() => getTimezoneLabel(), [])

  const currentPath = location.pathname === '/' ? '/' : location.pathname.slice(1)
  const pageTitle = findRouteTitle(routes, currentPath || '/', '', t) || ''
  const examplePrompt = findRoutePrompt(routes, currentPath || '/')
  const menuData = React.useMemo(() => convertRoutesToMenuData(routes, '', 0, t), [routes, t])
  const headerRef = React.useRef<HTMLDivElement>(null)
  const footerRef = React.useRef<HTMLDivElement>(null)
  const titleTextRef = React.useRef(pageTitle)
  titleTextRef.current = pageTitle
  const layoutContentValue = React.useMemo<LayoutContentContextValue>(
    () => ({
      headerRef,
      footerRef,
      titleTextRef,
    }),
    [],
  )
  const [collapsed, setCollapsed] = React.useState(true)
  const [activeAppId, setActiveAppId] = React.useState<React.ReactText>(APP_LIST_ITEMS[0].id)
  const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
  const [profileVisible, setProfileVisible] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>(() =>
    findMenuActiveIdForPath(routes, currentPath || '/'),
  )
  const [selectMenuId, setSelectMenuId] = React.useState<React.ReactText>('')
  const appListData = React.useMemo(
    () =>
      APP_LIST_ITEMS.map((item) => ({
        id: item.id,
        title: t(item.titleKey),
        iconBgColor: item.iconBgColor,
        icon: item.icon,
      })),
    [t],
  )

  const { submenuData, activeParentId } = useSideMenuCascade({
    data: menuData,
    selectId: selectMenuId,
    activeId: activeMenuId,
  })

  const [floatContainerVisible, setFloatContainerVisible] = React.useState(
    submenuData.length > 0,
  )
  const [floatContainerCollapsed, _setFloatContainerCollapsed] = React.useState(() => {
    const value = submenuData.length === 0
    Promise.resolve().then(() => {
      layoutRef.current?.setAttribute('data-float-menu-collapsed', value.toString())
    })
    return value
  })

  const setFloatContainerCollapsed = (value: boolean) => {
    _setFloatContainerCollapsed(value)
    layoutRef.current?.setAttribute('data-float-menu-collapsed', value.toString())
  }

  React.useEffect(() => {
    const path = location.pathname === '/' ? '/' : location.pathname.slice(1)
    setActiveMenuId(findMenuActiveIdForPath(routes, path || '/'))
  }, [location.pathname, routes])

  React.useEffect(() => {
    if (activeParentId) {
      setSelectMenuId(activeParentId)
    }
  }, [activeParentId])

  const setFloatMenuPortalNode = React.useCallback((node: HTMLDivElement | null) => {
    floatMenuPortalRef.current = node
    if (node) setPortalReady(true)
  }, [])

  const mainStyle = React.useMemo(
    () => ({
      ...styles.main,
      // hiui-design host contract: always keep the right gutter, and only
      // collapse the left gutter when the floating submenu is expanded.
      paddingInlineEnd: HOST_CONTENT_VIEWPORT_GUTTER,
      paddingInlineStart: floatContainerCollapsed ? HOST_CONTENT_VIEWPORT_GUTTER : 0,
    }),
    [floatContainerCollapsed],
  )

  const handleNavigate = (id: string | number) => {
    const path = findPathById(routes, id)
    if (path) navigate(path)
    setActiveMenuId(id)
  }

  const handleMenuSelect = (id: string | number, item: MenuDataItem) => {
    setSelectMenuId(id)

    if (!item.children || item.children.length === 0) {
      handleNavigate(id)
      setFloatContainerVisible(false)
      setFloatContainerCollapsed(true)
      return
    }

    const firstLeafId = findFirstLeafId(item)
    handleNavigate(firstLeafId)
    setFloatContainerVisible(true)
    setFloatContainerCollapsed(false)
  }

  const profileSettings = React.useMemo(
    () => ({
      value: { language: locale },
      data: [
        {
          id: 'timezone',
          title: t('时区'),
          subtitle: timezoneLabel,
        },
        {
          id: 'language',
          title: getLanguageFieldLabel(locale, t),
          subtitle:
            LOCALE_OPTIONS.find((option) => option.id === locale)?.nativeLabel ??
            LOCALE_OPTIONS[0].nativeLabel,
          children: LOCALE_OPTIONS.map((supportedLocale) => ({
            id: supportedLocale.id,
            title: supportedLocale.nativeLabel,
          })),
        },
      ],
      onChange: (_value: Record<string, React.ReactText>, targetItem: { id?: React.ReactText }) => {
        const nextLocale = String(targetItem.id ?? '')
        if (LOCALE_OPTIONS.some((option) => option.id === nextLocale)) {
          setLocale(nextLocale as SupportedLocale)
          setProfileVisible(false)
        }
      },
    }),
    [locale, setLocale, t, timezoneLabel],
  )

  const appSwitcher = (
    <AppListPopover
      visible={appListPopoverVisible}
      data={appListData}
      activeId={activeAppId}
      titleRender={(item) => <EllipsisTooltip>{item.title as string}</EllipsisTooltip>}
      onItemClick={(item) => {
        setActiveAppId(item.id)
        setAppListPopoverVisible(false)
      }}
      onOutsideClick={() => setAppListPopoverVisible(false)}
    >
      <IconButton
        style={!collapsed ? { marginInlineStart: 'auto' } : { margin: '16px auto 0' }}
        icon={<MenuOutlined size={18} />}
        effectColor="rgba(124, 135, 166, 0.15)"
        effect
        onClick={() => {
          setAppListPopoverVisible(!appListPopoverVisible)
        }}
      />
    </AppListPopover>
  )

  return (
    <Layout ref={layoutRef} style={styles.root} translate="no">
      <Sider
        ref={siderRef}
        style={styles.sider}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div style={styles.siderBody}>
          <div style={styles.siderHeader}>
            <div style={styles.siderHeaderTop}>
              <div style={styles.siderHeaderLogo}>
                <div style={styles.logo}>
                  <img
                    src={EXAMPLE_LOGO_SRC}
                    alt="logo"
                    style={styles.logoImg}
                  />
                </div>
                {collapsed ? null : <div style={styles.siderHeaderTitle}>HiUI Pro</div>}
              </div>
              {collapsed ? null : appSwitcher}
            </div>

            {collapsed ? appSwitcher : null}
          </div>

          <SearchTrigger
            mini={collapsed}
            data={menuData}
            onSelect={(id, item) => {
              handleMenuSelect(id as string | number, item as MenuDataItem)
            }}
          />

          <div style={styles.sideMenuWrapper}>
            <SideMenu
              ref={sideMenuRef}
              mini={collapsed}
              selectedId={selectMenuId}
              activeId={activeParentId}
              data={menuData}
              onClick={(_event, id, item) => {
                handleMenuSelect(id as string | number, item as MenuDataItem)
              }}
              onMouseEnter={(_event, id, item) => {
                timerRef2.current = setTimeout(() => {
                  if (item.children && item.children.length > 0) {
                    setSelectMenuId(id)
                    setFloatContainerVisible(true)
                  } else if (
                    (menuData.find((menuItem) => menuItem.id === activeParentId)?.children
                      ?.length || 0) > 0
                  ) {
                    setSelectMenuId(activeParentId)
                    if (floatContainerCollapsed) {
                      setFloatContainerVisible(false)
                    }
                  }
                }, 200)

                if (timerRef.current) {
                  clearTimeout(timerRef.current)
                }
              }}
              onMouseLeave={(event, id) => {
                const relatedTarget = event.relatedTarget as Node | null
                const isRelatedTargetNode = relatedTarget instanceof Node
                const isOutside =
                  !isRelatedTargetNode ||
                  (!sideMenuRef.current?.contains(relatedTarget) &&
                    !floatContainerRef.current?.contains(relatedTarget) &&
                    !siderRef.current?.contains(relatedTarget))

                if (timerRef2.current) {
                  clearTimeout(timerRef2.current)
                }

                if (isOutside) {
                  if (
                    (id !== activeParentId &&
                      (menuData.find((menuItem) => menuItem.id === activeParentId)?.children
                        ?.length || 0) > 0) ||
                    floatContainerCollapsed
                  ) {
                    setSelectMenuId(activeParentId)
                  }
                }

                timerRef.current = setTimeout(() => {
                  setFloatContainerVisible(false)
                }, 200)
              }}
            />
          </div>

          <div style={styles.siderFooter}>
            <ActionItem icon={<QuestionCircleFilled />} mini={collapsed}>
              使用手册
            </ActionItem>
            <ActionItem icon={<FeedbackColorful />} mini={collapsed}>
              {t('反馈')}
            </ActionItem>

            <ProfilePopover
              visible={profileVisible}
              placement={dir === 'rtl' ? 'left-end' : 'right-end'}
              header={
                <div style={styles.profileHeader}>
                  <Avatar size="lg" />
                  <div style={styles.profileHeaderMeta}>
                    <div style={styles.profileHeaderName}>{t('示例管理员')}</div>
                    <div style={styles.profileHeaderEmail}>admin@example.com</div>
                  </div>
                </div>
              }
              footer={<div onClick={() => setProfileVisible(false)}>{t('退出登录')}</div>}
              settings={profileSettings}
              onClose={() => setProfileVisible(false)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  height: 40,
                  marginLeft: collapsed ? 12 : 10,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                onClick={() => setProfileVisible(!profileVisible)}
              >
                <Avatar size="xs" />
                {collapsed ? null : <span>{USER_CENTER_LABEL[locale]}</span>}
              </div>
            </ProfilePopover>
          </div>
        </div>
      </Sider>

      <div ref={setFloatMenuPortalNode} aria-hidden="true" />

      {floatMenuPortalRef.current
        ? ReactDOM.createPortal(
            <FloatMenuContainer
              ref={floatContainerRef}
              width={180}
              visible={floatContainerVisible}
              collapsed={floatContainerCollapsed}
              onCollapse={(value) => {
                setFloatContainerCollapsed(value)
                setFloatContainerVisible(!value)
              }}
              onMouseEnter={() => {
                setFloatContainerVisible(true)
                if (timerRef.current) {
                  clearTimeout(timerRef.current)
                }
              }}
              onMouseLeave={(event) => {
                timerRef.current = setTimeout(() => {
                  setFloatContainerVisible(false)
                }, 200)

                const relatedTarget = event.relatedTarget as Node | null
                const isRelatedTargetNode = relatedTarget instanceof Node
                const isOutside =
                  !isRelatedTargetNode ||
                  (!sideMenuRef.current?.contains(relatedTarget) &&
                    !floatContainerRef.current?.contains(relatedTarget) &&
                    !siderRef.current?.contains(relatedTarget))

                if (isOutside) {
                  if (
                    (menuData.find((menuItem) => menuItem.id === activeParentId)?.children
                      ?.length || 0) > 0 ||
                    floatContainerCollapsed
                  ) {
                    setSelectMenuId(activeParentId)
                  }
                }
              }}
            >
              <GroupMenu
                activeId={activeMenuId}
                data={submenuData}
                onClick={(_event, id) => {
                  handleNavigate(id)
                }}
              />
            </FloatMenuContainer>,
            floatMenuPortalRef.current,
          )
        : null}

      <main role="content" style={mainStyle}>
        <LayoutContentProvider value={layoutContentValue}>
          <TypicalPageHostBridge>
            <div data-hiui5-region="header" ref={headerRef} style={styles.headerSlot} />
            <div style={styles.outlet}>{children}</div>
            {examplePrompt ? <PromptCopyFloatingButton prompt={examplePrompt} /> : null}
            <div ref={footerRef} style={styles.footerSlot} />
          </TypicalPageHostBridge>
        </LayoutContentProvider>
      </main>
    </Layout>
  )
}
