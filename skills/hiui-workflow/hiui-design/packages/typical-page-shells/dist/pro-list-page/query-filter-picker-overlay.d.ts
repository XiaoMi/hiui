/**
 * HiUI `@hi-ui/picker`（`Select` / `CheckSelect` 等）：`optionWidth` 未定义时 `matchWidth: true`，
 * 下拉层宽度贴合触发器。表格筛选触发器较窄时选项会换行。
 * 传本对象可关闭「与触发器同宽」，由面板内容撑开宽度。
 *
 * @see `typical-page-patterns.md` §3 · 筛选区 · 下拉选项区宽度
 */
export declare const queryFilterPickerOverlay: {
    readonly matchWidth: false;
};
/**
 * `QueryFilter` 行内 / 抽屉内的 `@hi-ui/date-picker`：
 * `table-stat` 等页面存在 **`filterContainer` `position:sticky` + `z-index`**、白卡 **`overflow:hidden`**、
 * **`Table` `maxHeight` + 粘性表头** 等叠层，默认 Popper **`z-index`（约 1030）** 仍可能与表头等竞争，
 * 表现为 **日期范围面板点选无效或选不满**。
 * 须显式抬高层级并挂到 `document.body`，与 `queryFilterPickerOverlay` 分工对称（Picker vs DatePicker）。
 *
 * @see `typical-page-patterns.md` §3 · 筛选区 · DatePicker 浮层
 */
export declare const queryFilterDatePickerOverlay: {
    readonly zIndex: 1200;
    readonly container: () => HTMLElement | null;
};
