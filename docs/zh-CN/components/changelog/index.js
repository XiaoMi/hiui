import Markdown from '../../../../libs/markdown'

class Badge extends Markdown {
  document (locale) {
    return require(`../../../../CHANGELOG.md`)
  }
}

export default Badge
