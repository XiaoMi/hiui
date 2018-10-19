import Markdown from '../../../libs/markdown'

class Grid extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/grid.md`)
  }
}

export default Grid
