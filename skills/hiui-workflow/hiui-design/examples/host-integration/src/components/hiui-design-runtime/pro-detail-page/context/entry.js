import { jsx as i } from "react/jsx-runtime";
import e from "react";
import { useFetchDetail as D } from "../hooks/use-fetch-detail.js";
import { GroupDataProvider as l } from "@hi-ui/schema-group";
const r = e.createContext(null);
function c(a) {
  const t = D({ request: a.request }), o = e.useMemo(
    () => ({
      loading: t.isDetailDataLoading,
      // 还可补充其他加载状态来源
      detailData: t.detailData,
      isDetailDataLoading: t.isDetailDataLoading,
      getDetailData: t.getDetailData,
      refreshDetailData: t.refreshDetailData
    }),
    [t.detailData, t.isDetailDataLoading, t.getDetailData, t.refreshDetailData]
  );
  return /* @__PURE__ */ i(r.Provider, { value: o, children: /* @__PURE__ */ i(l, { dataSource: t.detailData ?? {}, children: a.children }) });
}
function P() {
  const a = e.useContext(r);
  if (!a)
    throw new Error("useProDetailPageContext must be used within a ProDetailPageProvider");
  return a;
}
export {
  c as ProDetailPageProvider,
  P as useProDetailPageContext
};
