import React, { Component } from 'react'
import Notice from './Notice'
import Button from '../button'

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
  render() {
    const { queue } = this.state
    const { prefix } = this.props
    return (
      <div className={`hi-${prefix}__container`}>
        {queue.map((notice, index) => {
          return (
            <Notice
              key={notice.key}
              id={notice.key}
              onClose={this.removeNotice}
              duration={notice.duration}
              prefix={prefix}
              type={notice.type}
              closable={notice.closable}
              isSingle={!notice.content}
              onClose={notice.onClose}
              onConfirm={notice.onConfirm}
            >
              {notice.title && <div className={`hi-${prefix}__title`}>{notice.title}</div>}
              {notice.content && <div className={`hi-${prefix}__content`}>{notice.content}</div>}
              {notice.onConfirm && (
                <div style={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => {
                      notice.onConfirm()
                    }}
                  >
                    {notice.confirmText || '确认'}
                  </Button>
                </div>
              )}
            </Notice>
          )
        })}
      </div>
    )
  }
}
