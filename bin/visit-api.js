#!/usr/bin/env node
const createVisitor = require('../lib/api-visitor.js')
const fs = require('fs')
const httpApi = require('../lib/http-api.js')
const magic = require('../lib/magic')
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

async function go (dirParam, activityGroupId) {
  const dir = path.resolve(process.cwd(), dirParam)
  const api = withPersistence(withQueuing(withTracing(httpApi(magic)), 15), dir, fs)

  if (activityGroupId) {
    const visitor = createVisitor()
    visitor.on('error', console.error)
    await visitor.visitActivityGroup(api, activityGroupId)
  } else {
    await promisify(fs.mkdir)(dir)

    const visitor = createVisitor()
    visitor.on('error', console.error)
    await visitor.visit(api)
  }
}

const dirParam = process.argv[2]
const activityGroupId = process.argv[3]
if (dirParam) {
  go(dirParam, activityGroupId)
} else {
  console.log('SYNTAX: <output directory> [activityGroupId]')
  process.exit(1)
}
