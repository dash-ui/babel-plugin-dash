// import {addNamed} from '@babel/helper-module-imports'
import {createMacro} from 'babel-plugin-macros'
import {transformExpressionWithStyles} from './transform'

export let createReactMacro = (/*instancePath*/) =>
  createMacro(function macro({references, state, babel, isDashCall}) {
    if (!isDashCall) {
      state.dashSourceMap = true
    }

    let t = babel.types

    Object.keys(references).forEach((referenceKey) => {
      references[referenceKey].reverse().forEach((reference) => {
        // let runtimeNode = addNamed(state.file.path, referenceKey, instancePath)
        if (['useGlobal', 'useStyle'].includes(referenceKey)) {
          const path = reference
          if (referenceKey === 'useStyle') {
            path.addComment('leading', '#__PURE__')
          }

          if (t.isTaggedTemplateExpression(path.parent)) {
            const node = transformExpressionWithStyles(babel, path.parent)
            if (node) {
              reference.parentPath.replaceWith(
                t.callExpression(reference.node, [node])
              )
            }
          } else if (t.isCallExpression(path.parent)) {
            const ppath = path.parent

            for (let i = 0; i < ppath.arguments.length; i++) {
              const node = transformExpressionWithStyles(
                babel,
                ppath.arguments[i]
              )

              if (node) {
                ppath.arguments[i] = node
              }
            }
          }
        } else if (referenceKey === 'useStyles') {
          const path = reference
          // reference.replaceWith(t.cloneDeep(runtimeNode))
          path.addComment('leading', '#__PURE__')

          for (let arg of path.parent.arguments) {
            if (arg.properties) {
              for (let i = 0; i < arg.properties.length; i++) {
                const node = transformExpressionWithStyles(
                  babel,
                  arg.properties[i].value
                )

                if (node) {
                  arg.properties[i].value = node
                }
              }
            }
          }
        }
      })
    })
  })
