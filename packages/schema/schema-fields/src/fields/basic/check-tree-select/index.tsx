import React from 'react'
import CheckTreeSelect, { type CheckTreeSelectProps } from '@hi-ui/check-tree-select'
import { AsyncOptsDataInjector } from '@hi-ui/option-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/option-injector'
import { ProSelectableField } from '../../../extensible/selectable'
import type {
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderFormItemCtx,
} from '../../../base'

export type ProCheckTreeSelectProps = WithAsyncOptsDataProps<
  CheckTreeSelectProps & {
    // ProCheckTreeSelectProps
  }
>

export class ProCheckTreeSelect extends ProSelectableField {
  render(data: string[], ctx: ProFieldRenderCtx<ProCheckTreeSelectProps>) {
    const title = this.getOptionTitle(ctx) || data
    return super.render(title, ctx)
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCheckTreeSelectProps>) {
    const fieldProps = this.getFieldProps(
      {
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )

    // NOTE 实测 searchMode 不传时，无法开启搜索
    // 考虑到是有接口搜索时，会按照关键字过滤，因此默认采用 filter 模式
    if (fieldProps.request) fieldProps.searchMode = 'filter'

    return (
      <AsyncOptsDataInjector
        {...fieldProps}
        renderCtx={ctx}
        setSelectedRawOption={ctx.field.payload?.setSelectedRawOption}
      >
        <CheckTreeSelect />
      </AsyncOptsDataInjector>
    )
  }

  renderEditable(data: string[], ctx: ProFieldRenderEditableCtx<ProCheckTreeSelectProps>) {
    const { dataKey } = ctx
    const title = this.getOptionTitle(ctx, dataKey)

    return super.renderEditable(title, ctx, {
      suffix: this.suffixEl,
    })
  }
}
