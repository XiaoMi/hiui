import Markdown from '../../../../libs/markdown'

class Stepper extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/stepper.md`)
  }
}

export default Stepper
