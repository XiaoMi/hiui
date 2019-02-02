import Markdown from '../../../libs/markdown'

class Design extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/design-template.md`)
  }
}

export default Design
