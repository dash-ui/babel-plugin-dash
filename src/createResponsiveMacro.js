// import {addNamed} from '@babel/helper-module-imports'
import {createMacro} from 'babel-plugin-macros'
import {transformExpressionWithStyles} from './transform'

export const createResponsiveMacro = (instanceReferenceKey /*instancePath*/) =>
  createMacro(function macro({references, state, babel, isDashCall}) {
    if (!isDashCall) {
      state.dashSourceMap = true
    }

    let t = babel.types

    Object.keys(references).forEach((referenceKey) => {
      // let runtimeNode = addNamed(state.file.path, referenceKey, instancePath)
      if (referenceKey === instanceReferenceKey) {
        references[referenceKey].reverse().forEach((reference) => {
          if (t.isCallExpression(reference.parentPath)) {
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
