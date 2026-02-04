import React from 'react'
import TreeSelect, { type TreeSelectProps } from '@hi-ui/tree-select'
import { AsyncOptsDataInjector } from '@hi-ui/option-injector'
import type { WithAsyncOptsDataProps } from '@hi-ui/option-injector'
import { ProSelectableField } from '../../../extensible/selectable'
import type {
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
  ProFieldRenderFormItemCtx,
} from '../../../base'

export type ProTreeSelectProps = WithAsyncOptsDataProps<
  TreeSelectProps & {
    // ProTreeSelectProps
  }
>

export class ProTreeSelect extends ProSelectableField {
  render(data: unknown, ctx: ProFieldRenderCtx<ProTreeSelectProps>): React.ReactElement {
    const title = this.getOptionTitle(ctx)
    return super.render(title, ctx)
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProTreeSelectProps>) {
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
        <TreeSelect />
      </AsyncOptsDataInjector>
    )
  }

  renderEditable(data: string, ctx: ProFieldRenderEditableCtx<ProTreeSelectProps>) {
    const { dataKey } = ctx
    const title = this.getOptionTitle(ctx, dataKey)
    return super.renderEditable(title, ctx, {
      suffix: this.suffixEl,
    })
  }
}
