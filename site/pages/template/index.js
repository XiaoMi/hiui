import Markdown from '../../../libs/markdown'

class Template extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/template.md`)
  }
}

export default Template
