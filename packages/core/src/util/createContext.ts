import { provide, inject } from 'vue';

/**
 * 对于 Vue.js 的 context 提供支持
 * 封装了 Vue.js 的 provide 和 inject
 *
 * 使用方法：
 *
 * example: https://codesandbox.io/s/createcontext-dek80f
 *
 * 新建单独`context`模块`context.ts`
 * ```ts
 * import { createContext } from '@lt/vue-hooks';
 * const name = Symbol("name");
 * interface ThemeContext {
 * 		theme: Ref<"light" | "dark">;
 *}
 *
 * const [createThemeProvider, useThemeCustomer] = createContext<ThemeContext>(
 *     name,
 * 	   {
 *   	 theme: ref("dark")
 * 	   }
 *  );
 * export { createThemeProvider, useThemeCustomer };
 * ```
 * `顶层组件中`
 * ```ts
 *   createThemeProvider();
 * ```
 * `子组件中`
 * ```ts
 *   const context = useThemeCustomer();
 *   const { theme } = context;
 * ```
 * @param name
 * @param defaultValue
 * @returns
 */
export function createContext<T>(name: symbol, defaultValue: T | (() => T)) {
    return [(context: T) => provide(name, context), () => inject(name, defaultValue) as T] as const;
}
