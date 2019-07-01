import Markdown from '../../../libs/markdown'

class I18n extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/components/i18n.md`)
  }
}

export default I18n
