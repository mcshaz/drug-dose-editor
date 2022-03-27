/* eslint-disable @typescript-eslint/no-explicit-any */
import * as round from './rounding'

export interface IAnthro { weightKg: number; ageMonths?: number; heightCm?: number; bsa?: number; cgaWeeks?: number }
export type primativeType = string | boolean | number | null

type propertiesOfType<TObj, TResult> = { [K in keyof TObj]: TObj[K] extends TResult ? K : never }[keyof TObj]

type AnthroDescription = { variable: string & propertiesOfType<IAnthro, number | undefined>; description: string }

const anthroMeasures: AnthroDescription[] = [
  { variable: 'weightKg', description: 'weight (kilograms)' },
  { variable: 'ageMonths', description: 'age (months)' },
  { variable: 'heightCm', description: 'height (cm)' },
  { variable: 'bsa', description: 'body surface area (m²)' },
  { variable: 'cgaWeeks', description: 'corrected gestational age (weeks)' }
]

const anthroVariables = anthroMeasures.map(a => a.variable)

if (!(globalThis as any).round || !(globalThis as any).round.syringeVolume) {
  (globalThis as Record<string, unknown>).round = round
}

export function replaceWithEnDash (el: DocumentFragment) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n: Node) => ((n.nodeType === Node.ELEMENT_NODE && n.nodeName !== 'CODE') ||
        ((n.nodeType === Node.TEXT_NODE) && /\S/.test(n.nodeValue!)))
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT
  })
  let n: Node | null
  while ((n = walk.nextNode())) {
    if (n.nodeType === Node.TEXT_NODE && n.nodeValue !== null) n.nodeValue = n.nodeValue.replace(/(\d)\s*-\s*(\d)/g, (match, p1, p2) => `${p1}–${p2}`)
  }
}

function alterTextNodes (el: Node, transform: (textContent: string) => string) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n: Node) => (/\S/.test(n.nodeValue!))
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT
  })
  let n: Node | null
  while ((n = walk.nextNode())) {
    if (n.nodeValue !== null) n.nodeValue = transform(n.nodeValue)
  }
}

function replaceCalcs (el: DocumentFragment, anthro: IAnthro) {
  for (const c of el.querySelectorAll('code')) {
    const output = document.createElement('output')
    output.append(...c.childNodes)
    alterTextNodes(output, textContent => {
      const unknownTerm = unknownJSTerm(textContent, anthroVariables)
      if (unknownTerm) {
        return `{Unknown:'${unknownTerm}'}`
      } else {
        const p = parseAnthro(textContent, anthro)
        if (p instanceof Error) {
          return '{Syntax Error}'
        }
        return String(p)
      }
    })
    if (c.parentElement) c.parentElement.replaceChild(output, c)
  }
}

function parseAnthro (sanitizedExpression: string, anthro: IAnthro): primativeType | Error {
  return parseExpression<IAnthro>(sanitizedExpression, anthro, anthroVariables)
}

const allowedInstructions = ['if', 'then', 'else', 'return', 'undefined', 'null', 'try', 'catch', 'finally']
const allowedFunctions = ['.toFixed', '.toPrecision', 'parseInt', 'parseFloat', 'Number', 'isNaN', 'isFinite']
function unknownJSTerm (expression: string, variables: string[]) {
  const isBuiltIn = (builtInName: string, command: string) =>
    command.startsWith(builtInName + '.') &&
    Object.prototype.hasOwnProperty.call(globalThis[builtInName as never], command.substring(builtInName.length + 1))
  // remove string template strings but leave any code the interpreter will deal with
  expression = expression.replace(/[`}](?:(?=(\\?))\1.)*?(`|\${)/g, ' ')
  // remove text in single and double quotes
  for (const e of expression.split(/(["'])(?:(?=(\\?))\2.)*?\1/g)) {
    for (let m of e.match(/\.?[a-zA-Z][\w.]*(\s*\()?/g) || []) {
      if (m.endsWith('(')) { // function
        m = m.substring(0, m.length - 1).trimEnd()
        if (!isBuiltIn('Math', m) &&
          !isBuiltIn('Number', m) &&
          !isBuiltIn('round', m) &&
          !allowedFunctions.includes(m)) return m
      } else if (!allowedInstructions.includes(m) && !variables.includes(m)) {
        return m
      }
    }
  }
  return null
}
function parseExpression<T> (sanitizedExpression: string, obj: T, keys: Array<string & propertiesOfType<T, number | undefined | null>>): primativeType | Error {
  // string method
  // props: Array<string & propertiesOfType<T, number | undefined | null>>
  /*
  for (const prop of props) {
    const val = obj[prop]
    // a bit of a hack - null behaves like 0 in ES, whereas undefined behaves more as expected
    expression = expression.replaceAll(new RegExp(`\b${prop}\b`, 'g'), typeof val === 'number' ? val.toString() : 'undefined')
  }
  // probably better with a whitelist here isNaN, Math functions etc ...
  if (/(alert)|(prompt)|(document)|(fetch)|(XMLHttpRequest)/.test(expression)) {
    throw new Error(`expresson is potentially malicious: '${expression}'`)
  }
  // ? remove newlines and semicolons to ensure single expression tree
  try {
    // eslint-disable-next-line no-new-func
    const f = new Function(`return ${expression};`)
    return f() as primativeType
  }
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    // note destructuring object assignment not compatible with ie11
    // eslint-disable-next-line no-new-func
    const f = new Function(`const {${keys.join(',')}}=arguments[0];return ${sanitizedExpression};`)
    return f(obj) as primativeType
  } catch (e) {
    if (!(e instanceof Error) || !(e.name === 'SyntaxError' || e.name === 'ReferenceError')) throw e
    console.warn(`SyntaxError caught:\n${e}\nresulting from expression: '${sanitizedExpression}'`)
    return e
  }
}

export { anthroMeasures, parseAnthro, replaceCalcs }
