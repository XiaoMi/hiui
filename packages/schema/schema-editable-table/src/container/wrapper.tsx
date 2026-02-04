import React from 'react'

import { Empty } from '@hi-ui/schema-table-extensions'

import { useEditableSchemaTableCtx } from '../ctx'
import { RowSelection } from '../features/row-selection/wrapper'
import { RowOperation } from '../features/row-operation'
import { cls } from '../utils/cls'
import { useTableContainer } from './ctx'

export type TableHeaderProps = React.PropsWithChildren<{
  sticky?: boolean
  stickyOffset?: number
}>

export type TableFooterProps = React.PropsWithChildren<{
  sticky?: boolean
  stickyOffset?: number
}>

export function TableHeader({ children, sticky, stickyOffset }: TableHeaderProps) {
  const { headerRef, ...rest } = useTableContainer()
  const { rowSelection, rowOperation } = useEditableSchemaTableCtx().propsRef.current

  const className = cls('header-wrapper', {
    'header-wrapper--sticky': sticky,
  })

  return (
    <div
      ref={headerRef}
      className={className}
      style={sticky && stickyOffset !== undefined ? { top: stickyOffset } : undefined}
    >
      {rowSelection ? <RowSelection.Header /> : null}
      <table className={cls('main-content')}>
        {rest.colGroup}
        {children}
      </table>
      {rowOperation ? <RowOperation.Header /> : null}
    </div>
  )
}

export function TableBody(props: React.PropsWithChildren<unknown>) {
  const { bodyRef, ...rest } = useTableContainer()
  const { propsRef, globalStaticRef } = useEditableSchemaTableCtx()
  const { rowSelection, rowOperation } = propsRef.current

  return (
    <div ref={bodyRef} className={cls('body-wrapper')}>
      {globalStaticRef.current.isEmpty ? (
        <div className="full-box flex-center">
          <Empty />
        </div>
      ) : (
        <>
          {rowSelection ? <RowSelection.Body /> : null}
          <table className={cls('main-content')}>
            {rest.colGroup}
            {props.children}
          </table>
          {rowOperation ? <RowOperation.Body /> : null}
        </>
      )}
    </div>
  )
}

export function TableFooter({ children, sticky, stickyOffset }: TableFooterProps) {
  const { footerRef, ...rest } = useTableContainer()
  const { rowSelection, rowOperation } = useEditableSchemaTableCtx().propsRef.current

  const className = cls('footer-wrapper', {
    'footer-wrapper--sticky': sticky,
  })

  return (
    <div
      ref={footerRef}
      className={className}
      style={sticky && stickyOffset !== undefined ? { bottom: stickyOffset } : undefined}
    >
      {rowSelection ? <RowSelection.Footer /> : null}
      <table className={cls('main-content')}>
        {rest.colGroup}
        {children}
      </table>
      {rowOperation ? <RowOperation.Footer /> : null}
    </div>
  )
}
