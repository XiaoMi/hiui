import { jsx as f } from "react/jsx-runtime";
import { Button as p, message as r } from "@hi-ui/hiui";
import { resolveFormData as l } from "../utils/resolve-form-data.js";
import { useProEditPageContext as b } from "../context/entry.js";
import { useInnerContext as d } from "../context/inner.js";
function C(n) {
  const { formRef: s, loading: i, submitAsync: m } = b(), { propsRef: o } = d(), { children: c = "保存", ...u } = n, a = async () => {
    const e = await l({
      formRef: s,
      before: o.current.beforeSubmit
    });
    e !== !1 && m(e).then((t) => {
      r.open({ type: "success", title: "保存成功" }), o.current.onSubmitSuccess?.(t);
    }).catch((t) => {
      r.open({ type: "error", title: t?.message ?? "保存失败" }), o.current.onSubmitError?.(t);
    });
  };
  return /* @__PURE__ */ f(p, { type: "primary", loading: i.submitLoading, onClick: a, ...u, children: c });
}
export {
  C as SubmitButton
};
