import Markdown from '../../../libs/markdown'

class Table extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/table.md`)
  }
}

export default Table
