import React from 'react'

export type HiBaseHTMLProps<T extends React.ElementType = any> = React.ComponentPropsWithoutRef<
  T
> & {
  prefixCls?: string
}
