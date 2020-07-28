import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Modal from '../modal'
import './style/index'
import Provider from '../context'

class Confirm extends Component {
  render () {
    let { content, onOk, onCancel, title, localeDatas } = this.props

    return (
      <div className='hi-confirm'>
        <Modal
          localeDatas={localeDatas}
          title={title}
          ref='hi-confirm'
          show
          size='small'
          adaptive
          backDrop
          showTitle
          showFooter
          confirmType='default'
          cancelType='danger'
          onConfirm={() => {
            if (onOk) {
              onOk()
            }
            confirmInstance.destroy()
          }}
          onCancel={() => {
            if (onCancel) {
              onCancel()
            }

            confirmInstance.destroy()
          }}
        >
          {content}
        </Modal>
      </div>
    )
  }
}
Confirm.IS_HIUI_CONFIRM = true
Confirm.newInstance = function newNotificationInstance (properties) {
  let props = properties || {}
  let div = document.createElement('div')
  document.body.appendChild(div)
  ReactDOM.render(React.createElement(Provider(Confirm), props), div)
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
