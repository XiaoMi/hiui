import React, { useImperativeHandle, forwardRef, ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Portal } from '@hi-ui/portal'
import { HiBaseHTMLProps, HiBaseSizeEnum, usePortalContext, useGlobalContext } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import Spinner from '@hi-ui/spinner'
import { mergeRefs } from '@hi-ui/react-utils'
import { useLoading } from './use-loading'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _role = 'loading'
export const _prefix = getPrefixCls('loading')

export const Loading = forwardRef<null, LoadingProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
      children,
      role = _role,
      container: containerProp,
      content,
      contentPosition = 'bottom',
      visible = true,
      full = false,
      part = false,
      size: sizeProp,
      color,
      delay = -1,
      disabledPortal = false,
      innerRef,
      timeout = 300,
      indicator,
      type = 'spin',
      showMask = true,
      wrapperClassName,
      wrapperStyle,
      classNames: classNamesProp,
      styles: stylesProp,
      ...restProps
    },
    ref
  ) => {
    const { size: globalSize, loading: loadingConfig } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

    const { internalVisible, setInternalVisible } = useLoading({ visible, delay })

    const globalContainer = usePortalContext()?.container
    const container = containerProp ?? globalContainer

    useImperativeHandle(innerRef, () => ({
      close: () => setInternalVisible(false),
    }))

    const { classNames, styles } = useMergeSemantic<
      LoadingSemanticClassNames,
      LoadingSemanticStyles,
      LoadingProps
    >({
      classNamesList: [loadingConfig?.classNames, classNamesProp],
      stylesList: [loadingConfig?.styles, stylesProp],
      info: {
        props: { ...restProps, content, contentPosition, visible, full, size, type, showMask },
      },
    })

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      size && `${prefixCls}--size-${size}`,
      !full && (part || !!children) && `${prefixCls}--part`,
      full && `${prefixCls}--full`,
      `${prefixCls}--type-${type}`,
      `${prefixCls}--content-position-${contentPosition}`
    )

    const getIndicator = useLatestCallback(() => {
      if (indicator) {
        return indicator
      }

      switch (type) {
        case 'spin':
          return (
            <div className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
              <Spinner size={size} color={color} />
            </div>
          )
        default:
          return (
            <div className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
              <div />
              <div />
            </div>
          )
      }
    })

    const transitionNodeRef = React.useRef<HTMLElement>(null)
    const loadingComponent = (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={internalVisible}
        timeout={timeout}
        unmountOnExit
        // 参考：https://github.com/reactjs/react-transition-group/issues/918
        nodeRef={transitionNodeRef}
      >
        <div
          ref={mergeRefs(ref, transitionNodeRef)}
          role={role}
          className={cls}
          style={{ ...style, ...styles?.root }}
          {...restProps}
        >
          {showMask && (
            <div className={cx(`${prefixCls}__mask`, classNames?.mask)} style={styles?.mask} />
          )}
          <div
            className={cx(`${prefixCls}__content-wrapper`, classNames?.contentWrapper)}
            style={styles?.contentWrapper}
          >
            {getIndicator()}
            {content ? (
              <span
                className={cx(`${prefixCls}__content`, classNames?.content)}
                style={styles?.content}
              >
                {content}
              </span>
            ) : null}
          </div>
        </div>
      </CSSTransition>
    )

    return (
      <Portal container={container} disabled={!container && !full}>
        {children ? (
          // 可以测量 children margin，实现按内容位置偏移，排除 margin 影响
          // 暂时不考虑，如果有需要，完全可以把 margin 设置到加到父节点
          <div
            className={cx(`${prefixCls}__wrapper`, wrapperClassName, classNames?.wrapper)}
            style={{ ...wrapperStyle, ...styles?.wrapper }}
          >
            {children}
            {loadingComponent}
          </div>
        ) : (
          loadingComponent
        )}
      </Portal>
    )
  }
)

export type LoadingSizeEnum = Omit<HiBaseSizeEnum, 'xs'> | undefined

export type LoadingSemanticName =
  | 'root'
  | 'mask'
  | 'contentWrapper'
  | 'icon'
  | 'content'
  | 'wrapper'
export type LoadingSemanticClassNames = SemanticClassNamesType<LoadingProps, LoadingSemanticName>
export type LoadingSemanticStyles = SemanticStylesType<LoadingProps, LoadingSemanticName>
export type LoadingSemantic = ComponentSemantic<LoadingSemanticClassNames, LoadingSemanticStyles>

export interface LoadingProps extends HiBaseHTMLProps<'div'>, LoadingSemantic {
  /**
   * 	自定义加载中状态的文案
   */
  content?: React.ReactNode
  /**
   * 设置加载中状态的文案位置
   */
  contentPosition?: 'right' | 'bottom'
  /**
   * 是否开启显示
   */
  visible?: boolean
  /**
   * 是否全屏展示，开启节点将挂载到 body
   */
  full?: boolean
  /**
   * 延迟显示加载效果的时长（可用于防止闪烁）
   */
  delay?: number
  /**
   * 设置尺寸
   */
  size?: LoadingSizeEnum
  /**
   * 设置颜色，仅在 type 为 spin 时有效
   */
  color?: React.CSSProperties['color']
  /**
   * 禁用 portal。暂不对外暴露
   * @private
   */
  disabledPortal?: boolean
  /**
   * 内部 ref引用，暂不对外暴露
   * @private
   */
  innerRef?: React.Ref<{ close: () => void }>
  /**
   * 指定 portal 的容器。暂不对外暴露
   * @private
   */
  container?: HTMLElement | null
  /**
   * 自定义动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
  /**
   * 局部定位。暂不对外暴露
   * @private
   */
  part?: boolean
  /**
   * 自定义加载指示符
   * @private
   */
  indicator?: ReactNode
  /**
   * loading 效果类型
   */
  type?: 'dot' | 'spin'
  /**
   * 设置蒙层
   */
  showMask?: boolean
  /**
   * 设置包裹器类名
   */
  wrapperClassName?: string
  /**
   * 设置包裹器样式
   */
  wrapperStyle?: React.CSSProperties
}

if (__DEV__) {
  Loading.displayName = 'Loading'
}
