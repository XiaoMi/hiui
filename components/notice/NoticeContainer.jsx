import React, { Component } from 'react'
import Notice from './Notice'

export default class NoticeContainer extends Component {
  state = {
    queue: []
  }
  addNotice = (notice) => {
    const _queue = [...this.state.queue]
    _queue.push(notice)
    this.setState({
      queue: _queue
    })
  }
  removeNotice = (noticeKey) => {
    const _queue = [...this.state.queue]
    let idx = _queue.findIndex(item => item.key === noticeKey)
    _queue.splice(idx, 1)
    this.setState({
      queue: _queue
    })
  }
  render () {
    const {queue} = this.state
    return (
      <div style={{position: 'absolute', top: 20, zIndex: 10000}}>
        {queue.map((notice, index) => {
          return <Notice key={notice.key} id={notice.key} onClose={this.removeNotice} duration={notice.duration}>
            <div>{notice.title}</div>
            <div>{notice.content}</div>
          </Notice>
        })}
      </div>
    )
  }
}
