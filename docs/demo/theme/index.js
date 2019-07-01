import Markdown from '../../../libs/markdown'

class Theme extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/components/theme.md`)
  }
}

export default Theme
