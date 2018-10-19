import Markdown from '../../../libs/markdown'

class Alert extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/alert.md`)
  }
}

export default Alert
