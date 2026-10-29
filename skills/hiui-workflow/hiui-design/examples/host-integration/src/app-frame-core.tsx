import React from "react";
import ReactDOM from "react-dom";
import Avatar from "@hi-ui/avatar";
import { EllipsisTooltip, IconButton } from "@hi-ui/hiui";
import Layout, {
  ActionItem,
  AppListPopover,
  FloatMenuContainer,
  ProfilePopover,
  SearchTrigger,
  Sider,
} from "@hi-ui/layout";
import { GroupMenu, SideMenu, useSideMenuCascade } from "@hi-ui/menu";
import {
  FeedbackColorful,
  MenuOutlined,
  QuestionCircleFilled,
} from "@hi-ui/icons";
import type { ReactNode } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutContentProvider,
  type LayoutContentContextValue,
} from "./components/layout/layout-content-context";
import { useHostShellLocalization } from "./host-shell-localization";
import { TypicalPageHostBridge } from "./components/layout/typical-page-host";
import { buildNavigationPath, stripRouteBasePath } from "./route-base-path";
import "./host-reset.css";

export type AppRouteLike = {
  title?: string;
  path?: string;
  icon?: ReactNode;
  showInMenu?: boolean;
  children?: AppRouteLike[];
  element?: ReactNode;
};

export type ShellOptions = {
  brandTitle?: string;
  profileName?: string;
  profileEmail?: string;
  routeBasePath?: string;
};

export const hiuiDesignHeaderSlotPolicy = "collapses-when-empty";

type MenuDataItem = {
  id: string;
  title: ReactNode;
  icon?: ReactNode;
  children?: MenuDataItem[];
};

type RouteKey = string | number;

const APP_LIST_ITEMS = [
  {
    id: "sales-system",
    titleKey: "销售系统",
    iconBgColor: "BLUE",
    icon: "销",
  },
  {
    id: "after-sales-system",
    titleKey: "售后系统",
    iconBgColor: "CYAN",
    icon: "售",
  },
  {
    id: "customer-service-system",
    titleKey: "客服系统",
    iconBgColor: "GREEN",
    icon: "客",
  },
] as const;

function hasSharedHeaderSlotContent(node: HTMLDivElement | null) {
  if (!node) return false;

  return (
    node.childElementCount > 0 ||
    Array.from(node.childNodes).some((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        return Boolean(childNode.textContent?.trim());
      }

      return childNode.nodeType === Node.ELEMENT_NODE;
    })
  );
}

const EXAMPLE_LOGO_SRC = [
  "data:image/png;base64,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",
].join("");

const HOST_CONTENT_VIEWPORT_GUTTER = 16;
type HostContentOutletStyle = React.CSSProperties & {
  "--hiui-content-inline-gutter": string;
};

function resolveTranslatedTitle(
  title: ReactNode | undefined,
  translate: (key: string) => string,
) {
  if (typeof title !== "string") return title;
  return translate(title);
}

function normalizeRoutePath(path: string | undefined) {
  if (!path) return "";
  if (path === "/") return "/";

  return path.replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
}

function joinRoutePath(parentPath: string, routePath: string | undefined) {
  const parent = normalizeRoutePath(parentPath);
  const seg = normalizeRoutePath(routePath);

  if (seg === "/") return parent || "/";
  if (!parent || parent === "/") return seg || parent;
  if (!seg) return parent;

  return `${parent}/${seg}`;
}

function normalizeLocationPath(path: string) {
  const normalized = normalizeRoutePath(path);

  return normalized || "/";
}

function findRouteTitle(
  routes: AppRouteLike[],
  path: string,
  parentPath = "",
  translateTitle: (key: string) => string,
): string | null {
  const normalizedPath = normalizeLocationPath(path);
  const pathname = normalizedPath === "/" ? "/" : `/${normalizedPath}`;

  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || "");
    const routeTitle = resolveTranslatedTitle(route.title, translateTitle);

    if (
      currentPath === normalizedPath ||
      (normalizedPath === "/" && currentPath === "/")
    ) {
      return typeof routeTitle === "string" ? routeTitle : null;
    }

    const pattern = currentPath === "/" ? "/" : `/${currentPath}`;
    const matched =
      currentPath && matchPath({ path: pattern, end: true }, pathname);
    if (matched && typeof routeTitle === "string") {
      return routeTitle;
    }

    if (route.children?.length) {
      const childTitle = findRouteTitle(
        route.children,
        normalizedPath,
        currentPath,
        translateTitle,
      );
      if (childTitle) {
        return childTitle;
      }
    }
  }

  return null;
}

