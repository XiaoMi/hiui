import Markdown from '../../../libs/markdown'

class Dropdown extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/dropdown.md`)
  }
}

export default Dropdown
