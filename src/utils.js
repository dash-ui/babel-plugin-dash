import generate from '@babel/generator'
import {compileStyles} from '@dash-ui/styles'

export function simplifyObject(node, babel, allowedIdentifiers = []) {
  let finalString = ''
  const t = babel.types

  for (let i = 0; i < node.properties.length; i++) {
    let property = node.properties[i]

    if (
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
      let simplifiedChild = simplifyObject(
        property.value,
        babel,
        allowedIdentifiers
      )
      if (!t.isStringLiteral(simplifiedChild)) {
        return node
      }
      finalString += `${key}{${simplifiedChild.value}}`
      continue
    }

    if (t.isIdentifier(property.value)) {
      finalString += `${key}:\${${property.value.name}};`
    } else {
      finalString += compileStyles(`${key}:${property.value.value};`, {})
    }
  }

  return templateLiteralToString(
    babel.template.smart(`\`${finalString}\``)().expression,
    babel
  )
}

export const min = (value) => {
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

export let transformExpressionWithStyles = (babel, value) => {
  let t = babel.types
  if (t.isTaggedTemplateExpression(value)) {
    return templateLiteralToString(
      babel.template.smart(min(value.quasi))().expression,
      babel
    )
  }

  if (t.isStringLiteral(value)) {
    return t.stringLiteral(compileStyles(value.value, {}))
  }

  if (t.isTemplateLiteral(value)) {
    return templateLiteralToString(
      babel.template.smart(min(value))().expression,
      babel
    )
  }

  if (t.isObjectExpression(value)) {
    return simplifyObject(value, babel)
  }

  if (t.isFunction(value)) {
    if (t.isTemplateLiteral(value.body)) {
      value.body = templateLiteralToString(
        babel.template.smart(min(value.body))().expression,
        babel
      )
    } else if (t.isObjectExpression(value.body)) {
      value.body = simplifyObject(
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
              babel.template.smart(min(body))().expression,
              babel
            )
          } else if (t.isObjectExpression(body)) {
            maybeBlock.argument = simplifyObject(
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
