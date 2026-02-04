import React from 'react'
import { getDataSet } from '@hi-ui/schema-utils'

export type ReadonlyWrapperProps = {
  children: React.ReactNode
  dataSet?: Record<string, Primitive | undefined>
  style?: React.CSSProperties
}

export function ReadonlyWrapper(props: ReadonlyWrapperProps) {
  const dataSet = getDataSet(props.dataSet)

  return (
    <span data-case="readonly" {...dataSet} style={props.style}>
      {props.children}
    </span>
  )
}

export { ReadonlyWrapper as Span }
