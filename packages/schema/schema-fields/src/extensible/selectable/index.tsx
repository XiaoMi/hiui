import React from 'react'
import { DownOutlined } from '@hi-ui/icons'
import { getPrefixStyleVar } from '@hi-ui/classname'
import {
  AsyncOptsDataGetter,
  getSelectedOptionTitle,
  WithAsyncOptsDataProps,
} from '@hi-ui/option-injector'
import { SELECTED_OPTION_RAW } from '@hi-ui/schema-core'
import { isInvalidValue, filterCascaderSelfReferenceOpts } from '@hi-ui/schema-utils'
import { ProField } from '../../base'
import type { ProFieldRenderCtx, ProFieldRenderEditableCtx } from '../../base'
import type { NormalFieldCtxType } from '../../utils'
import type { RefillPlaceholderProps } from './type'

export type * from './type'

export type ProSelectableFieldProps = {
  // 扩展预留
}

export class ProSelectableField extends ProField {
  suffixEl = (
    <DownOutlined size={16} color={`var(${getPrefixStyleVar('color-gray-500')}, #929aa6)`} />
  )

  /**
   * 过滤掉原始参数中的自引用属性
   * - 防止 immer 在处理数据时出现崩溃
   * - 主要用在级联及树形选择组件中
   */
  hookedSetSelectedRawOption(ctx: NormalFieldCtxType<AnyObject>, args: AnyArray) {
    if (ctx.field.payload?.setSelectedRawOption) {
      const nextArgs = filterCascaderSelfReferenceOpts(
        ...(args as Parameters<typeof filterCascaderSelfReferenceOpts>)
      )
      ctx.field.payload.setSelectedRawOption(nextArgs)
    }
  }

  protected getOptionTitle(
    ctx: ProFieldRenderCtx<AnyType> | ProFieldRenderEditableCtx<AnyType>,
    dataKey?: string
  ) {
    const {
      rowData,
      field: { valueType, dataIndex },
    } = ctx
    const fieldKey = dataKey || dataIndex

    // 内部会区分组件类型，返回对应的标题
    return getSelectedOptionTitle(rowData, valueType, fieldKey)
  }

  getDftPlaceholder(ctx: NormalFieldCtxType<AnyObject>) {
    const titleText = ctx.field._titleText
    if (titleText) return `请选择${titleText}`
  }

  /**
   * 渲染字符串类型的已选结果
   * - 用在单选、单选级联
   */
  renderEditableForStringSelected(data: unknown, ctx: ProFieldRenderEditableCtx<AnyType>) {
    const { dataKey } = ctx

    // 如果数据为无效值，则不渲染 // null/undefined/空串/空数组
    if (isInvalidValue(data)) return null

    // 尝试获取已选中的标题
    // SELECTED_OPTION_RAW 来自可编辑表，原始数据中没有的直接跳过这里的逻辑
    if (SELECTED_OPTION_RAW in ctx.rawData) {
      const selectedTitle = this.getOptionTitle(ctx, dataKey)
      if (selectedTitle) {
        return super.renderEditable(selectedTitle, ctx, {
          suffix: this.suffixEl,
        })
      }
    }

    return null
  }

  /**
   * 渲染字符串类型的首次回显元素
   * - 用在单选、单选级联
   */
  renderEditableForStringFirstRefill(
    data: unknown,
    ctx: ProFieldRenderEditableCtx<AnyType>,
    extra: {
      dftRender: ProField['renderEditable']
      RefillComponent: (props: RefillPlaceholderProps) => React.ReactElement
    }
  ) {
    // 如果数据为无效值，则不渲染 // null/undefined/空串/空数组
    if (!isInvalidValue(data)) {
      const { RefillComponent, dftRender } = extra

      const fieldProps = this.getFieldProps({}, ctx) as WithAsyncOptsDataProps<AnyObject>
      return (
        <AsyncOptsDataGetter {...fieldProps} renderCtx={ctx}>
          <RefillComponent
            value={data}
            data={[]} // 会被 AsyncOptsDataGetter 注入
            ctx={ctx}
            instance={this}
            dftRender={dftRender}
            fieldNames={fieldProps.fieldNames ?? {}}
          />
        </AsyncOptsDataGetter>
      )
    }

    return null
  }
}
