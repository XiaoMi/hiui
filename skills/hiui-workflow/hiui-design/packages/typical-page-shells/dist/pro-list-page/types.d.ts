import type { FieldConfigType } from '@hi-ui/schema-core';
export type { GetDataSourceType } from '@hi-ui/schema-core';
export type ProListPageProps = {
    /** 查询区字段配置 */
    queryFields: FieldConfigType[];
    /** 表格列字段配置 */
    tableFields: FieldConfigType[];
};
