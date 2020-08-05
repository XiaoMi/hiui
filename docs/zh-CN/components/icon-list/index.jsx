import React from 'react'
import DirectionIcon from './direction-icon'
import DataIcon from './data-icon'
import GeneralIcon from './general-icon'
import EditIcon from './edit-icon'
import TipIcon from './tip-icon'

import './style/icon.scss'

const IconList = () => {
  return (
    <React.Fragment>
      <DirectionIcon />
      <TipIcon />
      <EditIcon />
      <DataIcon />
      <GeneralIcon />
    </React.Fragment>
  )
}

export default IconList
