import React from 'react'
import { IconProps } from './props'

export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement | null>
>
