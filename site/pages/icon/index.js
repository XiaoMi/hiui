import Markdown from '../../../libs/markdown'

class Icon extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/icon.md`)
  }
}

export default Icon
