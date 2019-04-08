import Markdown from '../../../../libs/markdown'

class Typography extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/typography.md`)
  }
}

export default Typography
