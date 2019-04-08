import Markdown from '../../../../libs/markdown'

class Notification extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/notification.md`)
  }
}

export default Notification
