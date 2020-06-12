import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import Modal from '../modal'
import './style/index'

class Confirm extends Component {
  render () {
    let {tip, onOk, onCancel} = this.props

    return (
      <div className='hi-confirm'>
        <Modal
          title=''
          ref='hi-confirm'
          show
          size='small'
          adaptive
          backDrop
          showTitle
          showFooter
          confirmType='default'
          cancelType='danger'
          onConfirm={() => (function () {
            onOk()

            confirmInstance.destroy()
          }())}
          onCancel={() => (function () {
            onCancel()

            confirmInstance.destroy()
          }())}
        >
          {tip}

        </Modal>
      </div>

    )
  }

  componentDidMount () {
    Modal.show.call(this, 'hi-confirm')
  }
}

Confirm.propTypes = {
  tip: PropTypes.string,
  onOk: PropTypes.function,
  onCancel: PropTypes.function
}

Confirm.newInstance = function newNotificationInstance (properties) {
  let props = properties || {}
  let div = document.createElement('div')
  document.body.appendChild(div)
  ReactDOM.render(React.createElement(Confirm, props), div)
  return {
    destroy () {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
      confirmInstance = null
    }
  }
}

let confirmInstance = null
export default function getConfirmInstance (obj) {
  confirmInstance = Confirm.newInstance(obj)
  return confirmInstance
}
