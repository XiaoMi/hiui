import Markdown from '../../../../libs/markdown'

class Table extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/table.md`)
  }
}

export default Table
