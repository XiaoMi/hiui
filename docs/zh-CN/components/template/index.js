import Markdown from '../../../../libs/markdown'

class Template extends Markdown {
  document(locale) {
    return require(`../template.md`)
  }
}

export default Template
