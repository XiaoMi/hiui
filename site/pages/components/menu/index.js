import Markdown from '../../../../libs/markdown'

class Menu extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/menu.md`)
  }
}

export default Menu
