import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import NoticeContainer from './NoticeContainer'
import './style/index'
const noticeInstance = {}

function open ({ prefix, ...noticeProps }) {
  console.log()
  if (!noticeInstance[prefix]) {
    const noticeContainer = document.createElement('div')
    document.body.appendChild(noticeContainer)
    const containterRef = React.createRef()
    const noti = React.createElement(NoticeContainer, { ref: containterRef, prefix })
    render(noti, noticeContainer)
    containterRef.current.addNotice(noticeProps)
    noticeInstance[prefix] = {
      add: notice => containterRef.current.addNotice(notice),
      remove: key => containterRef.current.removeNotice(key),
      destory: () => {
        unmountComponentAtNode(noticeContainer)
        noticeContainer.parentNode.removeChild(noticeContainer)
      }
    }
  } else {
    noticeInstance[prefix].add(noticeProps)
  }
}
export default open
