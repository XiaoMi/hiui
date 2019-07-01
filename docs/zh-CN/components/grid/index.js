import Markdown from '../../../../libs/markdown'

class Grid extends Markdown {
  document (locale) {
    return require('../grid.md')
  }
}

export default Grid
