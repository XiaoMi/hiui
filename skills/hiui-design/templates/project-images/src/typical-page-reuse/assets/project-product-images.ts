import airConditionerImage from './product-catalog/air-conditioner.png'
import earbudsImage from './product-catalog/earbuds.png'
import laptopImage from './product-catalog/laptop.png'
import phoneFamilyImage from './product-catalog/phone-family.png'
import phonePremiumImage from './product-catalog/phone-premium.png'
import phoneImage from './product-catalog/phone.png'
import rangeHoodImage from './product-catalog/range-hood.png'
import refrigeratorImage from './product-catalog/refrigerator.png'
import robotVacuumImage from './product-catalog/robot-vacuum.png'
import routerImage from './product-catalog/router.png'
import smartDisplayImage from './product-catalog/smart-display.png'
import smartLockImage from './product-catalog/smart-lock.png'
import tabletImage from './product-catalog/tablet.png'
import tvImage from './product-catalog/tv.png'
import washerImage from './product-catalog/washer.png'
import waterPurifierImage from './product-catalog/water-purifier.png'

export type ProjectProductImageKey =
  | 'phone'
  | 'phone-family'
  | 'phone-premium'
  | 'tablet'
  | 'watch'
  | 'earbuds'
  | 'speaker'
  | 'projector'
  | 'camera'
  | 'smart-band'
  | 'power-bank'
  | 'scooter'
  | 'laptop'
  | 'tv'
  | 'refrigerator'
  | 'robot-vacuum'
  | 'router'
  | 'range-hood'
  | 'smart-display'
  | 'smart-lock'
  | 'air-conditioner'
  | 'washer'
  | 'water-purifier'

export type ProjectProductImageEntry = {
  key: ProjectProductImageKey
  aliases: string[]
  usage: string
}

export const expectedProductImageFilenames: Record<ProjectProductImageKey, string> = {
  phone: 'phone.png',
  'phone-family': 'phone-family.png',
  'phone-premium': 'phone-premium.png',
  tablet: 'tablet.png',
  watch: 'watch.png',
  earbuds: 'earbuds.png',
  speaker: 'speaker.png',
  projector: 'projector.png',
  camera: 'camera.png',
  'smart-band': 'smart-band.png',
  'power-bank': 'power-bank.png',
  scooter: 'scooter.png',
  laptop: 'laptop.png',
  tv: 'tv.png',
  refrigerator: 'refrigerator.png',
  'robot-vacuum': 'robot-vacuum.png',
  router: 'router.png',
  'range-hood': 'range-hood.png',
  'smart-display': 'smart-display.png',
  'smart-lock': 'smart-lock.png',
  'air-conditioner': 'air-conditioner.png',
  washer: 'washer.png',
  'water-purifier': 'water-purifier.png',
}

export const projectProductImageCatalogEntries: ProjectProductImageEntry[] = [
  { key: 'phone', aliases: ['mobile', 'smartphone'], usage: '常规手机商品图' },
  { key: 'phone-family', aliases: ['phone-group', 'series-phone'], usage: '多配色或多 SKU 手机组图' },
  { key: 'phone-premium', aliases: ['flagship-phone', 'premium-phone'], usage: '旗舰手机主视觉' },
  { key: 'tablet', aliases: ['pad'], usage: '平板设备' },
  { key: 'watch', aliases: ['smart-watch'], usage: '智能手表' },
  { key: 'earbuds', aliases: ['tws', 'earphone'], usage: '真无线耳机' },
  { key: 'speaker', aliases: ['smart-speaker'], usage: '音箱、桌面音频设备' },
  { key: 'projector', aliases: ['beamer'], usage: '投影设备' },
  { key: 'camera', aliases: ['security-camera'], usage: '相机、摄像设备' },
  { key: 'smart-band', aliases: ['band'], usage: '手环' },
  { key: 'power-bank', aliases: ['battery-pack'], usage: '充电宝' },
  { key: 'scooter', aliases: ['electric-scooter'], usage: '滑板车、轻出行设备' },
  { key: 'laptop', aliases: ['notebook', 'computer'], usage: '笔记本电脑' },
  { key: 'tv', aliases: ['television'], usage: '电视、大屏设备' },
  { key: 'refrigerator', aliases: ['fridge'], usage: '冰箱' },
  { key: 'robot-vacuum', aliases: ['vacuum', 'cleaning-robot'], usage: '扫拖机器人及基站' },
  { key: 'router', aliases: ['wifi-router'], usage: '路由器' },
  { key: 'range-hood', aliases: ['hood', 'kitchen-hood'], usage: '油烟机' },
  { key: 'smart-display', aliases: ['display', 'control-screen'], usage: '智能屏、中控屏' },
  { key: 'smart-lock', aliases: ['door-lock', 'lock'], usage: '智能门锁' },
  { key: 'air-conditioner', aliases: ['ac', 'conditioner'], usage: '空调室内机' },
  { key: 'washer', aliases: ['washing-machine'], usage: '洗衣机、洗烘一体' },
  { key: 'water-purifier', aliases: ['purifier', 'water-filter'], usage: '净水设备' },
]

const projectProductImageMap: Partial<Record<ProjectProductImageKey, string>> = {
  phone: phoneImage,
  'phone-family': phoneFamilyImage,
  'phone-premium': phonePremiumImage,
  tablet: tabletImage,
  earbuds: earbudsImage,
  laptop: laptopImage,
  tv: tvImage,
  refrigerator: refrigeratorImage,
  'robot-vacuum': robotVacuumImage,
  router: routerImage,
  'range-hood': rangeHoodImage,
  'smart-display': smartDisplayImage,
  'smart-lock': smartLockImage,
  'air-conditioner': airConditionerImage,
  washer: washerImage,
  'water-purifier': waterPurifierImage,
}

export function getProjectProductImage(key?: ProjectProductImageKey) {
  if (!key) {
    return undefined
  }

  return projectProductImageMap[key]
}
