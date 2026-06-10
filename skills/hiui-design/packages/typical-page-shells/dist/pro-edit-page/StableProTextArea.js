import { jsx as f } from "react/jsx-runtime";
import { useRef as l, useLayoutEffect as p } from "react";
import { useMemoizedFn as d } from "ahooks";
import x from "@hi-ui/textarea";
import { ProTextArea as A } from "@hi-ui/schema-fields/bundle";
/* empty css                         */
function b(t, r) {
  t != null && (typeof t == "function" ? t(r) : t.current = r);
}
function F(t) {
  const r = t, { ref: o, autoSize: n, value: u, defaultValue: s, ...m } = r, a = l(null), i = d(() => {
    const e = a.current;
    !e || !n || e.dispatchEvent(new Event("input", { bubbles: !0 }));
  });
  return p(() => {
    i();
    let e = !1;
    const c = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        e || i();
      });
    });
    return () => {
      e = !0, cancelAnimationFrame(c);
    };
  }, [u, s, n, i]), /* @__PURE__ */ f(
    x,
    {
      ...m,
      ref: (e) => {
        a.current = e, b(o, e);
      },
      value: u,
      defaultValue: s,
      autoSize: n
    }
  );
}
class E extends A {
  renderFormItem(r, o) {
    const n = this.getFieldProps({}, o);
    return /* @__PURE__ */ f(F, { ...n });
  }
}
export {
  E as StableProTextArea
};