function convertRoutesToMenuData(
  routes: AppRouteLike[],
  parentPath = "",
  parentId = 0,
  translateTitle: (key: string) => string,
): MenuDataItem[] {
  let currentId = parentId;

  return routes
    .map((route) => {
      if (!route.title || route.showInMenu === false) return null;

      const path = joinRoutePath(parentPath, route.path || "");
      const id = path || `route-${currentId++}`;
      const menuItem: MenuDataItem = {
        id,
        title: resolveTranslatedTitle(route.title, translateTitle),
        ...(parentPath === "" && route.icon ? { icon: route.icon } : {}),
      };

      if (route.children?.length) {
        menuItem.children = convertRoutesToMenuData(
          route.children,
          path,
          currentId,
          translateTitle,
        );
      }

      return menuItem;
    })
    .filter(Boolean) as MenuDataItem[];
}

function collectMenuPathIds(routes: AppRouteLike[], parentPath = ""): string[] {
  const ids: string[] = [];

  for (const route of routes) {
    if (!route.title || route.showInMenu === false) continue;

    const currentPath = joinRoutePath(parentPath, route.path || "");
    const id = currentPath || "/";
    ids.push(id);

    if (route.children?.length) {
      ids.push(...collectMenuPathIds(route.children, currentPath));
    }
  }

  return ids;
}

function findMenuActiveIdForPath(routes: AppRouteLike[], locationPath: string) {
  const normalized = normalizeLocationPath(locationPath);
  const allIds = collectMenuPathIds(routes);
  const matches = allIds.filter((id) => {
    if (normalized === id) return true;
    if (id === "/") return false;
    return normalized.startsWith(id.endsWith("/") ? id : `${id}/`);
  });

  if (matches.length === 0) return normalized;

  matches.sort((a, b) => b.length - a.length);
  return matches[0]!;
}

function findPathById(
  routes: AppRouteLike[],
  id: string | number,
  parentPath = "",
): string | null {
  for (const route of routes) {
    const currentPath = joinRoutePath(parentPath, route.path || "");
    const routeId = currentPath || `route-${routes.indexOf(route)}`;

    if (routeId === id || String(routeId) === String(id)) {
      return currentPath || "/";
    }

    if (route.children?.length) {
      const childPath = findPathById(route.children, id, currentPath);
      if (childPath) return childPath;
    }
  }

  return null;
}

function findFirstLeafId(item: MenuDataItem): string | number {
  let current: MenuDataItem = item;

  while (current.children?.length) {
    current = current.children[0]!;
  }

  return current.id;
}

