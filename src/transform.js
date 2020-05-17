import generate from '@babel/generator'
import {compileStyles} from '@dash-ui/styles'

export let transformExpressionWithStyles = (babel, value) => {
  try {
    let t = babel.types
    if (t.isTaggedTemplateExpression(value)) {
      return templateLiteralToString(
        babel.template.smart(minify(value.quasi))().expression,
        babel
      )
    }

    if (t.isStringLiteral(value)) {
      return t.stringLiteral(compileStyles(value.value, {}))
    }

    if (t.isTemplateLiteral(value)) {
      return templateLiteralToString(
        babel.template.smart(minify(value))().expression,
        babel
      )
    }

    if (t.isObjectExpression(value)) {
      return stringifyObject(value, babel)
    }

    if (t.isFunction(value)) {
      if (t.isTemplateLiteral(value.body)) {
        value.body = templateLiteralToString(
          babel.template.smart(minify(value.body))().expression,
          babel
        )
      } else if (t.isObjectExpression(value.body)) {
        value.body = stringifyObject(
          value.body,
          babel,
          getAllowedIdentifiersFromParams(value.params[0], babel)
        )
      } else {
        const replaceReturn = (maybeBlock) => {
          if (t.isReturnStatement(maybeBlock)) {
            const body = maybeBlock.argument
            if (t.isTemplateLiteral(body)) {
              maybeBlock.argument = templateLiteralToString(
                babel.template.smart(minify(body))().expression,
                babel
              )
            } else if (t.isObjectExpression(body)) {
              maybeBlock.argument = stringifyObject(
                body,
                babel,
                getAllowedIdentifiersFromParams(value.params[0], babel)
              )
            } else if (t.isBlockStatement(body)) {
              replaceReturn(body)
            }
          } else if (t.isIfStatement(maybeBlock)) {
            let consequent = maybeBlock.consequent.body

            for (let i = 0; i < consequent.length; i++)
              replaceReturn(consequent[i])

            replaceReturn(maybeBlock.alternate)
          } else if (t.isBlockStatement(maybeBlock)) {
            const block = maybeBlock

            for (let i = 0; i < block.body.length; i++)
              replaceReturn(block.body[i])
          }
        }

        replaceReturn(value.body)
      }
    }
  } catch (err) {
    return
  }
}

export function stringifyObject(node, babel, allowedIdentifiers = []) {
  const t = babel.types
  let finalString = t.stringLiteral('')
  const appendString = (right) => {
    finalString =
      finalString.value !== void 0 && !finalString.value
        ? right
        : t.binaryExpression('+', finalString, right)
  }

  for (let i = 0; i < node.properties.length; i++) {
    let property = node.properties[i]
    if (
      t.isMemberExpression(property.value) &&
      allowedIdentifiers.includes(property.value.object.name)
    ) {
      // It's funny how this just keeps getting more disgusting
    } else if (
      !t.isObjectProperty(property) ||
      property.computed ||
      (t.isIdentifier(property.value) &&
        !allowedIdentifiers.includes(property.value.name)) ||
      (!t.isIdentifier(property.key) && !t.isStringLiteral(property.key)) ||
      (!t.isStringLiteral(property.value) &&
        !t.isNumericLiteral(property.value) &&
        !t.isObjectExpression(property.value) &&
        !t.isIdentifier(property.value))
    ) {
      return node
    }

    let key = property.key.name || property.key.value
    if (t.isObjectExpression(property.value)) {
      let simplifiedChild = stringifyObject(
        property.value,
        babel,
        allowedIdentifiers
      )

      if (
        simplifiedChild === property.value ||
        (!t.isStringLiteral(simplifiedChild) &&
          !t.isBinaryExpression(simplifiedChild))
      ) {
        return node
      }

      appendString(
        t.binaryExpression(
          '+',
          t.stringLiteral(`${key}{`),
          t.binaryExpression('+', simplifiedChild, t.stringLiteral('}'))
        )
      )
    } else if (t.isIdentifier(property.value)) {
      appendString(
        t.binaryExpression(
          '+',
          t.stringLiteral(`${key}:`),
          t.binaryExpression('+', property.value, t.stringLiteral(';'))
        )
      )
    } else if (t.isMemberExpression(property.value)) {
      appendString(
        t.binaryExpression(
          '+',
          t.stringLiteral(`${key}:`),
          t.binaryExpression('+', property.value, t.stringLiteral(';'))
        )
      )
    } else {
      appendString(
        t.stringLiteral(compileStyles({[key]: property.value.value}, {}))
      )
    }
  }

  return finalString
}

export const minify = (value) => {
  let result = value.expressions.reduce((p, node) => {
    p[`${node.loc.start.line}:${node.loc.start.column}`] = `\${${
      generate(node).code
    }}`
    return p
  }, {})
  value.quasis.forEach((node) => {
    result[`${node.loc.start.line}:${node.loc.start.column}`] = node.value.raw
      .replace(/\s{2,}|\n|\t/g, ' ')
      .replace(/([:;,([{}>~/])\s+/g, '$1')
      .replace(/\s+([;,)\]{}>~/!])/g, '$1')
      .replace(/\/\*\s+/, '/*')
      .replace(/\s+\*\//, '*/')
  })
  const keys = Object.keys(result)
  keys.sort((a, b) => {
    const [a0, a1] = a.split(':')
    const [b0, b1] = b.split(':')

    if (a0 === b0) {
      return a1 - b1
    }

    return a0 - b0
  })
  return `\`${keys
    .map((k) => result[k])
    .join('')
    .trim()}\``
}

const templateLiteralToString = (path, babel) => {
  const t = babel.types
  const nodes = []
  const expressions = path.expressions

  let index = 0
  for (const elem of path.quasis) {
    if (elem.value.cooked) {
      nodes.push(t.stringLiteral(elem.value.cooked))
    }

    if (index < expressions.length) {
      const expr = expressions[index++]
      if (!t.isStringLiteral(expr, {value: ''})) {
        nodes.push(expr)
      }
    }
  }

  // since `+` is left-to-right associative
  // ensure the first node is a string if first/second isn't
  const considerSecondNode = !t.isStringLiteral(nodes[1])
  if (!t.isStringLiteral(nodes[0]) && considerSecondNode) {
    nodes.unshift(t.stringLiteral(''))
  }
  let root = nodes[0]

  for (let i = 1; i < nodes.length; i++)
    root = t.binaryExpression('+', root, nodes[i])

  return root
}

const getAllowedIdentifiersFromParams = (params, babel) => {
  const t = babel.types
  const properties = params?.properties
  const allowedIdentifiers = []

  if (properties) {
    for (let property of properties) {
      if (t.isIdentifier(property.value)) {
        allowedIdentifiers.push(property.value.name)
      } else if (t.isObjectPattern(property.value)) {
        allowedIdentifiers.push(
          ...getAllowedIdentifiersFromParams(property.value, babel)
        )
      }
    }
  }

  return allowedIdentifiers
}