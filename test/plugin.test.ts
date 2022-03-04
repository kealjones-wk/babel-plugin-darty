// @see https://github.com/esamattis/babel-plugin-ts-optchain/blob/master/packages/babel-plugin-ts-optchain/__tests__/plugin.test.ts
import regexPlugin from "../src/regex-plugin.ts";
import consolePlugin from "../src/console-plugin.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import dedent from 'https://cdn.skypack.dev/dedent?dts';
import babel from "https://esm.sh/@babel/standalone";

function runPlugin(code: string) {
  const res = babel.transform(code, {
    babelrc: false,
    filename: "test.ts",
    plugins: [consolePlugin,regexPlugin],
  });

  if (!res) {
    throw new Error("plugin failed");
  }

  return res;
}

Deno.test("converts regexp literals to constructors", () => {
  const code = `function MyComponent() {
    const local = {};
    useEffect(() => {
      console.log(local);
      let whatever = /[a-Z]/;
    });
  }`;
  const res = runPlugin(code);
  assertEquals(
    res.code,
    dedent`function MyComponent() {
    const local = {};
    useEffect(() => {
      window.console.log(local);
      let whatever = new RegExp("[a-Z]");
    });
  }`,
  );
});
