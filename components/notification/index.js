// import React, { Component } from 'react'
// import { render, unmountComponentAtNode } from 'react-dom'
// import classNames from 'classnames'
import open from '../notice'
import './style/index'

const notification = {
  open: ({
    title,
    content,
    prefix = 'notification',
    key = Math.random(),
    duration,
    closable = true,
    type = 'info'
  }) => {
    open({
      title,
      content,
      prefix,
      key,
      closable,
      type
    })
  }
}

export default notification
