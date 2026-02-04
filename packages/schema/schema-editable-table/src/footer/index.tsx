import React from 'react'
import { flexRender, type Header } from '@tanstack/react-table'

import { useEditableSchemaTableCtx } from '../ctx'
import { useTableContainer } from '../container/index'
import { getFixedStyles } from '../utils/fixed'
import { cls } from '../utils/cls'
import { groupHeaders } from '../header'
import { useFirstCellPatch } from './use-first-cell-patch'

export type EditTableFooterProps = {
  className?: string
}

type FooterCellWrapperProps = {
  footer: Header<AnyType, unknown>
  fixed?: boolean
}

const FooterCellWrapper = React.memo(function FooterCell(props: FooterCellWrapperProps) {
  const { footer } = props
  const { globalStaticRef } = useEditableSchemaTableCtx()

  // 开启 fixed 时才去获取固定单元格的样式
  const fixed = props.fixed ? getFixedStyles(footer.column, { globalStaticRef }) : {}
  const fixedClassName = (fixed.className || []).map((c) => `cell--${c}`)

  return (
    <td
      className={cls(
        'footer-cell',
        ...fixedClassName // fixed 样式
      )}
      style={fixed.style}
      data-text-align={footer.column.columnDef.meta?.align}
    >
      {flexRender(footer.column.columnDef.footer, footer.getContext())}
    </td>
  )
})

// 仅渲染一行footer，用来生成摘要(合计)行等
export default React.memo(
  function Footer({ className }: EditTableFooterProps) {
    const { table } = useEditableSchemaTableCtx()
    const { virtualize } = useTableContainer()

    useFirstCellPatch()

    return (
      <tfoot className={cls('footer', className)}>
        {table
          .getFooterGroups()
          .slice(0, 1) // 第一行就是叶节点
          .map((footerGroup) => {
            const realFooters = footerGroup.headers

            const {
              left: leftFooters,
              right: rightFooters,
              center: centerFooters,
            } = groupHeaders(realFooters, table)

            return (
              <tr key={footerGroup.id} className={cls('footer-row')}>
                {/* 左侧固定列 */}
                {leftFooters.map((footer) => (
                  <FooterCellWrapper key={footer.id} footer={footer} fixed />
                ))}

                {/* 列虚拟化左侧padding */}
                {(virtualize?.colPadding?.left ?? 0) > 0 ? <td /> : null}

                {/* 中间可滚动列(支持虚拟化) */}
                {(virtualize?.columns || centerFooters).map((footerOrVirtual) => {
                  const footer: typeof realFooters[0] =
                    'index' in footerOrVirtual
                      ? realFooters[footerOrVirtual.index]
                      : footerOrVirtual
                  if (!footer) return null

                  // 固定列不参与虚拟化
                  if (footer.column.getIsPinned()) return null

                  return <FooterCellWrapper key={footer.id} footer={footer} fixed />
                })}

                {/* 列虚拟化右侧padding */}
                {(virtualize?.colPadding?.right ?? 0) > 0 ? <td /> : null}

                {/* 右侧固定列 */}
                {rightFooters.map((footer) => (
                  <FooterCellWrapper key={footer.id} footer={footer} fixed />
                ))}
              </tr>
            )
          })}
      </tfoot>
    )
  },
  () => true // 始终不由外部触发重渲染
)
