import React, { Component } from 'react'
import Notice from './Notice'

export default class NoticeContainer extends Component {
  state = {
    queue: []
  }
  addNotice = notice => {
    console.log('noticeKey', notice.key)
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
  render() {
    const { queue } = this.state

    const { prefix } = this.props
    return (
      <div className={`hi-${prefix}__container`}>
        {queue.map((notice, index) => {
          console.log('key', notice.key)
          return (
            <Notice
              key={notice.key}
              id={notice.key}
              onClose={this.removeNotice}
              duration={notice.duration}
              prefix={prefix}
            >
              <div>{notice.title}</div>
              <div>{notice.content}</div>
            </Notice>
          )
        })}
      </div>
    )
  }
}
