import Markdown from '../../../libs/markdown'

class Notification extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/notification.md`)
  }
}

export default Notification
