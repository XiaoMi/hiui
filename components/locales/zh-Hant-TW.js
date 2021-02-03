export default {
  misc: {
    components: '基礎組件'
  },
  datePicker: {
    ok: '確認',
    to: '至',
    placeholder: '請選擇日期',
    placeholderTimeperiod: '請選擇日期時間',
    dateChoose: '日期選擇',
    timeChoose: '時間選擇',
    undefinedType: '類型未定義',
    lastWeek: '近一周',
    lastMonth: '近一月',
    lastThreeMonth: '近三月',
    lastSixMonth: '近半年',
    lastYear: '近一年',
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    week: ['日', '一', '二', '三', '四', '五', '六'],
    placeholders: {
      date: '請選擇日期',
      month: '請選擇月',
      year: '請選擇年',
      time: '請選擇時間',
      daterange: ['開始日期', '結束日期'],
      yearrange: ['開始年', '結束年'],
      monthrange: ['開始月', '結束月'],
      week: '請選擇周',
      weekrange: ['開始周', '結束周'],
      timeperiod: ['開始日期時間', '結束日期時間']
    },
    year: '年',
    timePeriod: '時間段',
    hours: '時',
    minutes: '分',
    seconds: '秒',
    weekrange: function (year, week) {
      return year + '-W' + week
    }
  },
  pagination: {
    total: ['共', '條'],
    simple: ['第', '頁', '共', '頁', '條記錄'],
    item: '條',
    itemPerPage: '頁',
    goto: '前往',
    page: '頁'
  },
  cascader: {
    placeholder: '請選擇',
    noFoundTip: '無匹配數據'
  },
  select: {
    placeholder: '請選擇',
    emptyContent: '無匹配數據',
    searchPlaceholder: '搜索',
    checkAll: '全選'
  },
  transfer: {
    checkAll: '全選',
    items: '項',
    searchPlaceholder: '搜索',
    emptyContent: '暫無數據',
    limit: '數量達上限，無法添加'
  },
  upload: {
    buttonText: '本地上傳',
    uploadSuccess: '上傳成功',
    uploadFailed: '上傳失敗',
    cancel: '取消',
    delete: '刪除',
    drag: '拖拽文件上傳',
    dragTips: '請點擊或拖拽文件上傳',
    dragTipsLimited: '數量已達上限',
    preview: '預覽',
    modalTiptitle: '上傳失敗',
    modalTiptxt: '該上傳文件超過指定上傳文件大小',
    modalBtn: '我知道了',
    modalTitle: '提示'
  },
  modal: {
    confirmText: '確定',
    cancelText: '取消'
  },
  tabs: {
    more: '更多'
  },
  timeline: {
    expand: '展開',
    collapse: '收起'
  },
  form: {
    colon: '：'
  },
  tree: {
    addNode: '添加節點',
    addChildNode: '添加子節點',
    edit: '編輯節點',
    del: '刪除',
    confirm: '確認',
    cancel: '取消',
    nodePlaceholder: '請輸入節點名稱',
    searchPlaceholder: '關鍵詞搜索',
    searchEmptyResult: '未找到搜索結果',
    modalTitle: '提示',
    delTips: '刪除節點將刪除所有子節點，確定刪除嗎？'
  },
  table: {
    highlight: '高亮',
    freeze: '凍結',
    hide: '隱藏',
    meanValue: '均值',
    emptyText: '暫無數據'
  }
}
