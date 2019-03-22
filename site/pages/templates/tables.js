import Markdown from '../../../libs/markdown'
//  列表-概述
class TableDesc extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/table-desc.md`)
  }
}
//  基础型列表
class TableBasic extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/table-basic.md`)
  }
}
//  查询型列表
class TableQuery extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/table-query.md`)
  }
}
//  筛选型列表
class TableFilter extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/table-filter.md`)
  }
}
//  分组型列表
class TableGroup extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/table-group.md`)
  }
}
export default {
  'table-desc': TableDesc,
  'table-basic': TableBasic,
  'table-query': TableQuery,
  'table-filter': TableFilter,
  'table-group': TableGroup
}
