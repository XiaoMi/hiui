import { jsx as p } from "react/jsx-runtime";
import { Button as u, message as r } from "@hi-ui/hiui";
import { resolveFormData as l } from "../utils/resolve-form-data.js";
import { useProEditPageContext as h } from "../context/entry.js";
import { useInnerContext as d } from "../context/inner.js";
function b(n) {
  const { formRef: s, loading: a, stashAsync: c } = h(), { propsRef: e } = d(), { children: i = "暂存", ...f } = n, m = async () => {
    const o = await l({
      formRef: s,
      before: e.current.beforeStash
    });
    o !== !1 && c(o).then((t) => {
      r.open({ type: "success", title: "暂存成功" }), e.current.onStashSuccess?.(t);
    }).catch((t) => {
      r.open({ type: "error", title: t?.message ?? "暂存失败" }), e.current.onStashError?.(t);
    });
  };
  return /* @__PURE__ */ p(u, { type: "default", loading: a.stashLoading, onClick: m, ...f, children: i });
}
export {
  b as StashButton
};
