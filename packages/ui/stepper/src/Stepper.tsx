import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseFieldNames, HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { StepperDataItem } from './types'
import { StepperItem } from './StepperItem'
import { transformData } from './utils'

const _role = 'stepper'
const _prefix = getPrefixCls('stepper')

const NOOP_ARRAY = [] as []

/**
 * 步骤条
 */
export const Stepper = forwardRef<HTMLDivElement | null, StepperProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      data = NOOP_ARRAY,
      fieldNames,
      current: currentProp,
      onChange,
      itemLayout = 'horizontal',
      placement = 'horizontal',
      type = 'default',
      ...rest
    },
    ref
  ) => {
    const transformedData = useMemo((): StepperDataItem[] => transformData(data, fieldNames), [
      data,
      fieldNames,
    ])
    const [current, trySetCurrent] = useUncontrolledState(0, currentProp, onChange)

    const globalContext = useGlobalContext() as ReturnType<typeof useGlobalContext> & {
      stepper?: { classNames?: any; styles?: any }
    }
    const { stepper: stepperConfig } = globalContext
    const { classNames, styles } = useMergeSemantic<
      StepperSemanticClassNames,
      StepperSemanticStyles,
      StepperProps
    >({
      classNamesList: [stepperConfig?.classNames, classNamesProp],
      stylesList: [stepperConfig?.styles, stylesProp],
      info: { props: { ...rest, placement, type, itemLayout, data } },
    })

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      `${prefixCls}--placement-${placement}`,
      `${prefixCls}--type-${type}`
    )

    return (
      <div ref={ref} role={role} className={cls} style={{ ...style, ...styles?.root }} {...rest}>
        {transformedData.map((item, index) => {
          const step = index + 1

          return (
            <StepperItem
              key={step}
              {...item}
              prefixCls={`${prefixCls}-item`}
              className={cx(placement === 'horizontal' && `${prefixCls}-item--${itemLayout}`)}
              step={step}
              type={type}
              current={current}
              onClick={() => trySetCurrent(step)}
              classNames={{
                item: classNames?.item,
                itemStatus: classNames?.itemStatus,
                itemTip: classNames?.itemTip,
                itemTipTitle: classNames?.itemTipTitle,
                itemTipContent: classNames?.itemTipContent,
              }}
              styles={{
                item: styles?.item,
                itemStatus: styles?.itemStatus,
                itemTip: styles?.itemTip,
                itemTipTitle: styles?.itemTipTitle,
                itemTipContent: styles?.itemTipContent,
              }}
            />
          )
        })}
      </div>
    )
  }
)

export type StepperSemanticName =
  | 'root'
  | 'item'
  | 'itemStatus'
  | 'itemTip'
  | 'itemTipTitle'
  | 'itemTipContent'
export type StepperSemanticClassNames = SemanticClassNamesType<StepperProps, StepperSemanticName>
export type StepperSemanticStyles = SemanticStylesType<StepperProps, StepperSemanticName>
export type StepperSemantic = ComponentSemantic<StepperSemanticClassNames, StepperSemanticStyles>

export interface StepperProps extends HiBaseHTMLProps<'div'>, StepperSemantic {
  /**
   * 步骤条数据项
   */
  data: StepperDataItem[]
  /**
   * 设置data 中的每一项对应的key
   */
  fieldNames?: HiBaseFieldNames
  /**
   * 当前步骤位置索引，从 1 开始计数
   */
  current?: number
  /**
   * 步骤项的变更回调
   */
  onChange?: (current: number) => void
  /**
   * 水平或垂直展示步骤条
   */
  placement?: 'vertical' | 'horizontal'
  /**
   * 步骤项的布局方式
   */
  itemLayout?: 'vertical' | 'horizontal'
  /**
   * 节点类型
   */
  type?: 'dot' | 'default'
}

if (__DEV__) {
  Stepper.displayName = 'Stepper'
}
