/**
 * 通过监听筛选容器 DOM 尺寸变化获取高度，用于表格 sticky 定位
 */
export declare function useFilterHeight(): {
    filterRef: import("react").RefObject<HTMLDivElement>;
    filterHeight: number;
};
