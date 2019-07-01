import Markdown from '../../../../libs/markdown'

class Typography extends Markdown {
  document(locale) {
    return require(`../typography.md`)
  }
}

export default Typography
