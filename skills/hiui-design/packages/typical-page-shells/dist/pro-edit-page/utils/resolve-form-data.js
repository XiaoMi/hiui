async function s(a) {
  const { formRef: o, before: n } = a, e = await o.current?.validate?.();
  if (e === void 0) return !1;
  if (!n) return e;
  const f = { formRef: o }, t = e;
  return Promise.resolve(n(t, f)).then((r) => r === !1 ? !1 : r === void 0 || r === !0 ? t : r);
}
export {
  s as resolveFormData
};
