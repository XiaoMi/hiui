import { __DEV__ } from '@hi-ui/env'
import { Popper, PopperProps } from './Popper'

export const PopperPortal = Popper

export interface PopperPortalProps extends PopperProps {}

if (__DEV__) {
  PopperPortal.displayName = 'PopperPortal'
}
