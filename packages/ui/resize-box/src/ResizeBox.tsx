import React, { forwardRef } from 'react'
import { Resizable } from 'react-resizable'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { LeftOutlined } from '@hi-ui/icons'
import { ResizeBoxPane, ResizeBoxPaneProps } from './ResizeBoxPane'
import { Separator, SeparatorProps } from './Separator'

const RESIZE_BOX_PREFIX = getPrefixCls('resize-box')

export const ResizeBox = forwardRef<HTMLDivElement | null, ResizeBoxProps>(
  (
    {
      prefixCls = RESIZE_BOX_PREFIX,
      role = 'resize-box',
      className,
      children,
      separatorProps,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const containerRef = React.useRef<Element | null>(null)
    const mergedRef = useMergeRefs(ref, containerRef)

    const [colWidths, tryChangeColWidths] = useUncontrolledState<number[]>([])
    const minColWidthsRef = React.useRef<number[]>([])
    const oldColWidthsRef = React.useRef<number[]>([])

    const draggableRef = React.useRef<boolean>(true)

    /**
     * 计算内容面板宽度
     * 如果有设置默认宽度，则使用默认宽度，否则使用平均宽度
     * 如果有设置最小宽度，则使用最小宽度，否则使用默认宽度的一半
     */
    const calcPaneWidth = React.useCallback(() => {
      const container = containerRef.current
      const containerWidth = container?.getBoundingClientRect().width ?? 0
      const minColWidths: number[] = []
      let defaultColWidths: number[] = []
      let calcWidth = 0
      let avgWidth = 0

      React.Children.forEach(children, (child) => {
        const {
          props: { defaultWidth = 0, minWidth = 0 },
        } = child as React.ReactElement<ResizeBoxPaneProps>

        defaultColWidths.push(defaultWidth)
        minColWidths?.push(minWidth)

        calcWidth += defaultWidth
      })

      if (calcWidth > containerWidth) {
        console.error('default width is greater than container width')
        return
      }

      if (calcWidth < containerWidth) {
        const noDefaultWidthLength = defaultColWidths.filter((item) => !item).length

        avgWidth = Math.floor((containerWidth - calcWidth) / noDefaultWidthLength)

        defaultColWidths = defaultColWidths.map((item) => {
          if (!item) {
            return avgWidth
          } else {
            return item
          }
        })
      }

      tryChangeColWidths(defaultColWidths)

      minColWidthsRef.current = minColWidths.map((item, index) => {
        // 如果没有设置最小宽度，则最小宽度是默认宽度的一半
        return item || defaultColWidths[index] * 0.5
      })
    }, [children, tryChangeColWidths])

    const panesContent = React.useMemo(() => {
      if (!children) {
        console.error('children is required')
        return null
      }

      if (!Array.isArray(children)) {
        console.error('children must be array')
        return children
      }

      return React.Children.map(
        children as React.ReactElement<ResizeBoxPaneProps>[],
        (child, index) => {
          if (!React.isValidElement(child)) {
            console.error('child is not valid element')
            return
          }

          const { type, props } = child
          const {
            collapsible,
            style,
            onResizeStart,
            onResizeEnd,
            onResize,
            onCollapse,
            collapsed: collapsedProp,
            ...rest
          } = props

          if (type !== ResizeBoxPane) {
            console.error('ResizeBox children must be ResizeBoxPane')
            return
          }

          if (index !== children?.length - 1) {
            const collapsed = collapsedProp ?? colWidths[index] === 0

            return (
              <Resizable
                className={`${prefixCls}__resizable`}
                draggableOpts={{ enableUserSelectHack: false }}
                handle={
                  <div style={{ position: 'relative' }}>
                    <Separator {...separatorProps} />
                    {collapsible && (
                      <div
                        className={cx(`${prefixCls}-toggle`)}
                        onClick={() => {
                          // 可折叠受控
                          if (collapsedProp !== undefined) {
                            const currentPaneWidth = colWidths[index]
                            if (currentPaneWidth !== 0) {
                              oldColWidthsRef.current[index] = currentPaneWidth
                            }
                            onCollapse?.(!collapsed)
                          } else {
                            tryChangeColWidths((prev) => {
                              const nextColWidths = [...prev]
                              const currentPaneWidth = nextColWidths[index]
                              if (currentPaneWidth !== 0) {
                                nextColWidths[index] = 0
                                oldColWidthsRef.current[index] = currentPaneWidth
                              } else {
                                nextColWidths[index] = oldColWidthsRef.current[index]
                              }
                              return nextColWidths
                            })
                          }
                        }}
                      >
                        <LeftOutlined />
                      </div>
                    )}
                  </div>
                }
                height={0}
                width={colWidths[index] ?? 0}
                onResizeStart={() => {
                  draggableRef.current = true
                  onResizeStart?.()
                }}
                onResizeStop={onResizeEnd}
                onResize={(evt, data) => {
                  const mouseEvent = evt as React.MouseEvent

                  mouseEvent.stopPropagation()
                  mouseEvent.preventDefault()

                  const { width: resizedWidth } = data.size

                  // 向左或向右拖动到最小宽度时禁止拖拽
                  if (
                    resizedWidth < minColWidthsRef.current[index] ||
                    colWidths[index] + colWidths[index + 1] - resizedWidth <
                      minColWidthsRef.current[index + 1]
                  ) {
                    draggableRef.current = false
                  }

                  if (!draggableRef.current) return

                  tryChangeColWidths((prev) => {
                    const nextColWidths = [...prev]
                    const currentWidth = nextColWidths[index]
                    const siblingWidth = nextColWidths[index + 1]
                    const minColWidth = minColWidthsRef.current[index]
                    const siblingMinColWidth = minColWidthsRef.current[index + 1]
                    const width =
                      resizedWidth <= minColWidth
                        ? // 显示最小宽度
                          minColWidth
                        : currentWidth + siblingWidth - resizedWidth < siblingMinColWidth
                        ? // 能够显示的最大宽度
                          currentWidth + siblingWidth - siblingMinColWidth
                        : // 显示拖拽后的宽度
                          resizedWidth
                    const resizeWidth = width - currentWidth

                    nextColWidths[index] = width
                    nextColWidths[index + 1] = siblingWidth - resizeWidth

                    onResize?.(width)

                    return nextColWidths
                  })
                }}
              >
                {React.cloneElement(child, {
                  ...rest,
                  collapsed,
                  style: {
                    ...style,
                    width: collapsedProp
                      ? collapsed
                        ? 0
                        : oldColWidthsRef.current[index]
                      : colWidths[index],
                  },
                })}
              </Resizable>
            )
          } else {
            return React.cloneElement(child, {
              ...rest,
              style: {
                ...style,
                width: colWidths[index],
              },
            })
          }
        }
      )
    }, [children, colWidths, prefixCls, separatorProps, tryChangeColWidths])

    React.useLayoutEffect(() => {
      if (containerRef.current) {
        calcPaneWidth()

        const resizeObserver = new ResizeObserver(() => {
          calcPaneWidth()
        })

        resizeObserver.observe(containerRef.current)

        return () => {
          resizeObserver.disconnect()
        }
      }
    }, [calcPaneWidth])

    return (
      <div ref={mergedRef} role={role} className={cls} {...rest}>
        {panesContent}
      </div>
    )
  }
)

export interface ResizeBoxProps extends HiBaseHTMLProps<'div'> {
  separatorProps?: SeparatorProps
}

if (__DEV__) {
  ResizeBox.displayName = 'ResizeBox'
}
