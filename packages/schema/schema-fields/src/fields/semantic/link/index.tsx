import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash-es'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { mergeProps } from '@hi-ui/schema-utils'
import { ProField } from '../../../base'
import { Span } from '../../../components/span'
import type { ProFieldRenderCtx } from '../../../base'

export type ProLinkProps = UnknownObject & {
  /** 是否使用href跳转，默认使用Link组件跳转 */
  isHref?: boolean
  /**
   * 链接字段，优先级低于 customLink
   * @desc 支持路径字符串，例如 user.avatar
   */
  linkField?: string
  /** 自定义链接地址，优先级高于 linkField */
  customLink?: (data: string, ctx: CustomLinkCtx) => string
  /** 额外传递给Link组件的state，模型会自动将rowData注入 */
  extraLinkState?: AnyObject
}

export type CustomLinkCtx = ProFieldRenderCtx<ProLinkProps>

export class ProLink extends ProField {
  renderCtx!: ProFieldRenderCtx<ProLinkProps>
  fieldProps!: ProLinkProps

  render(data: string, ctx: ProFieldRenderCtx<ProLinkProps>) {
    if (!data) return this.dftDom

    this.renderCtx = ctx
    const fieldProps = this.getFieldProps({ linkField: '' }, ctx)
    this.fieldProps = fieldProps

    const { isHref = true } = fieldProps
    if (isHref) return this.renderHref(data)
    else return this.renderLink(data)
  }

  /**
   * renderHref
   * @desc 是指固定的链接地址，直接跳转出系统 */
  renderHref(href: string) {
    const to = this.getGoTo(href)

    return (
      <Span>
        <a
          href={to}
          target="_blank"
          rel="noreferrer noopener"
          // TODO color 放这里不是很好，待优化
          style={{ color: '#237ffa', textDecoration: 'underline' }}
        >
          <EllipsisTooltip>{href}</EllipsisTooltip>
        </a>
      </Span>
    )
  }

  /**
   * renderLink
   * @desc 是指链接地址是动态的，需要根据数据进行拼接
   * @desc 通常用于链接到系统其他页面 */
  renderLink(data: unknown) {
    const { rowData } = this.renderCtx

    const to = this.getGoTo(data)
    const state = mergeProps(rowData, this.fieldProps?.extraLinkState)

    return (
      <Span>
        <Link to={to} state={state} style={{ color: '#237ffa' }}>
          <EllipsisTooltip>{data as string}</EllipsisTooltip>
        </Link>
      </Span>
    )
  }

  getGoTo(data: unknown) {
    const { rowData } = this.renderCtx
    const { linkField, customLink } = this.fieldProps

    // customLink 优先级最高
    if (customLink) return customLink(data as string, this.renderCtx)

    // linkField 存在，则使用 linkField 拼接
    if (linkField) return get(rowData, linkField)

    // 最后使用本字段的值
    return data
  }
}
