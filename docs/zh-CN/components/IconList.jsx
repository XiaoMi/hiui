import React from 'react'
import Icon from '../../../components/icon'

const directionIconMap = [
  {
    name: 'up',
    text: '上'
  },
  {
    name: 'down',
    text: '下'
  },
  {
    name: 'left',
    text: '左'
  },
  {
    name: 'right',
    text: '右'
  },
  {
    name: 'caret-up',
    text: '符号-上'
  },
  {
    name: 'caret-down',
    text: '符号-下'
  },
  {
    name: 'caret-left',
    text: '符号-左'
  },
  {
    name: 'caret-right',
    text: '符号-右'
  },
  {
    name: 'double-left',
    text: '双箭头-左'
  },
  {
    name: 'double-right',
    text: '双箭头-右'
  },
  {
    name: 'to-top',
    text: '置顶'
  },
  {
    name: 'to-bottom',
    text: '置底'
  },
  {
    name: 'fullscreen',
    text: '全屏'
  },
  {
    name: 'fullscreen-exit',
    text: '全屏-退出'
  },
  {
    name: 'menu-fold',
    text: '菜单-收起'
  },
  {
    name: 'menu-unfold',
    text: '菜单-展开'
  },
  {
    name: 'expand',
    text: '展开'
  },
  {
    name: 'shrink',
    text: '收起'
  }
]

const tipIconMap = [
  {
    name: 'check',
    text: '通过'
  },
  {
    name: 'check-circle',
    text: '通过-圆形'
  },
  {
    name: 'check-square',
    text: '通过-方形'
  },
  {
    name: 'close',
    text: '关闭'
  },
  {
    name: 'close-circle',
    text: '关闭-圆形'
  },
  {
    name: 'exclamation',
    text: '感叹'
  },
  {
    name: 'exclamation-circle',
    text: '感叹-圆形'
  },
  {
    name: 'info',
    text: '信息'
  },
  {
    name: 'info-circle',
    text: '信息-圆形'
  },
  {
    name: 'minus',
    text: '减号'
  },
  {
    name: 'minus-square',
    text: '减号-方形'
  },
  {
    name: 'plus',
    text: '加号'
  },
  {
    name: 'plus-square',
    text: '加号-方形'
  },
  {
    name: 'question',
    text: '问号'
  },
  {
    name: 'question-circle',
    text: '问号-圆形'
  },
  {
    name: 'warning',
    text: '警告'
  },
  {
    name: 'stop',
    text: '停止'
  }
]
const dataIconMap = [
  {
    name: 'bar-chart',
    text: '柱状图'
  },
  {
    name: 'line-chart',
    text: '折线图'
  },
  {
    name: 'pie-chart',
    text: '饼图'
  },
  {
    name: 'stock',
    text: '股票'
  }
]

const editIconMap = [
  {
    name: 'average',
    text: '平均值'
  },
  {
    name: 'columns',
    text: '多列'
  },
  {
    name: 'column-height',
    text: '列高'
  },
  {
    name: 'copy',
    text: '拷贝'
  },
  {
    name: 'delete',
    text: '删除'
  },
  {
    name: 'drag',
    text: '拖拽'
  },
  {
    name: 'document-search',
    text: '文档-查询'
  },
  {
    name: 'duplicate',
    text: '复制'
  },
  {
    name: 'edit',
    text: '编辑'
  },
  {
    name: 'ellipsis-circle',
    text: '省略-圆形'
  },
  {
    name: 'ellipsis',
    text: '省略'
  },
  {
    name: 'filter',
    text: '漏斗'
  },
  {
    name: 'folder-add',
    text: '文件夹-添加'
  },
  {
    name: 'folder-move',
    text: '文件夹-移动'
  },
  {
    name: 'freeze-column',
    text: '列冻结'
  },
  {
    name: 'paste',
    text: '粘贴'
  },
  {
    name: 'rotate-left',
    text: '旋转-左'
  },
  {
    name: 'rotate-right',
    text: '旋转-右'
  },
  {
    name: 'save',
    text: '保存'
  },
  {
    name: 'scissor',
    text: '剪刀'
  },
  {
    name: 'sort-ascending',
    text: '排列-降序'
  },
  {
    name: 'sort-descending',
    text: '排列-升序'
  },
  {
    name: 'summation',
    text: '求和'
  },
  {
    name: 'zoom-in',
    text: '放大'
  },
  {
    name: 'zoom-out',
    text: '缩小'
  }
]

