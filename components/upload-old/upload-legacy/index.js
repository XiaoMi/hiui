import React, { Component } from 'react'
import UploadClick from './UploadClick'
import UploadDrag from './UploadDrag'
import UploadPhoto from './UploadPhoto'
import UploadAvatar from './UploadAvatar'
import UploadPictureCard from './UploadPictureCard'
import './style/index'

export default class Upload extends Component {
  render () {
    const { type } = this.props
    if (type === 'normal') {
      return <UploadClick {...this.props} />
    } else if (type === 'drag') {
      return <UploadDrag {...this.props} />
    } else if (type === 'photo') {
      return <UploadPhoto {...this.props} />
    } else if (type === 'avatar') {
      return <UploadAvatar {...this.props} />
    } else if (type === 'pictureCard') {
      return <UploadPictureCard {...this.props} />
    }
  }
}
