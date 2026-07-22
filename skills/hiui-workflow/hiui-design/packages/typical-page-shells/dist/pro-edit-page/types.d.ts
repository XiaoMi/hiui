import type { RefObject } from 'react';
import type { SchemaFormProps, EnhancedFormHelpers } from '@hi-ui/schema-form';
/** 提交/暂存回调入参：成功时为接口返回值，失败时为错误对象 */
export type EditResponse = unknown;
/** before 回调签名：已校验的 data、ctx.formRef，返回 formData 继续，返回 false 中止 */
export type BeforeActionFn = (data: AnyObject, ctx: {
    formRef: RefObject<EnhancedFormHelpers>;
}) => Promise<AnyObject | boolean | void> | AnyObject | boolean | void;
export type ProEditPageProps = {
    fields?: SchemaFormProps['fields'];
    groups?: SchemaFormProps['groups'];
    steps?: [];
    /** 提交前回调：校验/脏检查，返回 formData 继续，返回 false 中止 */
    beforeSubmit?: BeforeActionFn;
    /** 暂存前回调 */
    beforeStash?: BeforeActionFn;
    /** 取消回调 */
    onCancel?: () => void;
    /** 提交成功回调 */
    onSubmitSuccess?: (res: EditResponse) => void;
    /** 提交失败回调 */
    onSubmitError?: (res: EditResponse) => void;
    /** 暂存成功回调 */
    onStashSuccess?: (res: EditResponse) => void;
    /** 暂存失败回调 */
    onStashError?: (res: EditResponse) => void;
};
