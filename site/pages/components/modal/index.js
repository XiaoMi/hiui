import Markdown from '../../../../libs/markdown'

class Modal extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/modal.md`)
  }
}

export default Modal
