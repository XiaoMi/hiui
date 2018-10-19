import Markdown from '../../../libs/markdown'

class Collapse extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/collapse.md`)
  }
}

export default Collapse
