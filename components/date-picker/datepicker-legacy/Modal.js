import {Component} from 'react'
import ReactDOM from 'react-dom'
import clickOutSide from 'react-click-outside'
class Modal extends Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this._body = document.body
  }

  componentDidMount () {
    this._body.appendChild(this.el)
  }
  handleClickOutside (e) {
    this.props.clickOutSide(e)
  }
  componentWillUnmount () {
    this._body.removeChild(this.el)
  }
  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}
export default clickOutSide(Modal)
