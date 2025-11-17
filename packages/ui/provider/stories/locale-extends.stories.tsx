import React from 'react'
import Provider from '../src'
import { LocaleEnum } from '@hi-ui/locale-context'
import Pagination from '@hi-ui/pagination'
import DatePicker from '@hi-ui/date-picker'
import Select from '@hi-ui/select'

// 按需引入语言包
import jaJP from '@hi-ui/locale-context/locale/ja-JP'
import koKR from '@hi-ui/locale-context/locale/ko-KR'
import thTH from '@hi-ui/locale-context/locale/th-TH'
import viVN from '@hi-ui/locale-context/locale/vi-VN'
import frFR from '@hi-ui/locale-context/locale/fr-FR'
import deDE from '@hi-ui/locale-context/locale/de-DE'
import esES from '@hi-ui/locale-context/locale/es-ES'
import itIT from '@hi-ui/locale-context/locale/it-IT'
import ptPT from '@hi-ui/locale-context/locale/pt-PT'
import ptBR from '@hi-ui/locale-context/locale/pt-BR'
import ruRU from '@hi-ui/locale-context/locale/ru-RU'
import azAZ from '@hi-ui/locale-context/locale/az-AZ'
import hyAM from '@hi-ui/locale-context/locale/hy-AM'
import kaGE from '@hi-ui/locale-context/locale/ka-GE'
import uzUZ from '@hi-ui/locale-context/locale/uz-UZ'
import bsBA from '@hi-ui/locale-context/locale/bs-BA'
import bgBG from '@hi-ui/locale-context/locale/bg-BG'
import urPK from '@hi-ui/locale-context/locale/ur-PK'
import nlNL from '@hi-ui/locale-context/locale/nl-NL'
import csCZ from '@hi-ui/locale-context/locale/cs-CZ'
import daDK from '@hi-ui/locale-context/locale/da-DK'
import elGR from '@hi-ui/locale-context/locale/el-GR'
import fiFI from '@hi-ui/locale-context/locale/fi-FI'
import trTR from '@hi-ui/locale-context/locale/tr-TR'

/**
 * @title 添加语言包
 */
export const LocaleExtends = () => {
  const [locale, setLocale] = React.useState<LocaleEnum | undefined>(undefined)

  // 所有支持的语言列表
  const languageOptions = [
    // 亚洲语言
    { id: 'zh-CN', title: '中文简体' },
    { id: 'zh-HK', title: '中文（香港）' },
    { id: 'zh-TW', title: '中文繁体（台湾）' },
    { id: 'ja-JP', title: '日语' },
    { id: 'ko-KR', title: '韩语' },
    { id: 'vi-VN', title: '越语' },
    { id: 'th-TH', title: '泰语' },
    // 欧洲语言
    { id: 'en-US', title: '英语' },
    { id: 'pt-PT', title: '葡萄牙语（欧洲）' },
    { id: 'pt-BR', title: '葡萄牙语（巴西）' },
    { id: 'fr-FR', title: '法语' },
    { id: 'de-DE', title: '德语' },
    { id: 'es-ES', title: '西班牙语' },
    { id: 'it-IT', title: '意大利语' },
    { id: 'nl-NL', title: '荷兰语' },
    { id: 'el-GR', title: '希腊语' },
    { id: 'cs-CZ', title: '捷克语' },
    { id: 'da-DK', title: '丹麦语' },
    { id: 'fi-FI', title: '芬兰语' },
    { id: 'tr-TR', title: '土耳其语' },
    // 高加索和中亚语言
    { id: 'hy-AM', title: '亚美尼亚语' },
    { id: 'az-AZ', title: '阿塞拜疆语' },
    { id: 'ru-RU', title: '俄语' },
    { id: 'ka-GE', title: '格鲁吉亚语' },
    { id: 'uz-UZ', title: '乌兹别克语' },
    // 巴尔干语言
    { id: 'bs-BA', title: '波斯尼亚语' },
    { id: 'bg-BG', title: '保加利亚语' },
    // 南亚语言
    { id: 'ur-PK', title: '乌尔都语' },
  ]

  React.useEffect(() => {
    // 正常情况下面这段代码可直接写在组件外面，由于组件示例的限制，这里写在了组件内部
    Provider.extends('ja-JP', jaJP)
    Provider.extends('ko-KR', koKR)
    Provider.extends('th-TH', thTH)
    Provider.extends('vi-VN', viVN)
    Provider.extends('fr-FR', frFR)
    Provider.extends('de-DE', deDE)
    Provider.extends('es-ES', esES)
    Provider.extends('it-IT', itIT)
    Provider.extends('pt-PT', ptPT)
    Provider.extends('pt-BR', ptBR)
    Provider.extends('ru-RU', ruRU)
    Provider.extends('az-AZ', azAZ)
    Provider.extends('hy-AM', hyAM)
    Provider.extends('ka-GE', kaGE)
    Provider.extends('uz-UZ', uzUZ)
    Provider.extends('bs-BA', bsBA)
    Provider.extends('bg-BG', bgBG)
    Provider.extends('ur-PK', urPK)
    Provider.extends('nl-NL', nlNL)
    Provider.extends('cs-CZ', csCZ)
    Provider.extends('da-DK', daDK)
    Provider.extends('el-GR', elGR)
    Provider.extends('fi-FI', fiFI)
    Provider.extends('tr-TR', trTR)
  }, [])

  return (
    <>
      <h1>添加语言包</h1>
      <div className="provider-basic__wrap">
        <Provider locale={locale}>
          <Select
            style={{ width: 240 }}
            placeholder="选择语言"
            data={languageOptions}
            value={locale}
            onChange={(val) => setLocale(val as LocaleEnum)}
          />

          <DatePicker style={{ width: 240, margin: '24px 0' }} />
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Provider>
      </div>
    </>
  )
}
