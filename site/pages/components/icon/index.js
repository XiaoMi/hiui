import Markdown from '../../../../libs/markdown'

class Icon extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/icon.md`)
  }
}

export default Icon
