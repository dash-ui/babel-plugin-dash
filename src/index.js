import nodePath from 'path'
import {createStylesMacro} from './createStylesMacro'
import {createReactMacro} from './createReactMacro'
import {createMqMacro} from './createMqMacro'

export const macros = {
  createStylesMacro,
  createReactMacro,
  createMqMacro,
}

const getAbsolutePath = (instancePath, rootPath) => {
  if (instancePath.charAt(0) === '.') {
    let absoluteInstancePath = nodePath.resolve(rootPath, instancePath)
    return absoluteInstancePath
  }
  return false
}

const getInstancePathToCompare = (instancePath, rootPath) => {
  let absolutePath = getAbsolutePath(instancePath, rootPath)
  if (absolutePath === false) {
    return instancePath
  }
  return absolutePath
}

export default function (babel) {
  let t = babel.types
  return {
    name: 'dash',
    visitor: {
      ImportDeclaration(path, state) {
        const hasFilepath =
          path.hub.file.opts.filename &&
          path.hub.file.opts.filename !== 'unknown'

        let dirname = hasFilepath
          ? nodePath.dirname(path.hub.file.opts.filename)
          : ''

        if (!state.pluginMacros[path.node.source.value]) {
          const cmpPath = getInstancePathToCompare(
            path.node.source.value,
            dirname
          )

          if (state.dashInstancePaths.styles[cmpPath] !== void 0) {
            state.pluginMacros[path.node.source.value] = createStylesMacro(
              state.dashInstancePaths.styles[cmpPath],
              path.node.source.value
            )
          } else if (state.dashInstancePaths.react[cmpPath] !== void 0) {
            state.pluginMacros[path.node.source.value] = createReactMacro(
              path.node.source.value
            )
          } else if (state.dashInstancePaths.mq[cmpPath] !== void 0) {
            state.pluginMacros[path.node.source.value] = createMqMacro(
              state.dashInstancePaths.mq[cmpPath],
              path.node.source.value
            )
          }
        }

        let pluginMacros = state.pluginMacros

        // most of this is from https://github.com/kentcdodds/babel-plugin-macros/blob/master/src/index.js
        if (pluginMacros[path.node.source.value] === undefined) {
          return
        }
        if (t.isImportNamespaceSpecifier(path.node.specifiers[0])) {
          return
        }
        const imports = path.node.specifiers.map((s) => ({
          localName: s.local.name,
          importedName:
            s.type === 'ImportDefaultSpecifier' ? 'default' : s.imported.name,
        }))
        let shouldExit = false
        let hasReferences = false
        const referencePathsByImportName = imports.reduce(
          (byName, {importedName, localName}) => {
            let binding = path.scope.getBinding(localName)
            if (!binding) {
              shouldExit = true
              return byName
            }
            byName[importedName] = binding.referencePaths
            hasReferences =
              hasReferences || Boolean(byName[importedName].length)
            return byName
          },
          {}
        )

        if (!hasReferences || shouldExit) {
          return
        }
        /**
         * Other plugins that run before babel-plugin-macros might use path.replace, where a path is
         * put into its own replacement. Apparently babel does not update the scope after such
         * an operation. As a remedy, the whole scope is traversed again with an empty "Identifier"
         * visitor - this makes the problem go away.
         *
         * See: https://github.com/kentcdodds/import-all.macro/issues/7
         */
        state.file.scope.path.traverse({
          Identifier() {},
        })

        pluginMacros[path.node.source.value]({
          references: referencePathsByImportName,
          state,
          babel,
          isBabelMacrosCall: true,
          isDashCall: true,
        })
      },
      Program(path, state) {
        const instances = state.opts.instances || {}
        state.dashInstancePaths = ['styles', 'mq', 'react'].reduce(
          (acc, instanceType) => {
            const it = instances[instanceType] || []

            if (Array.isArray(it)) {
              acc[instanceType] = it.reduce((acc, ip) => {
                acc[getInstancePathToCompare(ip, process.cwd())] = 'default'
                return acc
              }, {})
            } else if (typeof it === 'object') {
              acc[instanceType] = Object.keys(it).reduce((acc, ip) => {
                const referenceKey = it[ip]
                acc[getInstancePathToCompare(ip, process.cwd())] = referenceKey
                return acc
              }, {})
            }

            return acc
          },
          {}
        )

        state.pluginMacros = {
          '@dash-ui/styles': createStylesMacro('default', '@dash-ui/styles'),
          '@dash-ui/react': createReactMacro('@dash-ui/react'),
        }
      },
    },
  }
}
