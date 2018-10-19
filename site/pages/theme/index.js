import Markdown from '../../../libs/markdown'

class Theme extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/theme.md`)
  }
}

export default Theme