const styles = {
  host: {
    width: "100%",
    minWidth: 0,
    height: "100vh",
    minHeight: "100vh",
    display: "flex",
    overflow: "hidden",
  } as const,
  root: {
    width: "100%",
    minWidth: 0,
    height: "100vh",
    minHeight: "100vh",
    backgroundColor: "#f5f8fc",
    overflow: "hidden",
  } as const,
  sider: {
    backgroundColor: "#edf2ff",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    overflow: "hidden",
  } as const,
  siderBody: {
    flex: "1 1 0%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  } as const,
  sideMenuWrapper: {
    flex: "1 1 0%",
    minHeight: 0,
    overflow: "hidden",
  } as const,
  siderHeader: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  } as const,
  siderHeaderTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as const,
  siderHeaderLogo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as const,
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgb(124 135 166 / 12%)",
  } as const,
  logoImg: {
    width: 28,
    height: 28,
  } as const,
  siderHeaderTitle: {
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 500,
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  siderFooter: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    margin: "12px 8px",
    marginBlockStart: "auto",
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as const,
  profileHeaderMeta: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  } as const,
  profileHeaderName: {
    fontSize: 16,
    fontWeight: 500,
    color: "#1a1d26",
    lineHeight: "22px",
  } as const,
  profileHeaderEmail: {
    fontSize: 14,
    color: "#91959e",
    lineHeight: "22px",
    fontWeight: 400,
  } as const,
  main: {
    boxSizing: "border-box",
    flex: "1 1 0%",
    minWidth: 0,
    minHeight: 0,
    backgroundColor: "#f5f8fc",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } as const,
  headerSlot: {
    flex: "0 0 auto",
    width: "100%",
    minWidth: 0,
    minHeight: 60,
    backgroundColor: "#f5f8fc",
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  headerSlotCollapsed: {
    flex: "0 0 auto",
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    height: 0,
    overflow: "hidden",
    pointerEvents: "none",
  } as const,
  outlet: {
    flex: "1 1 0%",
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } as const,
  overlayRoot: {
    position: "relative",
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
    overflow: "visible",
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  footerSlot: {
    flex: "0 0 auto",
    width: "100%",
    minWidth: 0,
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  floatMenuPortalAnchor: {
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  profileFooter: {
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
  } as const,
  profileTrigger: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    height: 40,
    fontSize: 14,
    lineHeight: "22px",
    letterSpacing: "normal",
    color: "#1a1d26",
    cursor: "pointer",
  } as const,
} satisfies Record<string, React.CSSProperties>;

function getTimezoneLabel() {
  const offsetInMinutes = -new Date().getTimezoneOffset();
  const sign = offsetInMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetInMinutes);
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
  const minutes = String(absoluteMinutes % 60).padStart(2, "0");

  return `UTC${sign}${hours}:${minutes}`;
}

type TypicalPageAppFrameCoreProps = {
  routes: AppRouteLike[];
  children: ReactNode;
  shellOptions?: ShellOptions;
  overlaySlot?: ReactNode;
};

export function TypicalPageAppFrameCore({
  routes,
  children,
  shellOptions,
  overlaySlot,
}: TypicalPageAppFrameCoreProps) {
  const {
    dir,
    locale,
    setLocale,
    t,
    localeSwitcherEnabled,
    localeOptions,
    languageFieldLabel,
    userCenterLabel,
  } = useHostShellLocalization();
  const location = useLocation();
  const navigate = useNavigate();
  const layoutRef = React.useRef<HTMLDivElement>(null);
  const siderRef = React.useRef<HTMLDivElement>(null);
  const sideMenuRef = React.useRef<HTMLDivElement>(null);
  const floatContainerRef = React.useRef<HTMLDivElement>(null);
  const overlayRootRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef2 = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [floatMenuPortalNode, setFloatMenuPortalNodeState] =
    React.useState<HTMLDivElement | null>(null);

  const currentPath = stripRouteBasePath(
    location.pathname,
    shellOptions?.routeBasePath,
  );
  const pageTitle = findRouteTitle(routes, currentPath || "/", "", t) || "";
  const menuData = React.useMemo(
    () => convertRoutesToMenuData(routes, "", 0, t),
    [routes, t],
  );
  const headerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const titleTextRef = React.useRef(pageTitle);
  titleTextRef.current = pageTitle;
  const [headerNode, setHeaderNode] = React.useState<HTMLDivElement | null>(
    null,
  );
  const [footerNode, setFooterNode] = React.useState<HTMLDivElement | null>(
    null,
  );
  const [headerSlotOccupied, setHeaderSlotOccupied] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  React.useLayoutEffect(() => {
    setHeaderNode(headerRef.current);
    setFooterNode(footerRef.current);
  }, []);
  React.useEffect(() => {
    if (!headerNode) {
      setHeaderSlotOccupied(false);
      return;
    }

    const syncHeaderSlotOccupied = () => {
      setHeaderSlotOccupied(hasSharedHeaderSlotContent(headerNode));
    };

    syncHeaderSlotOccupied();

    const observer = new MutationObserver(() => {
      syncHeaderSlotOccupied();
    });
    observer.observe(headerNode, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [headerNode]);
  const layoutContentValue = React.useMemo<LayoutContentContextValue>(
    () => ({
      headerNode,
      headerRef,
      footerNode,
      footerRef,
      titleText: pageTitle,
      titleTextRef,
    }),
    [footerNode, headerNode, pageTitle],
  );
  const [activeAppId, setActiveAppId] = React.useState<RouteKey>(
    APP_LIST_ITEMS[0].id,
  );
  const [appListPopoverVisible, setAppListPopoverVisible] =
    React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);
  const [activeMenuId, setActiveMenuId] = React.useState<RouteKey>(() =>
    findMenuActiveIdForPath(routes, currentPath || "/"),
  );
  const [selectedMenuId, setSelectedMenuId] =
    React.useState<RouteKey>("");
  const appListData = React.useMemo(
    () =>
      APP_LIST_ITEMS.map((item) => ({
        id: item.id,
        title: t(item.titleKey),
        iconBgColor: item.iconBgColor,
        icon: item.icon,
      })),
    [t],
  );
  const resolvedBrandTitle = shellOptions?.brandTitle ?? "HiUI Pro";
  const resolvedProfileName = shellOptions?.profileName ?? t("示例管理员");
  const resolvedProfileEmail =
    shellOptions?.profileEmail ?? "admin@example.com";

  const { submenuData, activeParentId } = useSideMenuCascade({
    data: menuData,
    selectId: selectedMenuId,
    activeId: activeMenuId,
  });

  React.useEffect(() => {
    const path = stripRouteBasePath(
      location.pathname,
      shellOptions?.routeBasePath,
    );
    setActiveMenuId(findMenuActiveIdForPath(routes, path || "/"));
  }, [location.pathname, routes, shellOptions?.routeBasePath]);

  React.useEffect(() => {
    if (activeParentId) {
      setSelectedMenuId(activeParentId);
    }
  }, [activeParentId]);

  const [floatContainerVisible, setFloatContainerVisible] = React.useState(
    submenuData.length > 0,
  );
  const [floatContainerCollapsed, setFloatContainerCollapsed] = React.useState(
    submenuData.length === 0,
  );
  const resolvedFloatContainerVisible =
    submenuData.length > 0 && floatContainerVisible;
  const resolvedFloatContainerCollapsed =
    submenuData.length === 0 || floatContainerCollapsed;

  React.useEffect(() => {
    layoutRef.current?.setAttribute(
      "data-float-menu-collapsed",
      resolvedFloatContainerCollapsed.toString(),
    );
  }, [resolvedFloatContainerCollapsed]);

  const setFloatMenuPortalNode = React.useCallback(
    (node: HTMLDivElement | null) => {
      setFloatMenuPortalNodeState(node);
    },
    [],
  );

  const mainStyle = React.useMemo(
    () => ({
      ...styles.main,
      marginInlineEnd: HOST_CONTENT_VIEWPORT_GUTTER,
      marginInlineStart: resolvedFloatContainerCollapsed
        ? HOST_CONTENT_VIEWPORT_GUTTER
        : 0,
    }),
    [resolvedFloatContainerCollapsed],
  );
  const contentOutletStyle = React.useMemo(
    () =>
      ({
        ...styles.outlet,
        "--hiui-content-inline-gutter": `${HOST_CONTENT_VIEWPORT_GUTTER}px`,
      }) as HostContentOutletStyle,
    [],
  );
  const resolveOverlayContainer = React.useCallback(
    () => overlayRootRef.current,
    [],
  );
  const headerSlotStyle = React.useMemo(
    () =>
      headerSlotOccupied ? styles.headerSlot : styles.headerSlotCollapsed,
    [headerSlotOccupied],
  );

  const handleNavigate = (id: string | number) => {
    const path = findPathById(routes, id);
    if (path) navigate(buildNavigationPath(path, shellOptions?.routeBasePath));
    setActiveMenuId(id);
  };

  const handleMenuSelect = (id: string | number, item: MenuDataItem) => {
    setSelectedMenuId(id);

    if (!item.children || item.children.length === 0) {
      handleNavigate(id);
      setFloatContainerVisible(false);
      setFloatContainerCollapsed(true);
      return;
    }

    const firstLeafId = findFirstLeafId(item);
    handleNavigate(firstLeafId);
    setFloatContainerVisible(true);
    setFloatContainerCollapsed(false);
  };

  const profileSettings = React.useMemo(
    () => ({
      value: localeSwitcherEnabled ? { language: locale } : {},
      data: [
        {
          id: "timezone",
          title: t("时区"),
          subtitle: getTimezoneLabel(),
        },
        ...(localeSwitcherEnabled
          ? [
              {
                id: "language",
                title: languageFieldLabel,
                subtitle:
                  localeOptions.find((option) => option.id === locale)
                    ?.nativeLabel ?? localeOptions[0]?.nativeLabel ?? "",
                children: localeOptions.map((supportedLocale) => ({
                  id: supportedLocale.id,
                  title: supportedLocale.nativeLabel,
                })),
              },
            ]
          : []),
      ],
      onChange: (
        _value: Record<string, RouteKey>,
        targetItem: { id?: RouteKey },
      ) => {
        if (!localeSwitcherEnabled) return;
        const nextLocale = String(targetItem.id ?? "");
        if (localeOptions.some((option) => option.id === nextLocale)) {
          setLocale(nextLocale);
          setProfileVisible(false);
        }
      },
    }),
    [languageFieldLabel, locale, localeOptions, localeSwitcherEnabled, setLocale, t],
  );

  const appSwitcher = (
    <AppListPopover
      visible={appListPopoverVisible}
      data={appListData}
      activeId={activeAppId}
      container={resolveOverlayContainer}
      titleRender={(item) => (
        <EllipsisTooltip>{item.title as string}</EllipsisTooltip>
      )}
      onItemClick={(item) => {
        setActiveAppId(item.id);
        setAppListPopoverVisible(false);
      }}
      onOutsideClick={() => setAppListPopoverVisible(false)}
    >
      <IconButton
        style={
          !collapsed ? { marginInlineStart: "auto" } : { margin: "16px auto 0" }
        }
        icon={<MenuOutlined size={18} />}
        effectColor="rgba(124, 135, 166, 0.15)"
        effect
        onClick={() => {
          setAppListPopoverVisible(!appListPopoverVisible);
        }}
      />
    </AppListPopover>
  );

  return (
    <div data-typical-page-host="" style={styles.host}>
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
                  {collapsed ? null : (
                    <div style={styles.siderHeaderTitle}>
                      {resolvedBrandTitle}
                    </div>
                  )}
                </div>
                {collapsed ? null : appSwitcher}
              </div>

              {collapsed ? appSwitcher : null}
            </div>

            <SearchTrigger
              mini={collapsed}
              data={menuData}
              onSelect={(id, item) => {
                handleMenuSelect(id as string | number, item as MenuDataItem);
              }}
            />

            <div style={styles.sideMenuWrapper}>
              <SideMenu
                ref={sideMenuRef}
                mini={collapsed}
                selectedId={selectedMenuId}
                activeId={activeParentId}
                data={menuData}
                onClick={(_event, id, item) => {
                  handleMenuSelect(id as string | number, item as MenuDataItem);
                }}
                onMouseEnter={(_event, id, item) => {
                  timerRef2.current = setTimeout(() => {
                    if (item.children && item.children.length > 0) {
                      setSelectedMenuId(id);
                      setFloatContainerVisible(true);
                    } else if (
                      (menuData.find(
                        (menuItem) => menuItem.id === activeParentId,
                      )?.children?.length || 0) > 0
                    ) {
                      setSelectedMenuId(activeParentId);
                      if (resolvedFloatContainerCollapsed) {
                        setFloatContainerVisible(false);
                      }
                    }
                  }, 200);

                  if (timerRef.current) {
                    clearTimeout(timerRef.current);
                  }
                }}
                onMouseLeave={(event, id) => {
                  const relatedTarget = event.relatedTarget as Node | null;
                  const isRelatedTargetNode = relatedTarget instanceof Node;
                  const isOutside =
                    !isRelatedTargetNode ||
                    (!sideMenuRef.current?.contains(relatedTarget) &&
                      !floatContainerRef.current?.contains(relatedTarget) &&
                      !siderRef.current?.contains(relatedTarget));

                  if (timerRef2.current) {
                    clearTimeout(timerRef2.current);
                  }

                  if (isOutside) {
                    if (
                      (id !== activeParentId &&
                        (menuData.find(
                          (menuItem) => menuItem.id === activeParentId,
                        )?.children?.length || 0) > 0) ||
                      resolvedFloatContainerCollapsed
                    ) {
                      setSelectedMenuId(activeParentId);
                    }
                  }

                  timerRef.current = setTimeout(() => {
                    setFloatContainerVisible(false);
                  }, 200);
                }}
              />
            </div>

            <div style={styles.siderFooter}>
              <ActionItem icon={<QuestionCircleFilled />} mini={collapsed}>
                {t("使用手册")}
              </ActionItem>
              <ActionItem icon={<FeedbackColorful />} mini={collapsed}>
                {t("反馈")}
              </ActionItem>

              <ProfilePopover
                visible={profileVisible}
                placement={dir === "rtl" ? "left-end" : "right-end"}
                header={
                  <div style={styles.profileHeader}>
                    <Avatar size="lg" />
                    <div style={styles.profileHeaderMeta}>
                      <div style={styles.profileHeaderName}>
                        {resolvedProfileName}
                      </div>
                      <div style={styles.profileHeaderEmail}>
                        {resolvedProfileEmail}
                      </div>
                    </div>
                  </div>
                }
                footer={
                  <div
                    style={styles.profileFooter}
                    onClick={() => setProfileVisible(false)}
                  >
                    {t("退出登录")}
                  </div>
                }
                settings={profileSettings}
                onClose={() => setProfileVisible(false)}
              >
                <div
                  style={{
                    ...styles.profileTrigger,
                    marginLeft: collapsed ? 12 : 10,
                  }}
                  onClick={() => setProfileVisible(!profileVisible)}
                >
                  <Avatar size="xs" />
                  {collapsed ? null : <span>{userCenterLabel}</span>}
                </div>
              </ProfilePopover>
            </div>
          </div>
        </Sider>

        <div
          ref={setFloatMenuPortalNode}
          aria-hidden="true"
          style={styles.floatMenuPortalAnchor}
        />

        {floatMenuPortalNode
          ? ReactDOM.createPortal(
              <FloatMenuContainer
                ref={floatContainerRef}
                width={180}
                visible={resolvedFloatContainerVisible}
                collapsed={resolvedFloatContainerCollapsed}
                onCollapse={(value) => {
                  setFloatContainerCollapsed(value);
                  setFloatContainerVisible(!value);
                }}
                onMouseEnter={() => {
                  setFloatContainerVisible(true);
                  if (timerRef.current) {
                    clearTimeout(timerRef.current);
                  }
                }}
                onMouseLeave={(event) => {
                  timerRef.current = setTimeout(() => {
                    setFloatContainerVisible(false);
                  }, 200);

                  const relatedTarget = event.relatedTarget as Node | null;
                  const isRelatedTargetNode = relatedTarget instanceof Node;
                  const isOutside =
                    !isRelatedTargetNode ||
                    (!sideMenuRef.current?.contains(relatedTarget) &&
                      !floatContainerRef.current?.contains(relatedTarget) &&
                      !siderRef.current?.contains(relatedTarget));

                  if (isOutside) {
                    if (
                      (menuData.find(
                        (menuItem) => menuItem.id === activeParentId,
                      )?.children?.length || 0) > 0 ||
                      resolvedFloatContainerCollapsed
                    ) {
                      setSelectedMenuId(activeParentId);
                    }
                  }
                }}
              >
                <GroupMenu
                  activeId={activeMenuId}
                  data={submenuData}
                  onClick={(_event, id) => {
                    setSelectedMenuId(activeParentId);
                    handleNavigate(id);
                  }}
                />
              </FloatMenuContainer>,
              floatMenuPortalNode,
            )
          : null}

        <main role="content" style={mainStyle}>
          <LayoutContentProvider value={layoutContentValue}>
            <TypicalPageHostBridge getOverlayContainer={resolveOverlayContainer}>
              <div
                ref={headerRef}
                aria-hidden={!headerSlotOccupied}
                data-hiui-page-header-slot="true"
                style={headerSlotStyle}
              />
              <div
                data-hiui-main-content-outlet="true"
                style={contentOutletStyle}
              >
                {children}
              </div>
              <div
                ref={overlayRootRef}
                aria-hidden="true"
                data-hiui-overlay-root="true"
                style={styles.overlayRoot}
              />
              {overlaySlot ?? null}
              <div ref={footerRef} style={styles.footerSlot} />
            </TypicalPageHostBridge>
          </LayoutContentProvider>
        </main>
      </Layout>
    </div>
  );
}
