import Markdown from '../../../libs/markdown'

class Modal extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/modal.md`)
  }
}

export default Modal