const normalIconMap = [
  {
    name: 'alarm-clock',
    text: '闹钟'
  },
  {
    name: 'alarm',
    text: '警报'
  },
  {
    name: 'app-store',
    text: '应用中心'
  },
  {
    name: 'approve',
    text: '审批'
  },
  {
    name: 'archive',
    text: '归档'
  },
  {
    name: 'asset-monitor',
    text: '监视器-资产'
  },
  {
    name: 'audio',
    text: '音频'
  },
  {
    name: 'bank-card',
    text: '银行卡'
  },
  {
    name: 'bars',
    text: '菜单栏'
  },
  {
    name: 'bell',
    text: '铃铛'
  },
  {
    name: 'block',
    text: '区块'
  },
  {
    name: 'bookmark',
    text: '书签'
  },
  {
    name: 'building',
    text: '大楼'
  },
  {
    name: 'bulb',
    text: '灯泡'
  },
  {
    name: 'calculator',
    text: '计算器'
  },
  {
    name: 'camera',
    text: '相机'
  },
  {
    name: 'chat',
    text: '聊天'
  },
  {
    name: 'close-code',
    text: '代码-收起'
  },
  {
    name: 'cloud-download',
    text: '云-下载'
  },
  {
    name: 'cloud',
    text: '云'
  },
  {
    name: 'cloud-upload',
    text: '云-上传'
  },
  {
    name: 'collection',
    text: '收藏集'
  },
  {
    name: 'data-monitor',
    text: '监视器-数据'
  },
  {
    name: 'diagram',
    text: '图例'
  },
  {
    name: 'document-exclamation',
    text: '文档-感叹'
  },
  {
    name: 'download',
    text: '下载'
  },
  {
    name: 'end-date',
    text: '结束日期'
  },
  {
    name: 'expression',
    text: '表情'
  },
  {
    name: 'eye-invisible',
    text: '眼睛-不可见'
  },
  {
    name: 'eye',
    text: '眼睛'
  },
  {
    name: 'file',
    text: '文件'
  },
  {
    name: 'fire',
    text: '火焰'
  },
  {
    name: 'flag',
    text: '旗帜'
  },
  {
    name: 'folder-open',
    text: '文件夹-打开'
  },
  {
    name: 'global',
    text: '全球'
  },
  {
    name: 'heart',
    text: '爱心'
  },
  {
    name: 'home',
    text: '家'
  },
  {
    name: 'import',
    text: '导入'
  },
  {
    name: 'key',
    text: '钥匙'
  },
  {
    name: 'lightning',
    text: '闪电'
  },
  {
    name: 'like',
    text: '喜欢'
  },
  {
    name: 'link',
    text: '链接'
  },
  {
    name: 'location',
    text: '定位'
  },
  {
    name: 'lock',
    text: '锁定'
  },
  {
    name: 'mail',
    text: '邮件'
  },
  {
    name: 'mail-open',
    text: '邮件-打开'
  },
  {
    name: 'mail-send',
    text: '邮件-发送'
  },
  {
    name: 'man',
    text: '男性'
  },
  {
    name: 'message',
    text: '消息'
  },
  {
    name: 'mobile',
    text: '手机'
  },
  {
    name: 'monitor',
    text: '监视器'
  },
  {
    name: 'moon',
    text: '月亮'
  },
  {
    name: 'pad',
    text: '平板'
  },
  {
    name: 'pause',
    text: '暂停'
  },
  {
    name: 'phone',
    text: '电话'
  },
  {
    name: 'picture',
    text: '电话'
  },
  {
    name: 'pin',
    text: '图钉'
  },
  {
    name: 'play',
    text: '播放'
  },
  {
    name: 'power-off',
    text: '关机'
  },
  {
    name: 'printer',
    text: '打印机'
  },
  {
    name: 'qr-code',
    text: '二维码'
  },
  {
    name: 'relation',
    text: '关系'
  },
  {
    name: 'search',
    text: '搜索'
  },
  {
    name: 'setting',
    text: '设置'
  },
  {
    name: 'share',
    text: '分享'
  },
  {
    name: 'shop',
    text: '商店'
  },
  {
    name: 'shopping',
    text: '购物'
  },
  {
    name: 'show-code',
    text: '代码-展示'
  },
  {
    name: 'skin',
    text: '皮肤'
  },
  {
    name: 'sound',
    text: '声音'
  },
  {
    name: 'star',
    text: '星星'
  },
  {
    name: 'start-date',
    text: '开始日期'
  },
  {
    name: 'sun',
    text: '太阳'
  },
  {
    name: 'tag',
    text: '标签'
  },
  {
    name: 'task',
    text: '任务'
  },
  {
    name: 'template',
    text: '模版'
  },
  {
    name: 'time',
    text: '时间'
  },
  {
    name: 'time-rewind',
    text: '时间-回退'
  },
  {
    name: 'tool',
    text: '工具'
  },
  {
    name: 'travel',
    text: '旅行'
  },
  {
    name: 'unlock',
    text: '解锁'
  },
  {
    name: 'update',
    text: '更新'
  },
  {
    name: 'user-add',
    text: '用户-添加'
  },
  {
    name: 'user',
    text: '用户'
  },
  {
    name: 'users',
    text: '用户组'
  },
  {
    name: 'video-camera',
    text: '摄像机'
  },
  {
    name: 'webpage',
    text: '网页'
  },
  {
    name: 'woman',
    text: '女性'
  }
]

const IconList = () => {
  return (
    <div className='hi-icon-list'>
      <ul className='hi-icon-list'>
        {directionIconMap.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
        {tipIconMap.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
        {dataIconMap.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
        {editIconMap.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
        {normalIconMap.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default IconList
