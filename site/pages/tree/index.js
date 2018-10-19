import Markdown from '../../../libs/markdown'

class Tree extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/tree.md`)
  }
}

export default Tree
