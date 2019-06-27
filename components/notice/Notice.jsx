import React, { Component } from 'react'
import Icon from '../icon'
import { CSSTransition } from 'react-transition-group'
export default class Notice extends Component {
  state = { open: false }
  componentDidMount() {
    this.setState({
      open: true
    })
    setTimeout(() => {
        this.setState({open:false})
    }, this.props.duration || 3000)
  }

  closeNotice = e => {
    if (e) {
      e.stopPropagation()
    }
    this.props.onClose(this.props.id)
  }

  render() {
    const { closable, children, prefix } = this.props
    const { open } = this.state
    return (
      <CSSTransition in={open}  timeout={0} classNames={`hi-${prefix}`} onExited={()=> {
        setTimeout(()=>this.closeNotice(),300)
      }} >
        <div>
          <div>{children}</div>
          {closable && <Icon name="close" onClick={this.closeNotice} />}
        </div>
      </CSSTransition>
    )
  }
}
