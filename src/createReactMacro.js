// import {addNamed} from '@babel/helper-module-imports'
import { createMacro } from "babel-plugin-macros";
import { transformExpressionWithStyles } from "./transform";

export const createReactMacro = (/*instancePath*/) =>
  createMacro(function macro({ references, state, babel, isDashCall }) {
    if (!isDashCall) {
      state.dashSourceMap = true;
    }

    let t = babel.types;

    Object.keys(references).forEach((referenceKey) => {
      references[referenceKey].reverse().forEach((reference) => {
        // let runtimeNode = addNamed(state.file.path, referenceKey, instancePath)
        if (["useGlobal"].includes(referenceKey)) {
          const path = reference;

          if (t.isTaggedTemplateExpression(path.parent)) {
            const node = transformExpressionWithStyles(babel, path.parent);
            if (node) {
              reference.parentPath.replaceWith(
                t.callExpression(reference.node, [node])
              );
            }
          } else if (t.isCallExpression(path.parent)) {
            const ppath = path.parent;

            for (let i = 0; i < ppath.arguments.length; i++) {
              const node = transformExpressionWithStyles(
                babel,
                ppath.arguments[i]
              );

              if (node) {
                ppath.arguments[i] = node;
              }
            }
          }
        }
      });
    });
  });
