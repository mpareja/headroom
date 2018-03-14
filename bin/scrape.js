#!/usr/bin/env node
const createVisitor = require('../lib/api-visitor.js')
const fs = require('fs')
const httpApi = require('../lib/http-api.js')
const path = require('path')
const promisify = require('util').promisify
const withPersistence = require('../lib/persistent-api-decorator.js')
const withQueuing = require('../lib/queuing-api-decorator.js')

function withTracing (obj) {
  const handler = {
    get (target, propKey, receiver) {
      const origMethod = target[propKey]
      return function (...args) {
        const result = origMethod.apply(this, args)
        console.log(propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result))
        return result
      }
    }
  }
  return new Proxy(obj, handler)
}

async function go (dirParam) {
  const dir = path.resolve(process.cwd(), dirParam)
  const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
  const api = withPersistence(withQueuing(withTracing(httpApi(magic)), 15), dir, fs)

  await promisify(fs.mkdir)(dir)

  const visitor = createVisitor()
  await visitor.visit(api)
}

const dirParam = process.argv[2]
if (dirParam) {
  go(dirParam)
} else {
  console.log('SYNTAX: <output directory>')
  process.exit(1)
}
