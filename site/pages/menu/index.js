import Markdown from '../../../libs/markdown'

class Menu extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/menu.md`)
  }
}

export default Menu
