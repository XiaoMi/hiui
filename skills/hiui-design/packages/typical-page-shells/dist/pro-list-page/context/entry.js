import { jsx as u } from "react/jsx-runtime";
import s from "react";
import { useSubscription as c } from "@hi-ui/use-subscription";
import { useFetchList as L } from "../hooks/use-fetch-list.js";
const a = s.createContext(null);
function d(e) {
  const { request: r, defaultPageSize: o } = e, i = c({
    filters: [],
    sorters: [],
    pagination: {
      current: 1,
      pageSize: o ?? 20
    }
  }), t = L({ subscription: i, request: r }), n = s.useMemo(
    () => ({
      subscription: i,
      listData: t.listData,
      isListDataLoading: t.isListDataLoading,
      getListData: t.getListData,
      refreshListData: t.refreshListData
    }),
    [
      // 依赖项
      i,
      t.listData,
      t.isListDataLoading,
      t.getListData,
      t.refreshListData
    ]
  );
  return /* @__PURE__ */ u(a.Provider, { value: n, children: e.children });
}
function l() {
  const e = s.useContext(a);
  if (!e)
    throw new Error("useProListPageContext must be used within a ProListPageProvider");
  return e;
}
export {
  d as ProListPageProvider,
  l as useProListPageContext
};
