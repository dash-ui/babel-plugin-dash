import nodePath from 'path'
import {createDashMacro} from './createDashMacro'

export const macros = {
  createDashMacro,
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

        if (
          !state.pluginMacros[path.node.source.value] &&
          state.dashInstancePaths.indexOf(
            getInstancePathToCompare(path.node.source.value, dirname)
          ) !== -1
        ) {
          state.pluginMacros[path.node.source.value] = createDashMacro(
            path.node.source.value
          )
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
          isdashCall: true,
        })
        if (!pluginMacros[path.node.source.value].keepImport) {
          path.remove()
        }
      },
      Program(path, state) {
        state.dashInstancePaths = (
          state.opts.instances || []
        ).map((instancePath) =>
          getInstancePathToCompare(instancePath, process.cwd())
        )

        state.pluginMacros = {
          '@dash-ui/styles': createDashMacro('@dash-ui/styles'),
        }
      },
    },
  }
}
