import Markdown from '../../../libs/markdown'
import forms from './forms'
import tables from './tables'
//  门户
class Home extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/home-desc.md`)
  }
}
class Portal extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/portal.md`)
  }
}
// Dashboard
class Dashboard extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/dashboard.md`)
  }
}

//  工作台
class Workbench extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/workbench.md`)
  }
}

export default {
  documents: {
    // start: Portal
  },
  components: {
    'home': {
      'home-desc': Home,
      portal: Portal,
      dashboard: Dashboard,
      workbench: Workbench
      // 'values': require('./design-values'),
      // 'principles': require('./design-principles')
    },
    'forms': {
      ...forms
    },
    'tables': {
      ...tables
    }
  }
}
