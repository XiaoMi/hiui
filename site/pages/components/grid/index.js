import Markdown from '../../../../libs/markdown'

class Grid extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/grid.md`)
  }
}

export default Grid
