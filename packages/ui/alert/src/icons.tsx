import React from 'react'

import {
  InfoCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseOutlined,
} from '@hi-ui/icons'
import { AlertTypeEnum } from './types'

export const alertIconMap = {
  [AlertTypeEnum.SUCCESS]: <CheckCircleFilled />,
  [AlertTypeEnum.DANGER]: <CloseCircleFilled />,
  [AlertTypeEnum.WARNING]: <ExclamationCircleFilled />,
  [AlertTypeEnum.PRIMARY]: <InfoCircleFilled />,
}

export const defaultCloseIcon = <CloseOutlined />
