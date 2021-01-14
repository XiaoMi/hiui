export default {
  misc: {
    components: '基础组件'
  },
  datePicker: {
    ok: '确认',
    to: '至',
    placeholder: '请选择日期',
    placeholderTimeperiod: '请选择日期时间',
    dateChoose: '日期选择',
    timeChoose: '时间选择',
    undefinedType: '类型未定义',
    lastWeek: '近一周',
    lastMonth: '近一月',
    lastThreeMonth: '近三月',
    lastSixMonth: '近半年',
    lastYear: '近一年',
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    week: ['日', '一', '二', '三', '四', '五', '六'],
    placeholders: {
      date: '请选择日期',
      month: '请选择月',
      year: '请选择年',
      time: '请选择时间',
      daterange: ['开始日期', '结束日期'],
      yearrange: ['开始年', '结束年'],
      monthrange: ['开始月', '结束月'],
      week: '请选择周',
      weekrange: ['开始周', '结束周'],
      timeperiod: ['开始日期时间', '结束日期时间']
    },
    year: '年',
    timePeriod: '时间段',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    weekrange: function (year, week) {
      return year + '-W' + week
    }
  },
  pagination: {
    total: ['共', '条'],
    simple: ['第', '页', '共', '页', '条记录'],
    item: '条',
    itemPerPage: '页',
    goto: '前往',
    page: '页'
  },
  cascader: {
    placeholder: '请选择',
    noFoundTip: '无匹配数据'
  },
  select: {
    placeholder: '请选择',
    emptyContent: '无匹配数据',
    searchPlaceholder: '搜索',
    checkAll: '全选'
  },
  transfer: {
    checkAll: '全选',
    items: '项',
    searchPlaceholder: '搜索',
    emptyContent: '暂无数据',
    limit: '数量达上限，无法添加'
  },
  upload: {
    buttonText: '本地上传',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    cancel: '取消',
    delete: '删除',
    drag: '拖拽文件上传',
    dragTips: '请点击或拖拽文件上传',
    dragTipsLimited: '数量已达上限',
    preview: '预览',
    modalTiptitle: '上传失败',
    modalTiptxt: '该上传文件超过指定上传文件大小',
    modalBtn: '我知道了',
    modalTitle: '提示'
  },
  modal: {
    confirmText: '确定',
    cancelText: '取消'
  },
  tabs: {
    more: '更多'
  },
  timeline: {
    expand: '展开',
    collapse: '收起'
  },
  form: {
    colon: '：'
  },
  tree: {
    addNode: '添加节点',
    addChildNode: '添加子节点',
    edit: '编辑节点',
    del: '删除',
    confirm: '确认',
    cancel: '取消',
    nodePlaceholder: '请输入节点名称',
    searchPlaceholder: '关键词搜索',
    searchEmptyResult: '未找到搜索结果',
    modalTitle: '提示',
    delTips: '删除节点将删除所有子节点，确定删除吗？'
  },
  table: {
    highlight: '高亮',
    freeze:'冻结',
    hide:'隐藏',
    meanValue:'均值',
    emptyText:'暂无数据'
  }
}
