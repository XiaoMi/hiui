import Markdown from '../../../libs/markdown'

class Pagination extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/pagination.md`)
  }
}

export default Pagination
