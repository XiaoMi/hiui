import { __DEV__ } from '@hi-ui/env'
import { Popper, PopperProps } from './Popper'

/**
 * TODO: What is PopperPortal
 *
 * @deprecated Remove funcs when published RC
 */
export const PopperPortal = Popper

export interface PopperPortalProps extends PopperProps {}

if (__DEV__) {
  PopperPortal.displayName = 'PopperPortal'
}
