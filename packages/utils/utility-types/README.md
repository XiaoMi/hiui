# `@hi-ui/utility-types`

> 公共 TypeScript 类型定义，供 Schema 及其他包使用（仅编译期类型，无运行时代码）。

**单源维护**：类型仅在 `src/types.ts` 中定义；`lib/global.d.ts`（全局声明）由构建时脚本从 `types.ts` 自动派生，无需手写。

**注意**：方式一（import）与方式二（global）**不要在同一项目中同时使用**，否则会因同一类型名在模块与全局中重复定义而触发 TS6200，请二选一。

## 使用方式

### 方式一：按需导入（推荐）

在需要使用的文件中从主入口导入类型：

```ts
import type { Dict, FieldPath, DeepPartial, AnyObject } from '@hi-ui/utility-types'

const config: Dict<string> = {}
const path: FieldPath = 'a.b.c'
```

### 方式二：全局类型（无需每次 import）

若希望在整个项目中直接使用类型名（如 `Dict`、`FieldPath`）而无需 import，可任选其一配置：

**2.1 三斜线引用（推荐）**

在项目根或任意被 `include` 的 `.d.ts` 文件中添加：

```ts
/// <reference types="@hi-ui/utility-types/global" />
```

之后任意 `.ts`/`.tsx` 文件中可直接使用 `Dict`、`FieldPath` 等类型，无需 import。

**2.2 tsconfig 的 `types`**

在 `tsconfig.json` 的 `compilerOptions` 中增加：

```json
{
  "compilerOptions": {
    "types": ["node", "@hi-ui/utility-types/global"]
  }
}
```

注意：一旦设置 `types`，默认的 `@types/*` 不会自动包含，若项目需要 Node 或其他类型，需一并写入上述数组。

## 导出的类型

- `AnyType`, `AnyObject`, `AnyArray`, `UnknownObject`, `AnyFn`, `AnyComponent`
- `Dict<T>`, `PipeFn<T, Extra>`, `ArrayToUnion<T>`
- `DeepPartial<T>`, `FnParameters<T>`, `Optionals<T, K>`, `LiteralUnion<T, U>`, `ValueOf<T>`, `MaybeAsync<T>`
- `Primitive`, `NonFnValue`, `FieldPath`
- `GetterFn`, `AnyGetter`, `GetBoolFn`, `BoolGetter<T>`
