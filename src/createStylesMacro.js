// import {addNamed} from '@babel/helper-module-imports'
import {createMacro} from 'babel-plugin-macros'
import {transformExpressionWithStyles} from './transform'

export const createStylesMacro = (instanceReferenceKey /*instancePath*/) =>
  createMacro(function macro({references, state, babel, isDashCall}) {
    if (!isDashCall) {
      state.dashSourceMap = true
    }

    let t = babel.types

    Object.keys(references).forEach((referenceKey) => {
      // let runtimeNode = addNamed(state.file.path, referenceKey, instancePath)
      if (referenceKey === instanceReferenceKey) {
        references[referenceKey].reverse().forEach((reference) => {
          if (t.isMemberExpression(reference.parent)) {
            if (
              ['one', 'global', 'keyframes'].includes(
                reference.parent.property.name
              )
            ) {
              const path = reference.parentPath

              if (reference.parent.property.name === 'one') {
                path.addComment('leading', '#__PURE__')
              }

              if (t.isTaggedTemplateExpression(path.parent)) {
                const node = transformExpressionWithStyles(babel, path.parent)
                if (node) {
                  reference.parentPath.parentPath.replaceWith(
                    t.callExpression(reference.parentPath.node, [node])
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
            }
          } else if (t.isCallExpression(reference.parentPath)) {
            const path = reference.parentPath
            // reference.replaceWith(t.cloneDeep(runtimeNode))
            path.addComment('leading', '#__PURE__')

            for (let arg of path.node.arguments) {
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
      }
    })
  })
