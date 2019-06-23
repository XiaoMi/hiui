import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import NoticeContainer from './NoticeContainer'

const noticeInstance = {
}

function open ({prefix, ...noticeProps}) {
  if (!noticeInstance[prefix]) {
    const noticeContainer = document.createElement('div')
    document.body.appendChild(noticeContainer)
    const containterRef = React.createRef()
    const noti = React.createElement(
      NoticeContainer,
      {ref: containterRef}
    )
    render(noti, noticeContainer)
    containterRef.current.addNotice(noticeProps)
    noticeInstance[prefix] = {
      add: () => containterRef.current.addNotice(noticeProps),
      remove: () => containterRef.current.removeNotice(noticeProps.key),
      destory: () => {
        unmountComponentAtNode(noticeContainer)
        noticeContainer.parentNode.removeChild(noticeContainer)
      }
    }
  } else {
    noticeInstance[prefix].add()
  }
}
export default open
