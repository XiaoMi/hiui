import open from '../notice'
import './style/index'

const notification = {
  open: ({
    title,
    content,
    prefix = 'notification',
    key = Math.random(),
    duration,
    closable = true,
    type = 'info',
    confirmText,
    onConfirm,
    onClose
  }) => {
    open({
      title,
      content,
      prefix,
      key,
      closable,
      duration,
      type,
      confirmText,
      onConfirm,
      onClose
    })
  }
}

export default notification
