import React from 'react'
import styles from './context-main-split-scaffold.module.scss'

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ')
}

type ContainerProps = React.HTMLAttributes<HTMLDivElement>
type PaneProps = React.HTMLAttributes<HTMLElement>

type ContextMainSplitScaffoldProps = {
  header?: React.ReactNode
  leftPane: React.ReactNode
  leftPaneProps?: PaneProps
  leftPaneWidth?: number | string
  onResizeStart?: React.MouseEventHandler<HTMLDivElement>
  resizeHandleLabel: string
  rightPane: React.ReactNode
  rightPaneProps?: PaneProps
  rootClassName?: string
  rootProps?: ContainerProps
  surfaceProps?: ContainerProps
  workspaceProps?: ContainerProps
}

export function ContextMainSplitScaffold({
  header,
  leftPane,
  leftPaneProps,
  leftPaneWidth,
  onResizeStart,
  resizeHandleLabel,
  rightPane,
  rightPaneProps,
  rootClassName,
  rootProps,
  surfaceProps,
  workspaceProps,
}: ContextMainSplitScaffoldProps) {
  const {
    className: rootPropsClassName,
    ...restRootProps
  } = rootProps ?? {}
  const {
    className: surfaceClassName,
    ...restSurfaceProps
  } = surfaceProps ?? {}
  const {
    className: workspaceClassName,
    ...restWorkspaceProps
  } = workspaceProps ?? {}
  const {
    className: leftPaneClassName,
    style: leftPaneStyle,
    ...restLeftPaneProps
  } = leftPaneProps ?? {}
  const {
    className: rightPaneClassName,
    ...restRightPaneProps
  } = rightPaneProps ?? {}
  const resolvedLeftPaneStyle = {
    ...(leftPaneStyle ?? {}),
    ...(leftPaneWidth !== undefined ? { inlineSize: leftPaneWidth } : {}),
  }

  return (
    <div
      className={cx(styles.root, rootClassName, rootPropsClassName)}
      data-hiui5-layout-archetype="context-main-split"
      data-hiui5-scroll-strategy="independent-pane-scroll"
      {...restRootProps}
    >
      {header}

      <div className={cx(styles.pageSurface, surfaceClassName)} {...restSurfaceProps}>
        <div className={styles.detailBody}>
          <div
            className={cx(styles.workspace, workspaceClassName)}
            data-hiui5-layout-group="context-main-split"
            data-hiui5-region="split-workspace"
            {...restWorkspaceProps}
          >
            <aside
              className={cx(styles.leftPane, leftPaneClassName)}
              data-hiui5-layout-item="true"
              data-hiui5-layout-item-region="secondary"
              data-hiui5-layout-region="secondary"
              data-hiui5-region="left-context"
              style={resolvedLeftPaneStyle}
              {...restLeftPaneProps}
            >
              <div className={styles.leftPaneInner}>{leftPane}</div>
            </aside>

            <div
              className={cx(styles.splitter, !onResizeStart ? styles.splitterDisabled : undefined)}
              role="separator"
              aria-orientation="vertical"
              aria-label={resizeHandleLabel}
              data-hiui5-region="split-resize-handle"
              onMouseDown={onResizeStart}
            />

            <section
              className={cx(styles.rightPane, rightPaneClassName)}
              data-hiui5-layout-item="true"
              data-hiui5-layout-item-region="primary"
              data-hiui5-layout-region="primary"
              data-hiui5-region="right-main"
              {...restRightPaneProps}
            >
              {rightPane}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
