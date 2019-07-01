import Markdown from '../../../../libs/markdown'

class Icon extends Markdown {
  document(locale) {
    return require(`../icon.md`)
  }
}

export default Icon
