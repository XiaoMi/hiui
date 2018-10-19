import Markdown from '../../../libs/markdown'

class Stepper extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/stepper.md`)
  }
}

export default Stepper
