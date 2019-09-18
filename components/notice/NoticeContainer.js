import React, { Component } from 'react'
import Notice from './Notice'

export default class NoticeContainer extends Component {
  state = {
    queue: []
  }
  addNotice = notice => {
    const _queue = [...this.state.queue]
    _queue.push(notice)
    this.setState({
      queue: _queue
    })
  }
  removeNotice = noticeKey => {
    const _queue = [...this.state.queue]
    let idx = _queue.findIndex(item => item.key === noticeKey)
    _queue.splice(idx, 1)
    this.setState({
      queue: _queue
    })
  }
  render () {
    const { queue } = this.state
    const { prefix } = this.props
    return (
      <div className={`hi-${prefix}__container`}>
        {queue.map((notice, index) => {
          return (
            <Notice
              key={notice.key}
              id={notice.key}
              onClose={noticeId => {
                this.removeNotice(noticeId)
                notice.onClose && notice.onClose()
              }}
              duration={notice.duration}
              prefix={prefix}
              type={notice.type}
              closeable={notice.closeable}
              onConfirm={notice.onConfirm}
            >
              {notice.content}
            </Notice>
          )
        })}
      </div>
    )
  }
}
