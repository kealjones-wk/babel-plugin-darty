"use strict";
// TS support is still incomplete
// @see https://github.com/babel/babel/issues/10637
Object.defineProperty(exports, "__esModule", { value: true });
function dartyPlugin({ types: t }) {
  const visitor = {
    RegExpLiteral(path) {
      path.replaceWith(
        t.newExpression(t.identifier("RegExp"), [
          t.stringLiteral(path.getSource().slice(1, -1)),
        ]),
      );
    },
  };
  return { name: "darty", visitor };
}
exports.default = dartyPlugin;
//# sourceMappingURL=plugin.js.map
