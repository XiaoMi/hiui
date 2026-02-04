import React from 'react'
import CheckCascader from '@hi-ui/check-cascader'
import type { CheckCascaderProps as HiUICheckCascaderProps } from '@hi-ui/check-cascader'
import { AsyncOptsDataInjector } from '@hi-ui/option-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/option-injector'
import { ProSelectableField } from '../../../extensible/selectable'
import type { ProFieldRenderFormItemCtx } from '../../../base'

// 这里做了一层奇怪操作的原因是：
// CheckCascader 的 data 属性是必选的，但是 ProCheckCascader 的 data 属性是可选的
// CheckCascader 的 data 会被 AsyncOptsDataInjector 注入，无需担心
type CheckCascaderProps = Omit<HiUICheckCascaderProps, 'data'> &
  Pick<Partial<HiUICheckCascaderProps>, 'data'>

export type ProCheckCascaderProps = WithAsyncOptsDataProps<
  CheckCascaderProps & {
    // ProCheckCascaderProps
  }
>

export class ProCheckCascader extends ProSelectableField {
  dftFieldProps: ProCheckCascaderProps = {
    changeOnSelect: true,
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCheckCascaderProps>) {
    const fieldProps = this.getFieldProps(
      {
        ...this.dftFieldProps,
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )

    // 过滤掉原始参数中的自引用属性，防止 immer 在处理数据时出现崩溃
    const hookedSetSelectedRawOption = this.hookedSetSelectedRawOption.bind(this, ctx) as AnyFn

    return (
      <AsyncOptsDataInjector
        // options
        {...fieldProps}
        renderCtx={ctx}
        setSelectedRawOption={hookedSetSelectedRawOption}
      >
        {/* NOTE 无需疑惑, data 属性会由 AsyncOptsDataInjector 注入 */}
        <CheckCascader data={[]} />
      </AsyncOptsDataInjector>
    )
  }
}
