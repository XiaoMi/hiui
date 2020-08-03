import React from 'react'
import NormalUpload from './NormalUpload'
import DragUpload from './DragUpload'
import PictureUpload from './PictureUpload'
import AvatarUpload from './AvatarUpload'
import PictureListUpload from './PictureListUpload'
import './style/index'
import Provider from '../context'

const Upload = (props) => {
  const { type } = props
  if (type === 'drag') {
    return <DragUpload {...props} />
  } else if (type === 'photo') {
    return <PictureUpload {...props} />
  } else if (type === 'avatar') {
    return <AvatarUpload {...props} />
  } else if (type === 'pictureCard') {
    return <PictureListUpload {...props} />
  } else {
    return <NormalUpload {...props} />
  }
}

export default Provider(Upload)
