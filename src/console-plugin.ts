// deno-lint-ignore-file no-explicit-any

import type * as BabelTypesNamespace from "https://cdn.skypack.dev/@babel/types?dts";

type BabelTypes = typeof BabelTypesNamespace;

interface Babel {
  types: BabelTypes;
}

export default function({ types: t }: Babel) {
  return {
    name: "console",
    visitor: {
      CallExpression(path: any, state:any) {
        const callee = path.get("callee");

        if (!callee.isMemberExpression()) return;

        if (isIncludedConsole(callee, state.opts.exclude)) {
          // console.log()
          if (path.parentPath.isExpressionStatement()) {
            // console.log(path.parent)
            path.replaceWith(createNewCall(callee.get("property"), callee.arguments));
          } else {
            path.replaceWith(createNewCall(callee.get("property"), callee.arguments));
          }
        } else if (isIncludedConsoleBind(callee, state.opts.exclude)) {
          // console.log.bind()
          path.replaceWith(createNewCall(callee.get("property"), callee.arguments));
        }
      },
      MemberExpression: {
        exit(path:any, state:any) {
          if (
            isIncludedConsole(path, state.opts.exclude) &&
            !path.parentPath.isMemberExpression()
          ) {
            if (
              path.parentPath.isAssignmentExpression() &&
              path.parentKey === "left"
            ) {
              path.parentPath.get("right").replaceWith(createNoop());
            } else {
              path.replaceWith(createNoop());
            }
          }
        }
      }
    }
  };

  function isGlobalConsoleId(id:any) {
    const name = "console";
    return (
      id.isIdentifier({ name }) &&
      !id.scope.getBinding(name) &&
      id.scope.hasGlobal(name)
    );
  }

  function isExcluded(property:any, excludeArray:any) {
    return (
      excludeArray && excludeArray.some((name:string) => property.isIdentifier({ name }))
    );
  }

  function isIncludedConsole(memberExpr:any, excludeArray:any) {
    const object = memberExpr.get("object");
    const property = memberExpr.get("property");

    if (isExcluded(property, excludeArray)) return false;

    if (isGlobalConsoleId(object)) return true;

    return (
      isGlobalConsoleId(object.get("object")) &&
      (property.isIdentifier({ name: "call" }) ||
        property.isIdentifier({ name: "apply" }))
    );
  }

  function isIncludedConsoleBind(memberExpr:any, excludeArray:any) {
    const object = memberExpr.get("object");

    if (!object.isMemberExpression()) return false;
    if (isExcluded(object.get("property"), excludeArray)) return false;

    return (
      isGlobalConsoleId(object.get("object")) &&
      memberExpr.get("property").isIdentifier({ name: "bind" })
    );
  }

  function createNoop() {
    return t.functionExpression(null, [], t.blockStatement([]));
  }

  function createNewCall(method: any, args: any) {
    console.log(method);
    console.log(args);
    return t.callExpression(t.memberExpression(t.memberExpression(t.identifier('window'), t.identifier('console')), t.identifier(method.escapedText)), args);
  }
};