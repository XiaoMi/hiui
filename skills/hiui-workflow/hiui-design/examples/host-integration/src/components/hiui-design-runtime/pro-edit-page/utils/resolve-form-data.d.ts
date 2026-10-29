import type { RefObject } from 'react';
import type { EnhancedFormHelpers } from '@hi-ui/schema-form';
import type { BeforeActionFn } from '../types';
export type ResolveFormDataOpts = {
    formRef: RefObject<EnhancedFormHelpers>;
    before?: BeforeActionFn;
};
/**
 * 解析 formData
 * - 始终先执行 formRef.validate，校验通过后再执行 before（若有）
 * - before 明确返回 false 时中止，返回其他值则继续
 */
export declare function resolveFormData(opts: ResolveFormDataOpts): Promise<AnyObject | false>;
