import Markdown from '../../../../libs/markdown'

class Theme extends Markdown {
  document(locale) {
    return require(`../theme.md`)
  }
}

export default Theme
