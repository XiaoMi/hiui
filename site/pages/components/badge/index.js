import Markdown from '../../../../libs/markdown'

class Badge extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/badge.md`)
  }
}

export default Badge
