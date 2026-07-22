import { useCallback, useMemo, useRef, useState } from 'react'
import { Button, Message, PageHeader } from '@hi-ui/hiui'
import { F } from '@hi-ui/schema-core'
import { SchemaForm } from '@hi-ui/schema-form'
import type { SchemaFormProps } from '@hi-ui/schema-form'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import { ProDrawerFooterActions, ProFormDrawer } from '@hiui-design/typical-page-shells/pro-form-drawer'
import {
  basicUserOrganizationOptions,
  basicUserPositionOptions,
  basicUserRoleOptions,
  basicUserStatusOptions,
} from './typical-pages.mock'
import { useTranslation } from '../../translation'

type DrawerFormValues = {
  userName?: string
  miTalkId?: string
  phone?: string
  email?: string
  roleId?: string
  positionId?: string
  organizationId?: string
  entryDate?: string
  userStatus?: string
  remark?: string
}

const placeholderStyle = {
  minHeight: 'calc(100vh - 60px)',
  padding: 20,
  background: '#fff',
  borderRadius: '12px 12px 0 0',
  boxSizing: 'border-box' as const,
} as const

const dateProps = {
  format: 'YYYY-MM-DD',
  clearable: true,
} as const

export function DrawerFormPage() {
  const { locale, t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const formRef = useRef(null) as NonNullable<SchemaFormProps<DrawerFormValues>['formRef']>

  const fields = useMemo(
    () => [
      F(t('用户姓名'), 'userName').Text().Required().val,
      F(t('米聊号'), 'miTalkId').Text().val,
      F(t('用户电话'), 'phone').Text().Required().val,
      F(t('邮箱'), 'email').Text().val,
      F(t('用户角色'), 'roleId')
        .Select({ data: basicUserRoleOptions.map((option) => ({ ...option, title: t(option.title) })) })
        .Required()
        .val,
      F(t('岗位名称'), 'positionId')
        .Select({ data: basicUserPositionOptions.map((option) => ({ ...option, title: t(option.title) })) })
        .Required()
        .val,
      F(t('所属机构'), 'organizationId')
        .Select({ data: basicUserOrganizationOptions.map((option) => ({ ...option, title: t(option.title) })) })
        .Required()
        .val,
      F(t('入职日期'), 'entryDate').Date({ ...dateProps }).Required().val,
      F(t('用户状态'), 'userStatus')
        .Select({ data: basicUserStatusOptions.map((option) => ({ ...option, title: t(option.title) })) })
        .Required()
        .val,
      F(t('备注信息'), 'remark').Textarea({ rows: 4 }).MWP({ span: 24 }).val,
    ],
    [t]
  )

  const handleSubmit = useCallback(async () => {
    try {
      await formRef.current?.validate()
    } catch {
      return
    }

    Message.open({ type: 'success', title: t('抽屉表单已提交（示例）') })
    setVisible(false)
  }, [t])

  return (
    <>
      <TypicalPageHeaderPortal>
        <PageHeader
          title={t('抽屉表单')}
          extra={
            <Button type="primary" onClick={() => setVisible(true)}>
              {t('打开抽屉')}
            </Button>
          }
        />
      </TypicalPageHeaderPortal>

      <div style={placeholderStyle}>
        <Button type="primary" onClick={() => setVisible(true)}>
          {t('打开抽屉表单')}
        </Button>
      </div>

      <ProFormDrawer
        key={locale}
        title={t('新增用户')}
        visible={visible}
        width={600}
        closeable
        unmountOnClose={false}
        onClose={() => setVisible(false)}
        footer={
          <ProDrawerFooterActions>
            <Button onClick={() => setVisible(false)}>{t('取消')}</Button>
            <Button type="primary" onClick={handleSubmit}>
              {t('确认')}
            </Button>
          </ProDrawerFooterActions>
        }
      >
        <TypicalPageFieldMapProvider>
          <SchemaForm<DrawerFormValues>
            formRef={formRef}
            fields={fields}
            borderedGroups={false}
            grid
            column={2}
            formProps={{ labelPlacement: 'top' }}
            gridProps={{
              columnCount: 2,
              gutter: 32,
              rowGap: 0,
            }}
          />
        </TypicalPageFieldMapProvider>
      </ProFormDrawer>
    </>
  )
}
