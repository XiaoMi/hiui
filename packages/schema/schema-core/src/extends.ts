export type DslFn<TClass extends AnyClass> = (
  this: InstanceType<TClass>,
  ...args: AnyType[]
) => InstanceType<TClass>

/**
 * 局部扩展 DSL 链
 * - 内部使用工厂函数创建了新的 Creator 对象，不会对传入的基类（ClassBase）造成影响
 */
export function extendDsl<TClass extends AnyClass, TDslMap extends Record<string, DslFn<TClass>>>(
  ClassBase: TClass,
  helpers: TDslMap
) {
  type ClassParams = ConstructorParameters<typeof ClassBase>
  type ClassInstance = InstanceType<TClass> & TDslMap

  return function dslFactory(...params: ClassParams) {
    const base = Object.create(new ClassBase(...params))

    for (const [key, fn] of Object.entries(helpers)) {
      base[key] = fn
    }

    return base as ClassInstance
  }
}
