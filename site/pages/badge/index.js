import Markdown from '../../../libs/markdown'

class Badge extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/badge.md`)
  }
}

export default Badge
