import './styles/index.scss'

import type { PopperPortalProps } from './PopperPortal'

export * from './Popper'
export { Popper as default } from './Popper'

export * from './use-popper'

export * from './PopperPortal'

export type PopperOverlayProps = Pick<
  PopperPortalProps,
  | 'matchWidth'
  | 'className'
  | 'placement'
  | 'container'
  | 'disabledPortal'
  | 'arrow'
  | 'onOutsideClick'
  | 'closeOnOutsideClick'
>

const omitProps = [
  'matchWidth',
  'className',
  'placement',
  'container',
  'disabledPortal',
  'arrow',
  'autoFocus',
  'gutterGap',
  'crossGap',
  'preventOverflow',
  'flip',
  'matchWidth',
  'eventListeners',
  'scroll',
  'resize',
  'modifiers',
  'arrowPadding',
  'strategy',
  'zIndex',
  'closeOnEsc',
  'closeOnOutsideClick',
  'onOutsideClick',
  'preload',
  'unmountOnClose',
]

export const omitPopperOverlayProps = (props: Record<string, any>) => {
  const omittedProps: Record<string, any> = {}
  const restProps: Record<string, any> = {}
  Object.keys(props).forEach((key) => {
    if (omitProps.includes(key)) {
      omittedProps[key] = props[key]
    } else {
      restProps[key] = props[key]
    }
  })

  return [omittedProps, restProps] as const
}
