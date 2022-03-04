// TS support is still incomplete
// @see https://github.com/babel/babel/issues/10637

// import { PluginDefinition } from "@babel/core";
import type * as BabelTypesNamespace from "https://cdn.skypack.dev/@babel/types";

type BabelTypes = typeof BabelTypesNamespace;
interface Babel {
  types: BabelTypes;
}

export default function regexPlugin({ types: t }: Babel) {
  return {
    name: "regex",
    visitor: {
      // export ...
      RegExpLiteral(path: any) {
        path.replaceWith(
          t.newExpression(t.identifier("RegExp"), [
            t.stringLiteral(path.getSource().slice(1, -1)),
          ]),
        );
      },
    },
  };
}
