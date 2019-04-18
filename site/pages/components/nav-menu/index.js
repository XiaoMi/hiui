import Markdown from '../../../../libs/markdown'

class NavMenu extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/nav-menu.md`)
  }
}

export default NavMenu
